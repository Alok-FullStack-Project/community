// uploadFamilyCSV.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const Family = require('./models/Family');
const FamilyMember = require('./models/FamilyMember');

///// CONFIG - change these /////
const MONGO_URI = 'mongodb://127.0.0.1:27017/communitydb'; // <-- set your DB
const CSV_PATH = path.join(__dirname, 'family_data.csv'); // <-- CSV file path
const CREATED_USER = '68e52d4c8f6d3be0590bc4af'; // <-- user id to assign as createdUser
const PREFIX = '42KPS'; // fixed prefix
/////////////////////////////////

// helper: case-insensitive get field (allow multiple name variants)
function getField(row, names) {
  const keys = Array.isArray(names) ? names : [names];
  for (const n of keys) {
    const k = Object.keys(row).find(
      (x) => (x || '').trim().toLowerCase() === (n || '').trim().toLowerCase()
    );
    if (k) return (row[k] || '').toString().trim();
  }
  return '';
}

// parse DD/MM/YYYY or D/M/YYYY -> Date or null
function parseDateDMY(s) {
  if (!s) return null;
  const str = s.toString().trim();
  if (!str) return null;
  const sep = str.includes('/') ? '/' : str.includes('-') ? '-' : str.includes('.') ? '.' : null;
  if (sep) {
    const parts = str.split(sep).map(p => p.replace(/[^\d]/g, ''));
    if (parts.length === 3) {
      let [d, m, y] = parts;
      if (y.length === 2) y = Number(y) > 30 ? '19' + y : '20' + y;
      const day = Number(d), month = Number(m), year = Number(y);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) return new Date(year, month - 1, day);
    }
  }
  // fallback: try ISO parse
  const iso = new Date(str);
  return isNaN(iso) ? null : iso;
}

// normalize mobile numbers: handle Excel scientific notation like "9.93E+09"
function normalizeMobile(v) {
  if (!v && v !== 0) return '';
  const s = String(v).trim();
  if (!s) return '';
  // if it's in scientific notation (contains E or e), convert using Number -> integer string
  if (/e/i.test(s)) {
    const num = Number(s);
    if (!isNaN(num)) return String(Math.trunc(num));
  }
  // remove non-digit chars, keep leading +
  const cleaned = s.replace(/[^\d+]/g, '');
  return cleaned;
}

// fetch maximum family seq from DB for PREFIX (e.g. 0001 from 42KPS-0001-01)
async function fetchMaxFamilySeq() {
  const regex = new RegExp(`^${PREFIX}-(\\d{4})-\\d{2}$`);
  const doc = await Family.findOne({ headId: { $regex: regex } }).sort({ createdDate: -1 }).lean();
  if (!doc || !doc.headId) return 0;
  const m = doc.headId.match(regex);
  if (!m) return 0;
  return parseInt(m[1], 10) || 0;
}

// in-memory counter (initialized from DB)
let familyCounter = 0;
function genFamilyHeadId() {
  familyCounter += 1;
  return `${PREFIX}-${String(familyCounter).padStart(4, '0')}-01`;
}

// compute next member id for a given familyHeadId like "42KPS-0001-01"
async function genNextMemberId(familyHeadId) {
  const familyCode = familyHeadId.split('-').slice(0,2).join('-'); // "42KPS-0001"
  const regex = new RegExp(`^${familyCode}-\\d{2}$`);
  const members = await FamilyMember.find({ memeberID: { $regex: regex } }).select('memeberID').lean();
  let max = 1; // head is 01
  members.forEach(m => {
    const parts = (m.memeberID || '').split('-');
    const suf = parts[parts.length - 1];
    const n = parseInt(suf, 10);
    if (!isNaN(n) && n > max) max = n;
  });
  const next = max + 1;
  return `${familyCode}-${String(next).padStart(2, '0')}`;
}

// read CSV and return rows (skipping blank rows)
async function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const hasData = Object.values(row).some(v => v && String(v).trim() !== '');
        if (!hasData) return; // skip completely blank row
        rows.push(row);
      })
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

