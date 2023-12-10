"use server";
import * as cheerio from "cheerio";
import {
  extractCurrency,
  extractDescription,
  extractPrice,
  getRatingNumber,
} from "../utils";
import puppeteer, { Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

const getBrowser = async () => {
  return puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    // Point to a Chromium tar file here 👇
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
};

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  // const username = String(process.env.BRIGHT_DATA_USERNAME);
  // const password = String(process.env.BRIGHT_DATA_PASSWORD);
  // const port = 22225;
  // const session_id = (1000000 * Math.random()) | 0;

  // const options = {
  //   auth: {
  //     username: `${username}-session-${session_id}`,
  //     password,
  //   },
  //   host: "brd.superproxy.io",
  //   port,
  //   rejectUnauthorized: false,
  // };

  try {
    // Fetch the product page
    // const response = await axios.get(url, options);

    const browser: Browser = await getBrowser();
    const page = await browser.newPage();
    // Websites can check the User-Agent header to identify the browser. Set your User-Agent to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    );
    await page.waitForTimeout(2000);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const content = await page.content();
    await browser.close();

    const $ = cheerio.load(content);

    // Extract the product title
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".a-price.priceToPay span.a-offscreen"),
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const reviews = $(
      "#averageCustomerReviews_feature_div #averageCustomerReviews #acrCustomerReviewText"
    )
      .text()
      .trim();
    const reviewsCount = getRatingNumber(reviews);

    const stars = $(
      "#averageCustomerReviews_feature_div #averageCustomerReviews .a-declarative .a-size-base.a-color-base"
    )
      .text()
      .trim();

    const category = $(
      "#wayfinding-breadcrumbs_container #wayfinding-breadcrumbs_feature_div li:first .a-link-normal.a-color-tertiary"
    )
      .text()
      .trim();

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const description = extractDescription($);

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category,
      reviewsCount: reviewsCount || 0,
      stars: Number(stars),
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    console.log(error);
  }
}
