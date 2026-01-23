"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BookmarkCityProps {
  cities: Array<{ city: string; pricePerGram: number }>;
}

const STORAGE_KEY = "silverinfo_favorite_city";

/**
 * BookmarkCity Component
 * 
 * Allows users to save their favorite city for quick price access.
 * Uses localStorage for persistence.
 */
export default function BookmarkCity({ cities }: BookmarkCityProps) {
  const [favoriteCity, setFavoriteCity] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load favorite city from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setFavoriteCity(saved);
    }
  }, []);

  const handleSelectCity = (cityName: string) => {
    setFavoriteCity(cityName);
    localStorage.setItem(STORAGE_KEY, cityName);
    setShowSelector(false);
  };

  const handleRemoveFavorite = () => {
    setFavoriteCity(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!mounted) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-100 rounded"></div>
      </div>
    );
  }

  const favoriteCityData = favoriteCity 
    ? cities.find(c => c.city.toLowerCase() === favoriteCity.toLowerCase())
    : null;

  return (
    <div className="card p-4 border border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/30">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span>⭐</span>
          My City
        </h3>
        {favoriteCity && (
          <button
            onClick={handleRemoveFavorite}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            title="Remove favorite"
          >
            ✕
          </button>
        )}
      </div>

      {favoriteCityData ? (
        // Show favorite city price
        <Link 
          href={`/city/${favoriteCity.toLowerCase()}`}
          className="block group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900 group-hover:text-[#1e3a5f] transition-colors">
                {favoriteCity}
              </p>
              <p className="text-xs text-gray-500">Your saved city</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#1e3a5f]">
                ₹{favoriteCityData.pricePerGram.toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-400">per gram</p>
            </div>
          </div>
          <p className="text-xs text-[#1e3a5f] mt-2 group-hover:underline">
            View full details →
          </p>
        </Link>
      ) : showSelector ? (
        // City selector
        <div>
          <p className="text-xs text-gray-500 mb-2">Select your city:</p>
          <div className="grid grid-cols-2 gap-1 max-h-[200px] overflow-y-auto">
            {cities.slice(0, 20).map((city) => (
              <button
                key={city.city}
                onClick={() => handleSelectCity(city.city)}
                className="text-left px-2 py-1.5 text-xs rounded hover:bg-purple-100 transition-colors flex justify-between items-center"
              >
                <span className="truncate">{city.city}</span>
                <span className="text-gray-400 text-[10px]">₹{city.pricePerGram.toFixed(0)}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSelector(false)}
            className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        // Prompt to select city
        <button
          onClick={() => setShowSelector(true)}
          className="w-full py-3 border-2 border-dashed border-purple-200 rounded-lg text-sm text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          + Set your favorite city
        </button>
      )}

      {favoriteCity && (
        <button
          onClick={() => setShowSelector(true)}
          className="mt-2 text-[10px] text-gray-400 hover:text-[#1e3a5f] transition-colors"
        >
          Change city
        </button>
      )}
    </div>
  );
}
