"use client";
import { useState } from "react";
import { toggleTrackingProduct } from "@/lib/actions";
import { Product } from "@/types";
import { toast } from "react-hot-toast";

const TrackButton = ({ product }: { product: Product }) => {
  const [loading, setLoading] = useState(false);

  const handleToggleTracking = async () => {
    setLoading(true);
    const loadingToast = toast.loading(
      !product?.track
        ? "Adding to tracking list..."
        : "Removing from tracking list..."
    );
    const res = await toggleTrackingProduct(product?._id, !product?.track);

    if (res?.error) {
      toast.error(res.message, { id: loadingToast });
    } else if (res?.success) {
      toast.success(res.message, { id: loadingToast });
      if (res?.track) {
        product.track = res.track;
      }
    }

    setLoading(false);
  };

  return (
    <button
      type="button"
      className="btn"
      onClick={handleToggleTracking}
      disabled={loading}
    >
      {product?.track ? "Untrack" : "Track"}
    </button>
  );
};

export default TrackButton;