// group rows by No or prefix of Sub No (so 1.1,1.2 -> group 1)
function groupRows(rows) {
  const groups = new Map();
  for (const row of rows) {
    const no = getField(row, ['No','no','No.']);
    const subNo = getField(row, ['Sub No','SubNo','Sub_No','sub no','subno']);
    let key = '';
    if (no) key = no;
    else if (subNo) key = subNo.split('.')[0] || subNo;
    else key = '__ungrouped__'; // fallback
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

(async function main() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('MongoDB connected');

    // initialize familyCounter from DB
    const maxSeq = await fetchMaxFamilySeq();
    familyCounter = maxSeq;
    console.log('Starting familyCounter at', familyCounter);

    const rows = await readCsv(CSV_PATH);
    console.log('CSV rows (non-empty):', rows.length);

    const groups = groupRows(rows);
    console.log('Groups to process:', groups.size);

    for (const [key, groupRows] of groups.entries()) {
      // find SELF row in group (case-insensitive)
      const selfRow = groupRows.find(r => (getField(r, 'relation') || '').trim().toLowerCase() === 'self');

      if (!selfRow) {
        console.warn(`Group ${key} has no SELF row; skipping group`);
        continue;
      }

      // extract head values from selfRow
      const village = getField(selfRow, ['village','Village','village_name']) || '';
      const headName = getField(selfRow, ['name','Name']) || 'Unknown';
      const headGender = getField(selfRow, ['gender','Gender']) || '';
      const headBirth = parseDateDMY(getField(selfRow, ['birthDate','birth_date']) || '');
      const headEducation = getField(selfRow, ['education']) || '';
      const headProfession = getField(selfRow, ['profession']) || '';
      const headProfessionType = getField(selfRow, ['profession_type']) || '';
      const headProfessionAddress = getField(selfRow, ['profession_address']) || '';
      const headResidence = getField(selfRow, ['residence_address','current_residence_place']) || '';
      const headMarital = getField(selfRow, ['martial_status','marital_status','marriage_status']) || 'UnMarried';
      const headBlood = getField(selfRow, ['blood_group']) || '';
      const headMobile = normalizeMobile(getField(selfRow, ['mobile','Mobile']));
      const headEmail = getField(selfRow, ['email','Email']) || '';
      const headRemarks = getField(selfRow, ['Remarks','remarks']) || '';

      // generate family headId like 42KPS-0001-01
      const headId = genFamilyHeadId();
      const familyCode = headId.split('-').slice(0,2).join('-'); // 42KPS-0001

      // create Family
      const familyPayload = {
        headId,
        familyCode,
        village,
        name: headName,
        gender: headGender,
        relation: 'Head',
        birthDate: headBirth,
        education: headEducation,
        profession: headProfession,
        profession_type: headProfessionType,
        profession_address: headProfessionAddress,
        residence_address: headResidence,
        martial_status: headMarital,
        blood_group: headBlood,
        mobile: headMobile,
        email: headEmail,
        shortDesc: '',
        remarks: headRemarks,
        publish: true,
        members: [],
        createdUser: new mongoose.Types.ObjectId(CREATED_USER),
        createdDate: new Date(),
        lastModifiedDate: new Date()
      };

      const familyDoc = await Family.create(familyPayload);
      console.log(`Created family group ${key} head "${headName}" -> familyId=${familyDoc._id} headId=${headId}`);

      // create head as FamilyMember
    /*  const headMember = await FamilyMember.create({
        memeberID: headId,
        familyId: familyDoc._id,
        village,
        name: headName,
        gender: headGender,
        relation: 'Head',
        birthDate: headBirth,
        education: headEducation,
        profession: headProfession,
        profession_type: headProfessionType,
        profession_address: headProfessionAddress,
        residence_address: headResidence,
        martial_status: headMarital,
        blood_group: headBlood,
        mobile: headMobile,
        email: headEmail,
        remarks: headRemarks,
        publish: true,
        createdUser: new mongoose.Types.ObjectId(CREATED_USER),
        createdDate: new Date(),
        lastModifiedDate: new Date()
      });

      familyDoc.members.push(headMember._id);
      await familyDoc.save(); */

      // now insert other rows in group as members (respect order)
      for (const row of groupRows) {
        // skip SELF row (already processed)
        if ((getField(row, 'relation') || '').trim().toLowerCase() === 'self') continue;

        const name = getField(row, ['name']) || 'Unknown';
        const gender = getField(row, ['gender']) || '';
        const relation = getField(row, ['relation']) || '';
        const birthDate = parseDateDMY(getField(row, ['birthDate','birth_date']) || '');
        const education = getField(row, ['education']) || '';
        const profession = getField(row, ['profession']) || '';
        const profession_type = getField(row, ['profession_type']) || '';
        const profession_address = getField(row, ['profession_address']) || '';
        const residence_address = getField(row, ['residence_address','current_residence_place']) || '';
        const martial_status = getField(row, ['martial_status','marriage_status']) || 'UnMarried';
        const blood_group = getField(row, ['blood_group']) || '';
        const mobile = normalizeMobile(getField(row, ['mobile','Mobile']));
        const email = getField(row, ['email','Email']) || '';
        const remarks = getField(row, ['Remarks','remarks']) || '';

        // generate next member id for this family
        const memberID = await genNextMemberId(headId);

        const memberPayload = {
          memeberID: memberID,
          familyId: familyDoc._id,
          village,
          name,
          gender,
          relation,
          birthDate,
          education,
          profession,
          profession_type,
          profession_address,
          residence_address,
          martial_status,
          blood_group,
          mobile,
          email,
          remarks,
          publish: true,
          createdUser: new mongoose.Types.ObjectId(CREATED_USER),
          createdDate: new Date(),
          lastModifiedDate: new Date()
        };

        const memDoc = await FamilyMember.create(memberPayload);
        familyDoc.members.push(memDoc._id);
        await familyDoc.save();
        console.log(`  -> member ${name} added as ${memberID}`);
      }
    } // end for groups

    console.log('All groups processed. Import complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Import error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
})();
