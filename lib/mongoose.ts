import mongoose from "mongoose";

let isConnected = false; // variable to track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) return console.log("Mongodb URI is required");
  if (isConnected) return console.log("=> using existing DB connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;

    console.log("Mongodb connection established");
  } catch (error) {
    console.log("MongoDB error: " + error);
  }
};
