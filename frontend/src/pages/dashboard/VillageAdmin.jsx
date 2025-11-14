import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // your axios instance
import { toast } from 'react-toastify';

export default function VillageAdmin() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [publish, setPublish] = useState(true);
  const [editId, setEditId] = useState(null);

  // fetch villages
  const fetchVillages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/villages');
      setVillages(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load villages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  // create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim()) {
        toast.error('Name is required');
        return;
      }

      if (editId) {
        // update
        await api.put(`/villages/${editId}`, { name, publish });
        toast.success('Village updated');
      } else {
        // create
        await api.post('/villages', { name, publish });
        toast.success('Village added');
      }

      setName('');
      setPublish(true);
      setEditId(null);
      fetchVillages();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  // edit village
  const handleEdit = (village) => {
    setName(village.name);
    setPublish(village.publish);
    setEditId(village._id);
  };

  // delete village
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this village?')) return;
    try {
      await api.delete(`/villages/${id}`);
      toast.success('Village deleted');
      fetchVillages();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Village Management</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-3 items-center">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Village Name"
          className="p-2 border rounded flex-1"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          Publish
        </label>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          {editId ? 'Update' : 'Add'}
        </button>
        {editId && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => {
              setEditId(null);
              setName('');
              setPublish(true);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading villages...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Publish</th>
              <th className="border px-4 py-2">Created Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {villages.map((v) => (
              <tr key={v._id}>
                <td className="border px-4 py-2">{v.name}</td>
                <td className="border px-4 py-2">{v.publish ? 'Yes' : 'No'}</td>
                <td className="border px-4 py-2">{new Date(v.createdDate).toLocaleString()}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                    onClick={() => handleEdit(v)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleDelete(v._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {villages.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No villages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
