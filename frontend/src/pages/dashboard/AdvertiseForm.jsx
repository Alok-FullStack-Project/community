import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

const emptyAd = {
  name: '',
  image: '',
  startDate: '',
  endDate: '',
  publish: true,
};

export default function AdvertiseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertise, setAdvertise] = useState(emptyAd);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchAd();
  }, [id]);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/advertise/${id}`);
      setAdvertise({
        ...res.data,
        startDate: res.data.startDate ? res.data.startDate.split('T')[0] : '',
        endDate: res.data.endDate ? res.data.endDate.split('T')[0] : '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch advertisement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setAdvertise(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', advertise.name);
      formData.append('startDate', advertise.startDate);
      formData.append('endDate', advertise.endDate);
      formData.append('publish', advertise.publish);
      if (advertise.file) formData.append('image', advertise.file);

      if (id) {
        await api.put(`/advertise/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert('Advertise updated');
      } else {
        await api.post('/advertise', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert('Advertise added');
      }

      navigate('/dashboard/admin/advertise');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Advertisement</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 max-w-md">
        <div>
          <label>Name</label>
          <input type="text" name="name" value={advertise.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label>Start Date</label>
          <input type="date" name="startDate" value={advertise.startDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label>End Date</label>
          <input type="date" name="endDate" value={advertise.endDate || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label>Publish</label>
          <input type="checkbox" name="publish" checked={advertise.publish} onChange={handleChange} className="ml-2" />
        </div>

        <div>
          <label>Image</label>
          <input type="file" name="file" onChange={handleChange} />
          {advertise.file 
            ? <img src={URL.createObjectURL(advertise.file)} alt="preview" className="h-20 mt-2" />
            : advertise.image && <img src={advertise.image} alt="preview" className="h-20 mt-2" />}
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </form>
    </div>
  );
}
