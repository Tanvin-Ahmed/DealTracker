import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import TrackButton from "@/components/TrackButton";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;
  if (!email) redirect("/sign-in");

  let product: Product = await getProductById(id);
  product = JSON.parse(JSON.stringify(product));

  if (!product) redirect("/");

  const similarProducts = await getSimilarProducts(id, email);

  return (
    <div className={"product-container"}>
      <div className="flex gap-28 xl:flex-row flex-col">
        <div>
          <Image
            src={product.image}
            alt={product.title}
            height={400}
            width={380}
            className="mx-auto"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold text-secondary">
                {product.title}
              </p>
              <Link
                href={product.url}
                target={"_blank"}
                className="text-black opacity-50 text-base"
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src={"/assets/icons/red-heart.svg"}
                  alt="heart"
                  height={20}
                  width={20}
                />
                <p className="text-base font-semibold text-[#D46F77]">
                  {product.reviewsCount}
                </p>
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src={"/assets/icons/bookmark.svg"}
                  alt="bookmark"
                  height={20}
                  width={20}
                />
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src={"/assets/icons/share.svg"}
                  alt="share"
                  height={20}
                  width={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex gap-2 flex-col">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              {formatNumber(product.currentPrice) <
                formatNumber(product.originalPrice) && (
                <p className="text-[34px] text-black opacity-50 line-through">
                  {product.currency} {formatNumber(product.originalPrice)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src={"/assets/icons/star.svg"}
                    alt="star"
                    height={16}
                    width={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || "0"}
                  </p>
                </div>
                <div className="product-reviews">
                  <Image
                    src={"/assets/icons/comment.svg"}
                    alt="comment"
                    height={16}
                    width={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount || "0"} Reviews
                  </p>
                </div>
              </div>
              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">93% </span>{" "}
                of buyers have recommeded this.
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current price"
                iconSrc={"/assets/icons/price-tag.svg"}
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
                borderColor="#b6dbff"
              />
              <PriceInfoCard
                title="Average price"
                iconSrc={"/assets/icons/chart.svg"}
                value={`${product.currency} ${formatNumber(
                  product.averagePrice
                )}`}
                borderColor="#03f8fc"
              />
              <PriceInfoCard
                title="Highest price"
                iconSrc={"/assets/icons/arrow-up.svg"}
                value={`${product.currency} ${formatNumber(
                  product.highestPrice
                )}`}
                borderColor="#FCC"
              />
              <PriceInfoCard
                title="Lowest price"
                iconSrc={"/assets/icons/arrow-down.svg"}
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice
                )}`}
                borderColor="#BEFFC5"
              />
            </div>
          </div>
          <TrackButton product={product} />
        </div>
      </div>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product Description
          </h3>

          <div className="flex flex-col gap-4">
            {" "}
            {product?.description?.split("\n")}
          </div>
        </div>
        <Link
          href={product.url}
          className="text-base text-white btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]"
        >
          <Image
            src="/assets/icons/bag.svg"
            alt="check"
            width={22}
            height={22}
          />
          Buy Now
        </Link>
      </div>
      {similarProducts && similarProducts.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map((product: Product) => (
              <ProductCard
                key={product._id}
                product={JSON.parse(JSON.stringify(product))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
