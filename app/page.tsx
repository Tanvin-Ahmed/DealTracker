import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { getAllProducts, getAllTrackedProducts } from "@/lib/actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Home = async () => {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;
  if (!email) redirect("/sign-in");

  let allProducts = await getAllProducts(email);
  allProducts = JSON.parse(JSON.stringify(allProducts));

  let allTackedProducts = await getAllTrackedProducts(email);
  allTackedProducts = JSON.parse(JSON.stringify(allTackedProducts));

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart shopping start here
              <Image
                src={"/assets/icons/arrow-right.svg"}
                alt="right-arrow"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Unleash the power of{" "}
              <span className="text-primary">DealTracker</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage and retain more.
            </p>

            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">Tracked Products</h2>

        {allTackedProducts?.length === 0 ? (
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
            {allTackedProducts?.map((product) => (
              <ProductCard
                key={product._id}
                product={JSON.parse(JSON.stringify(product))}
              />
            ))}
          </div>
        )}
      </section>
      <section className="trending-section">
        <h2 className="section-text">Searched Products</h2>

        {allProducts?.length === 0 ? (
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
            {allProducts?.map((product) => (
              <ProductCard
                key={product._id}
                product={JSON.parse(JSON.stringify(product))}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
