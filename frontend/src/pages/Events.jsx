import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import api from '../api/api'; // centralized axios instance
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const backend_url = import.meta.env.VITE_URL ;

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data || res.data); // handle paginated or direct response
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
 <Slider />
      <section className="p-8 text-center bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>

        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events available yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {event.coverImage ? (
                  <img
                    src={event.coverImage}
                    alt={event.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-4 text-left">
                  <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    {event.description?.slice(0, 100) || 'No description'}
                    {event.description?.length > 100 && '...'}
                  </p>
                  <Link
                    to={`/events/${event._id}`}
                    className="text-sky-600 font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Events;
