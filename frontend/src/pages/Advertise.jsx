import React, { useEffect, useState } from "react";
import api from "../api/api";
import Slider from "../components/Slider";
import { format } from "date-fns";

const Advertise = () => {
  const [ads, setAds] = useState([]);
  const [sliderAds, setSliderAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backend_url = import.meta.env.VITE_URL;
  const [selectedAd, setSelectedAd] = useState(null);

  // Track user action (website, call, whatsapp)
  const handleVisit = async (ad, action) => {
    try {
      await api.post("/advertise/track", {
        adId: ad._id,
        action,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Tracking failed", err);
    }

    if (action === "website") window.open(ad.link, "_blank");
    if (action === "call") window.location.href = `tel:${ad.mobile}`;
    if (action === "whatsapp") window.open(`https://wa.me/${ad.mobile}`, "_blank");
  };

  const fetchAds = async () => {
  try {
    setLoading(true);
    const res = await api.get("/advertise");
    let data = res.data.data || res.data || [];

    // Only published
    data = data.filter(a => a.publish !== false);

    // ---- GROUPING ----
    const premiumAds = data.filter(a => a.priority === "premium");
    const standardAds = data.filter(a => a.priority !== "premium");

    // ---- SHUFFLE STANDARD ADS ----
    standardAds.sort(() => Math.random() - 0.5);

    // ---- DAILY FEATURE AD ----
    let featuredAd = null;
    if (data.length > 0) {
      const todayIndex = new Date().getDate() % data.length;
      featuredAd = data[todayIndex];
    }

    // ---- TOP SLIDER ADS (max 3) ----
    const sliderAds = [
      ...(premiumAds.slice(0, 2)), // first 2 premium
      featuredAd
    ].filter(Boolean).slice(0, 3);

    // ---- FINAL ORDERED ADS ----
    const finalAds = [
      featuredAd,
      ...premiumAds,
      ...standardAds
    ].filter(Boolean);

    setAds(finalAds);
    setSliderAds(sliderAds); // New state
  } catch (err) {
    console.error("Failed to fetch adverts", err);
    setError("Failed to load advertisements. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAds();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return path.startsWith("/") ? backend_url + path : backend_url + "/" + path;
  };

  return (
    <>
      <Slider />
{/* TOP ADS SLIDER */}
{sliderAds.length > 0 && (
  <div className="max-w-7xl mx-auto mt-10">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Featured Ads</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sliderAds.map((ad) => (
        <div
          key={ad._id}
          onClick={() => setSelectedAd(ad)}
          className="bg-white rounded-2xl shadow-md border overflow-hidden 
          hover:-translate-y-2 hover:shadow-xl transition cursor-pointer"
        >
          <img
            src={getImageUrl(ad.image)}
            className="h-48 w-full object-cover"
          />

          <div className="p-4">
            <h3 className="text-lg font-semibold">{ad.name}</h3>
            <p className="text-gray-600 text-sm">
              {ad.description?.slice(0, 70)}...
            </p>

            <span className="inline-block mt-3 px-3 py-1 bg-yellow-300 text-yellow-900 
            text-xs rounded-full font-semibold">
              Featured Today ⭐
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      <section className="px-6 py-14 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">
              Sponsored Advertisements
            </h2>
            <p className="text-gray-600 mt-2">
              Support community initiatives & promote your local business.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-gray-500">Loading advertisements...</div>
          )}

          {/* Error */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* No Ads */}
          {!loading && ads.length === 0 && (
            <p className="text-center text-gray-500">No advertisements yet.</p>
          )}

          {/* AD GRID */}
          {!loading && ads.length > 0 && (
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {ads.map((ad) => {
                const img = getImageUrl(ad.image);
                const start = ad.startDate ? new Date(ad.startDate) : null;
                const end = ad.endDate ? new Date(ad.endDate) : null;

                return (
                  <div
                    key={ad._id}
                    onClick={() => setSelectedAd(ad)}
                    className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden 
                    hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  >
                    {/* IMAGE */}
                    <div className="relative h-56 w-full overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={ad.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-200">
                          No Image
                        </div>
                      )}

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* SPONSORED BADGE */}
                      <span className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs shadow">
                        Sponsored {ad.preiority ? "• Premium" : "• Standard"  }
                      </span>

                      {/* CATEGORY BADGE */}
                      {ad.category && (
                        <span className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs shadow">
                          {ad.category}
                        </span>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
                        {ad.name}
                      </h3>

                      <p className="text-gray-600 mt-2 mb-4 text-sm leading-relaxed">
                        {(ad.description || ad.shortDesc)?.slice(0, 120) || "No details provided."}
                        {(ad.description?.length || 0) > 120 && "..."}
                      </p>

                      {/* DATE TAGS */}
                      <div className="flex flex-wrap gap-2 text-sm mb-4">
                        {start && (
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            📅 {format(start, "dd MMM yyyy")}
                          </span>
                        )}
                        {end && (
                          <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                            🔚 {format(end, "dd MMM yyyy")}
                          </span>
                        )}
                      </div>

                      {/* CTA BUTTONS */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        {ad.link && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVisit(ad, "website");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
                          >
                            🌐 Website
                          </button>
                        )}

                        {ad.mobile && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisit(ad, "call");
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow transition"
                            >
                              📞 Call
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisit(ad, "whatsapp");
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition"
                            >
                              💬 WhatsApp
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* MODAL — Ad Details */}
      {selectedAd && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-fadeIn"
          onClick={() => setSelectedAd(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
              onClick={() => setSelectedAd(null)}
            >
              ✕
            </button>

            {/* Image */}
            {selectedAd.image && (
              <img
                src={getImageUrl(selectedAd.image)}
                className="w-full h-64 object-cover"
              />
            )}

            {/* Body */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedAd.name}
              </h2>

              <p className="text-gray-700 mb-4">{selectedAd.description}</p>

              <div className="flex gap-3 flex-wrap mt-4">
                {selectedAd.link && (
                  <button
                    onClick={() => handleVisit(selectedAd, "website")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white shadow"
                  >
                    🌐 Visit Website
                  </button>
                )}

                {selectedAd.mobile && (
                  <>
                    <button
                      onClick={() => handleVisit(selectedAd, "call")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white shadow"
                    >
                      📞 Call
                    </button>

                    <button
                      onClick={() => handleVisit(selectedAd, "whatsapp")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white shadow"
                    >
                      💬 WhatsApp
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Advertise;
