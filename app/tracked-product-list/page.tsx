"use client";

import ProductCard from "@/components/ProductCard";
import {
  getAllTrackedProducts,
  getTotalTrackedProductCount,
} from "@/lib/actions";
import { Product } from "@/types";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

const TrackedProductListPage = () => {
  const router = useRouter();
  const { user } = useClerk();
  const [productCount, setProductCount] = useState<number>(0);
  const [products, setProducts] = useState<Product[] | []>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !user.id) {
      router.push("/sign-in");
    }
  }, [user, router]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const count = await getTotalTrackedProductCount();
      if (count) setProductCount(count);
      const products = await getAllTrackedProducts(20, 0);
      if (products) setProducts(products);
      setLoading(false);
    })();
  }, []);

  const handleGetNextProducts = async () => {
    setLoading(true);
    const products = await getAllTrackedProducts(20, page);
    if (products && products.length) {
      setProducts((pre) => [...pre, ...products]);
      setPage((page) => page++);
    }
    setLoading(false);
  };

  return (
    <InfiniteScroll
      dataLength={productCount}
      next={handleGetNextProducts}
      hasMore={products.length < productCount}
      loader={
        <div className="flex justify-center items-center">
          <LoaderIcon className="animate-spin w-10 h-10 text-gray-500" />
        </div>
      }
      style={{ overflow: "visible" }}
    >
      <section className="trending-section">
        <h2 className="section-text">UnTracked Products</h2>

        {!loading && products?.length === 0 ? (
          <div className="flex justify-center items-center">
            <Image
              src={"/assets/images/product_404.jpeg"}
              alt={"product not found"}
              width={200}
              height={200}
              className="max-w-[200px] w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={JSON.parse(JSON.stringify(product))}
              />
            ))}
          </div>
        )}
      </section>
    </InfiniteScroll>
  );
};

export default TrackedProductListPage;
