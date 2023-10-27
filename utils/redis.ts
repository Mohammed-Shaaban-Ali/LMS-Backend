require("dotenv").config();
import { Redis } from "ioredis";

const redisClient = () => {
  if (process.env.REDISURL) {
    console.log("redis connected");
    return process.env.REDISURL;
  }
  throw new Error("redis not connected");
};
export const redis = new Redis(redisClient());
