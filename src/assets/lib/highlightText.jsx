import React from "react";

// Ubah nama produk jadi array node React, bagian yang diapit '...' dikasih warna oranye
export const highlightQuotedText = (text) => {
  if (!text) return text;
  const parts = text.split(/('[^']+')/g);
  return parts.map((part, i) =>
    part.startsWith("'") && part.endsWith("'") ? (
      <span key={i} className="text-orange-500">
        {part}
      </span>
    ) : (
      part
    ),
  );
};