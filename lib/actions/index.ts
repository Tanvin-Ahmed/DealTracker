"use server";
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import UserModel from "../models/user.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodeMailer";
import { currentUser } from "@clerk/nextjs";

// auth apis
export const saveNewUser = async (userInfo: { email: string | undefined }) => {
  if (!userInfo) return;
  try {
    await connectToDB();
    const existingUser = await UserModel.findOne({
      email: userInfo.email,
    });
    if (existingUser) return;

    await UserModel.create(userInfo);
  } catch (error) {
    // console.log(error);
  }
};

export const getUserByEmail = async (email: string | undefined) => {
  if (!email) return;
  try {
    await connectToDB();
    const user = await UserModel.findOne({ email });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    // console.log(error);
  }
};

export const getAuthenticUser = async () => {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;
  if (!email) return null;

  await connectToDB();

  const userInfo = await UserModel.findOne({ email });
  return JSON.parse(JSON.stringify(userInfo));
};

// tracking api
export const toggleTrackingProduct = async (
  productId: string | undefined,
  trackingStatus: boolean
) => {
  if (!productId) return;

  try {
    await connectToDB();
    const user = await currentUser();
    const email = user?.emailAddresses[0].emailAddress;

    if (!email) {
      return {
        message: "Please login first",
        error: true,
        success: false,
      };
    }

    const userInfo = await UserModel.findOne({ email });

    if (!userInfo) {
      return {
        message: "Please login first",
        error: true,
        success: false,
      };
    }

    const product = await Product.findOne({
      _id: productId,
      user: userInfo._id,
    });

    if (!product) {
      return {
        message: "Product not found",
        error: true,
        success: false,
      };
    }
    product.track = trackingStatus;
    await product.save();

    let emailContent;
    if (trackingStatus === true) {
      emailContent = await generateEmailBody(product, "WELCOME");
    } else {
      emailContent = await generateEmailBody(product, "UNTRACK");
    }
    await sendEmail(emailContent, [email]);

    revalidatePath("/");

    return {
      message: "Successfully added to tracking list",
      success: true,
      error: false,
      track: trackingStatus,
    };
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message;
    return {
      message,
      success: false,
      error: true,
    };
  }
};

export const scrapeAndStoreProduct = async (productUrl: string) => {
  if (!productUrl) return;
  try {
    await connectToDB();
    // get user information form clerk
    const user = await currentUser();

    if (!user?.emailAddresses[0].emailAddress)
      return {
        message: "Product not found",
        error: true,
        success: false,
      };

    const userInfo = await UserModel.findOne({
      email: user?.emailAddresses[0].emailAddress,
    });

    if (!userInfo)
      return {
        message: "Please complete your registration first",
        error: true,
        success: false,
      };

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url, user: userInfo._id },
      { ...product, user: userInfo._id },
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);

    return { productId: JSON.parse(JSON.stringify(newProduct._id)) };
  } catch (error: any) {
    throw new Error("Fail to create/update product: " + error.message);
  }
};

export const getProductById = async (productId: string) => {
  try {
    await connectToDB();

    const product = await Product.findById(productId);

    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    console.log("Get product failed: " + error.message);
  }
};

export const getTotalProductCount = async () => {
  try {
    await connectToDB();
    const user = await getAuthenticUser();
    const counts = await Product.count({ user: user?._id, track: false });
    return counts;
  } catch (error: any) {
    console.log("Get total product count failed: " + error.message);
  }
};

export const getAllProducts = async (limit: number, page: number) => {
  try {
    await connectToDB();
    const user = await getAuthenticUser();

    const offset = limit * page;

    const products = await Product.find({ user: user?._id, track: false })
      .limit(limit)
      .skip(offset)
      .sort({ _id: -1 });

    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    console.log("Get all products failed: " + error.message);
  }
};

export const getTotalTrackedProductCount = async () => {
  try {
    await connectToDB();
    const user = await getAuthenticUser();
    const counts = await Product.count({ user: user?._id, track: true });
    return counts;
  } catch (error: any) {
    console.log("Get total product count failed: " + error.message);
  }
};

export const getAllTrackedProducts = async (limit: number, page: number) => {
  try {
    await connectToDB();
    const user = await getAuthenticUser();

    const offset = limit * page;

    const products = await Product.find({ user: user?._id, track: true })
      .limit(limit)
      .skip(offset)
      .sort({ _id: -1 });

    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    console.log("Get all products failed: " + error.message);
  }
};

export const getSimilarProducts = async (
  productId: string,
  userEmail: string
) => {
  try {
    await connectToDB();
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) return null;

    const currentProduct = await Product.findOne({
      _id: productId,
      user: user._id,
    });

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
      user: user._id,
    }).limit(4);

    return JSON.parse(JSON.stringify(similarProducts));
  } catch (error: any) {
    console.log("Get all products failed: " + error.message);
  }
};

export const deleteProduct = async (
  productId: string | undefined,
  email: string | undefined
) => {
  if (!productId || !email) return;
  await connectToDB();

  const userInfo = await UserModel.findOne({ email });
  if (!userInfo) throw new Error("Login first to delete product");

  await Product.findByIdAndDelete(productId);
  revalidatePath("/");
};
