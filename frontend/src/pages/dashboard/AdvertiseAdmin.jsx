import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';

export default function AdvertiseAdmin() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const backend_url = import.meta.env.VITE_URL ;

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await api.get('/advertise'); // GET all ads
      setAds(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      await api.delete(`/advertise/${id}`);
      setAds(ads.filter(a => a._id !== id));
      alert('Advertisement deleted');
    } catch (err) {
      console.error(err);
      alert('Failed to delete advertisement');
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Advertisements</h2>
        <Link
          to="/dashboard/admin/advertise/add"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Advertisement
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Image</th>
              <th className="border px-2 py-1">Start Date</th>
              <th className="border px-2 py-1">End Date</th>
              <th className="border px-2 py-1">Published</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad._id}>
                <td className="border px-2 py-1">{ad.name}</td>
                <td className="border px-2 py-1">
                  {ad.image ? <img src={ad.image} alt={ad.name} className="h-12" /> : 'No Image'}
                </td>
                <td className="border px-2 py-1">{ad.startDate ? new Date(ad.startDate).toLocaleDateString() : '-'}</td>
                <td className="border px-2 py-1">{ad.endDate ? new Date(ad.endDate).toLocaleDateString() : '-'}</td>
                <td className="border px-2 py-1">{ad.publish ? 'Yes' : 'No'}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <Link
                    to={`/dashboard/admin/advertise/edit/${ad._id}`}
                    className="px-2 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
