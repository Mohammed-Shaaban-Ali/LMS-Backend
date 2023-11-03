import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../module/Layout";
const cloudinary = require("cloudinary");

// create layout
export const createLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isAlredyExist = await LayoutModel.findOne({ type });
      if (isAlredyExist)
        return next(new ErrorHandler(`${type} already exist`, 400));

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create(banner);
      }
      if (type === "Faq") {
        const { faq } = req.body;
        const fqaItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.create({ type: "FAQ", faq: fqaItems });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }
      res
        .status(200)
        .json({ sucess: true, message: "Layout created successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// edit layout
export const editLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subTitle } = req.body;
        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findOneAndUpdate(bannerData.id, banner);
      }
      if (type === "Faq") {
        const { faq } = req.body;
        const FaqItems = await LayoutModel.findOne({ type: "FAQ" });

        const fqaItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.findOneAndUpdate(FaqItems?._id, {
          type: "FAQ",
          faq: fqaItems,
        });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const CategoriesItem = await LayoutModel.findOne({
          type: "Categories",
        });

        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create(CategoriesItem?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }
      res
        .status(200)
        .json({ sucess: true, message: "Layout created successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);

// get layout using type
export const getLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const layout = await LayoutModel.findOne({ type });
      res.status(200).json({ sucess: true, layout });
    } catch (error: any) {
      return next(new ErrorHandler(error.mesage, 400));
    }
  }
);
