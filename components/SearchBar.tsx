"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const isValidAmazonProductUrl = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const SearchBar = () => {
  const router = useRouter();
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidLink = isValidAmazonProductUrl(searchPrompt);

    if (!isValidLink) {
      return alert("Please enter a valid Amazon Product URL");
    }
    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
      setSearchPrompt("");
      if (product && product?.productId) {
        router.push(`/products/${product.productId}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-16" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter product link"
        className="searchbar-input"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={!searchPrompt.trim() || isLoading}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
