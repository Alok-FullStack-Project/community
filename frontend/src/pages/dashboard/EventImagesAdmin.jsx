import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

export default function EventImagesAdmin() {
  const { eventId } = useParams();
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');

  const fetchImages = async () => {
    try {
      const res = await api.get(`/event-images/event/${eventId}`);
      setImages(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch images');
    }
  };

  const handleAdd = async () => {
    if (!file) return alert('Select a file');
    try {
      const formData = new FormData();
      formData.append('url', file);
      formData.append('caption', caption);
      await api.post(`/event-images/${eventId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null); setCaption('');
      fetchImages();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/event-images/${id}`);
      fetchImages();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchImages();
  }, [eventId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Event Images</h2>
      <div className="mb-4">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <input type="text" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} className="ml-2 p-1 border rounded"/>
        <button onClick={handleAdd} className="ml-2 px-2 py-1 bg-blue-600 text-white rounded">Upload</button>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img._id} className="border p-2 rounded">
            <img src={img.url} alt={img.caption} className="h-32 w-full object-cover rounded mb-1" />
            <p className="text-sm">{img.caption}</p>
            <button onClick={() => handleDelete(img._id)} className="px-2 py-1 bg-red-500 text-white rounded mt-1">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
