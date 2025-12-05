import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const emptyEvent = {
  name: '',
  description: '',
  publish: true,
  coverImage: '',
  category: 'event'   // default
};

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(emptyEvent);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (id) 
      {
        fetchEvent();
        fetchCategories();
      }
  }, [id]);

  useEffect(() => {
        fetchCategories();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch event');
    }
  };


  const fetchCategories = async () => {
  try {
    const res = await api.get('/categories?type=event');
    setCategories(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to load categories");
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', event.name);
      formData.append('description', event.description);
      formData.append('publish', event.publish);
      formData.append('category', event.category);
      if (event.file) formData.append('coverImage', event.file);

      if (id) {
        await api.put(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert('Event updated');
      } else {
        console.log(formData);
        await api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert('Event added');
      }
      navigate('/dashboard/admin/events');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Event</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 max-w-md">
          <div>
            <label>Category</label>
            <select
            name="category"
            value={event.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            >
            <option value="">Select Category</option>
            {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
            {cat.name} ({cat.type})
            </option>
            ))}
            </select>
          </div>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={event.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={event.description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Publish</label>
          <input type="checkbox" name="publish" checked={event.publish} onChange={handleChange} className="ml-2" />
        </div>
        <div>
          <label>Cover Image</label>
          <input type="file" name="file" onChange={handleChange} />
          {event.coverImage && !event.file && <img src={event.coverImage} alt="preview" className="h-40 mt-2" />}
          {event.file && <img src={URL.createObjectURL(event.file)} alt="preview" className="h-40 mt-2" />}
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </form>
    </div>
  );
}
