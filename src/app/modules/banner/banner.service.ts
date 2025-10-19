import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/handleAppError";
import { IBanner } from "./banner.interface";
import { BannerModel } from "./banner.model";
import { CategoryModel } from "../category/category.model";

export const createBannerFromDB = async (payload: Partial<IBanner>) => {
  const banners = await BannerModel.find();

  if (banners.length >= 6) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Maximum 6 banners allowed. Please delete an existing banner before adding a new one.'
    );
  }

  const result = await BannerModel.create(payload);
  return result;
};

export const updateBannerFromDB = async (id:string,payload: Partial<IBanner>) => {
  const banners = await BannerModel.findById(id);

  if (!banners) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Banner not Found!')
  }

  const result = await BannerModel.findByIdAndUpdate(id, payload, {
    new: true, 
    runValidators: true,
  });
  
  return result;
};
export const getAllBannersFromDB = async (payload: Partial<IBanner>) => {
  const banners = await BannerModel.find();
  const categories = await CategoryModel.find({ isFeatured: true }).populate(
    'subCategories'
  );
  
  const data = {
    banners: banners,
    categories: categories
  }
  
  return data;
};



export const bannerServices = {
  createBannerFromDB,
  getAllBannersFromDB,
  updateBannerFromDB,
};