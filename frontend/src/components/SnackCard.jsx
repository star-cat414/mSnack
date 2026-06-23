import React, { useState } from 'react';

export default function SnackCard({ snack }) {
  const [imgSrc, setImgSrc] = useState(snack.image_url);
  const fallbackImage = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={imgSrc || fallbackImage}
          alt={snack.title}
          onError={() => setImgSrc(fallbackImage)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{snack.title}</h3>
          <span className="text-brand-600 font-bold text-lg whitespace-nowrap ml-2">
            ${snack.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 flex-grow">{snack.caption || 'No description available.'}</p>
      </div>
    </div>
  );
}