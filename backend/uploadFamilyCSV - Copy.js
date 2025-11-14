const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Family = require('./models/Family');
const FamilyMember = require('./models/FamilyMember');

const CREATED_USER = '68e52d4c8f6d3be0590bc4af'; // example

const PREFIX = '42KPS';

const generateFamilyCode = async () => {
  const lastFamily = await Family.findOne().sort({ createdDate: -1 });
  if (!lastFamily) return `${PREFIX}-0001-01`;

  const lastFamilySeq = parseInt(lastFamily.headId.split('-')[1]);
  const newFamilySeq = (lastFamilySeq + 1).toString().padStart(4, '0');
  return `${PREFIX}-${newFamilySeq}-01`;
};

const generateMemberCode = async (familyId) => {
  const members = await FamilyMember.find({ familyId }).sort({ createdAt: -1 });
  const familyCode = members.length > 0 
    ? members[0].memeberID.split('-').slice(0,2).join('-') 
    : (await Family.findById(familyId)).headId.split('-').slice(0,2).join('-');

  const newSeq = (members.length + 2).toString().padStart(2, '0'); // head already -01
  return `${familyCode}-${newSeq}`;
};




function parseDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/').map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

mongoose.connect('mongodb://127.0.0.1:27017/yourdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');

  const results = [];
  fs.createReadStream('family_data.csv')
    .pipe(csv())
    .on('data', (row) => {
      // Skip blank rows (all values empty)
      const hasData = Object.values(row).some(val => val && val.trim() !== '');
      if (!hasData) return;

      results.push(row);
    })
    .on('end', async () => {
      console.log(`Read ${results.length} rows`);

      const village = 'PIPODARA';

        const familiesMap = {}; // Map village+headName -> familyId
      
      for (const r of results) {
        // Parse date
        const birthDate = parseDate(r.birthDate);
         const name = r.name || 'Missing';

          console.log('name :- ' + r.name);
         console.log('gender :- ' + r.gender);

        if (r.relation.toUpperCase() === 'SELF') {
          // Head of family
           const headId = await generateFamilyCode();
          const family = new Family({
            headId: headId, // can update after saving
            village: village,//r.village,
            name: name,
            gender: r.gender,
            relation: 'Head',
            birthDate,
            education: r.education,
            profession: r.profession,
            profession_type: r.profession_type,
            profession_address: r.profession_address,
            residence_address: r.residence_address,
            martial_status: r.martial_status || 'UnMarried',
            blood_group: r.blood_group,
            mobile: r.mobile,
            email: r.email,
            remarks: r.Remarks || '',
            publish: true,
            createdUser: new mongoose.Types.ObjectId(CREATED_USER),
            createdDate: new Date(),
            lastModifiedDate: new Date()
          });

          await family.save();
          // update headId if needed
         // family.headId = `42KPS-${String(family._id).slice(-4)}-01`;
          //await family.save();
        familiesMap[`${village}-${name}`] = { familyId: family._id, headId };
        } else {
          // Member
          //const family = await Family.findOne({ village: r.village, relation: 'Head' });
         // if (!family) continue; // skip if no family found

        const familyKeys = Object.keys(familiesMap);
        const familyKey = familyKeys.find(k => k.startsWith(village));
        if (!familyKey) {
          console.error(`Family for village ${village} not found for member ${name}`);
          continue;
        }

        const { familyId, headId } = familiesMap[familyKey];

        // Count existing members for sequence
        //const existingMembers = await FamilyMember.find({ familyId });
        const memberID = await generateMemberCode(familyId);




          const member = new FamilyMember({
            memeberID: memberID, // generate memberID logic
            familyId: familyId,
            village: village,//r.village,
            name: r.name || 'Missing',
            gender: r.gender,
            relation: r.relation,
            birthDate,
            education: r.education,
            profession: r.profession,
            profession_type: r.profession_type,
            profession_address: r.profession_address,
            residence_address: r.residence_address,
            martial_status: r.martial_status || 'UnMarried',
            blood_group: r.blood_group,
            mobile: r.mobile,
            email: r.email,
            remarks: r.Remarks || '',
            publish: true
          });

          await member.save();
          await Family.findByIdAndUpdate(familyId, { $push: { members: member._id } });
        }
      }

      console.log('CSV import completed');
      mongoose.connection.close();
    });

}).catch(err => console.error(err));
