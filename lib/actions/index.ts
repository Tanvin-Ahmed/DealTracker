"use server";

import { scrapeAmazonProduct } from "../scraper";

export const scrapeAndStoreProduct = async (productUrl: string) => {
  if (!productUrl) return;
  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    //   store product in database
  } catch (error: any) {
    throw new Error("Fail to create/update product: " + error.message);
  }
};
