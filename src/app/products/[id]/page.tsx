"use client";

import { useState } from "react";

export function ProductDetails({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-600">{product.description}</p>

      {/* تفاصيل المنتج */}
      <div className="space-y-2 text-sm text-gray-700">
        <p><span className="font-semibold">النوع:</span> {product.type}</p>
        <p><span className="font-semibold">الماركة:</span> {product.brand}</p>
        <p><span className="font-semibold">الخامة:</span> {product.material}</p>
        <p><span className="font-semibold">بلد الصنع:</span> {product.madeIn}</p>
      </div>

      {/* المقاس اختياري */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-4">
          <span className="font-semibold">المقاس:</span>
          <div className="flex gap-2 mt-2">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded ${
                  selectedSize === size
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
