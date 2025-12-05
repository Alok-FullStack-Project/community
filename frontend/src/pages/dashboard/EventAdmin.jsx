import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');               // GET /api/events (with category populated)
      const list = res.data.data || [];

      setEvents(list);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  // Group by category.name
  const groupByCategory = (events) => {
    const map = {};
    events.forEach((ev) => {
      const catName = ev.category ? ev.category.name : "Uncategorized";
      if (!map[catName]) map[catName] = [];
      map[catName].push(ev);
    });
    return map;
  };

  const groupedEvents = groupByCategory(events);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Events</h2>
        <Link
          to="/dashboard/admin/events/add"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Event
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No events found</p>
      ) : (
        Object.keys(groupedEvents).map((categoryName) => (
          <div key={categoryName} className="mb-10">
            <h3 className="text-xl font-semibold mb-3 border-b pb-1">
              {categoryName}
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {groupedEvents[categoryName].map((event) => (
                <div key={event._id} className="border p-4 rounded shadow-sm">
                  {event.coverImage && (
                    <img
                      src={event.coverImage}
                      alt={event.name}
                      className="h-40 w-full object-cover mb-2 rounded"
                    />
                  )}

                  <h3 className="text-lg font-bold">{event.name}</h3>
                  <p className="text-sm text-gray-600">
                    Category: {event.category?.name || "Uncategorized"}
                  </p>

                  <p className="mt-1">{event.description}</p>

                  <p className="text-sm mt-1">
                    {event.publish ? "Published" : "Unpublished"}
                  </p>

                  <div className="flex space-x-2 mt-2">
                    <Link
                      to={`/dashboard/admin/events/edit/${event._id}`}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>

                    <Link
                      to={`/dashboard/admin/events/images/${event._id}`}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Manage Images
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EventAdmin;
