// src/pages/Advertise.jsx
import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import api from '../api/api';
import { format } from 'date-fns'; // optional, install if you want nicer date formatting
import Slider from '../components/Slider';

const Advertise = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backend_url = import.meta.env.VITE_URL ;
  const [categories, setCategories] = useState([]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await api.get('/advertise'); // backend: GET /api/advertise
      // API may return paginated { data: [...] } or direct array
      const data = res.data.data || res.data || [];
      // filter published (optional) — if backend already filters publish true you can remove this
      const published = Array.isArray(data) ? data.filter(a => a.publish !== false) : [];
      setAds(published);
    } catch (err) {
      console.error('Failed to fetch adverts', err);
      setError('Failed to load advertisements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
     api.get("/categories?type=advertise").then(res => {
        setCategories(res.data);
      });
  }

  useEffect(() => {
    fetchAds();
    fetchCategories();
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    // if image stored as absolute URL already
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    // if stored as '/uploads/advertise/...' or 'uploads/advertise/..'
    return imgPath.startsWith('/') ? `${window.location.origin}${imgPath}` : `${window.location.origin}/${imgPath}`;
  };

  return (
    <>
      <Slider />
      <section className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Sponsored Advertisements</h2>
            <p className="text-gray-600">Support community projects by advertising here.</p>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading advertisements...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : ads.length === 0 ? (
            <p className="text-gray-500">No advertisements at the moment.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {ads.map((ad) => {
                const img = getImageUrl(ad.image);
                const start = ad.startDate ? new Date(ad.startDate) : null;
                const end = ad.endDate ? new Date(ad.endDate) : null;
                return (
                  <div key={ad._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      {img ? (
                        <img
                          src={ad.image}
                          alt={ad.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No image</div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{ad.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{ad.description || ad.shortDesc || ''}</p>

                      <div className="text-sm text-gray-500 mb-3">
                        {start && (
                          <span>
                            Start: {format ? format(start, 'dd MMM yyyy') : start.toLocaleDateString()}
                          </span>
                        )}
                        {start && end && <span className="mx-2">|</span>}
                        {end && (
                          <span>
                            End: {format ? format(end, 'dd MMM yyyy') : end.toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {ad.link ? (
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-2 bg-sky-600 text-white rounded"
                        >
                          Visit
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Advertise;
