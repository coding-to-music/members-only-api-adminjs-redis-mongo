import { connect, connection, mongo, set } from "mongoose";

import { ENV } from "@utils/loadEnv";
import { GridFSBucket } from "mongodb";
import { logger } from "@utils/logger";

let bucket: GridFSBucket;

export const connectDB = async () => {
  const options = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    ssl: true,
  };

  set("strictQuery", false);
  connect(ENV.MONGO_URI, options);

  connection.on("connected", () =>
    logger.info("Mongoose connected to DB cluster")
  );
  connection.on("error", () => logger.error("MongoDB connection error:"));
  connection.on("disconnected", () => logger.info("Mongoose disconnected"));

  connection.once("open", () => {
    bucket = new mongo.GridFSBucket(connection.db, {
      bucketName: "uploads",
    });
  });
};

export const getBucket = () => {
  return bucket;
};
