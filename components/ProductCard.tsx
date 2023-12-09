"use client";
import { deleteProduct, getAuthenticUser } from "@/lib/actions";
import { Product } from "@/types";
import { Trash } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const loadedToast = toast.loading("deleting product...");
    try {
      const user = await getAuthenticUser();
      if (!user) {
        toast.error("Unauthorized request!", { id: loadedToast });
        router.push("/sing-in");
      }

      if (!product._id) {
        toast.error("Product not found", { id: loadedToast });
      }

      await deleteProduct(product._id, user.email);

      toast.success("Product remove from the list successfully", {
        id: loadedToast,
      });
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong, please try again later!", {
        id: loadedToast,
      });
    }
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="product-card w-full h-full shadow hover:bg-gray-100 transition-all p-2 relative group"
    >
      <button
        onClick={handleDelete}
        className="p-1 cursor-pointer absolute hidden group-hover:block top-1 right-1 z-20 rounded-full transition-all hover:bg-red-200"
      >
        <Trash className="text-red-500 w-6 h-6" />
      </button>

      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title}
          width={100}
          height={100}
          className="product-card_img"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>

        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">
            {product.category}
          </p>
          <p className="text-black font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
