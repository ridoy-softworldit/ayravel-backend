import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";
import httpStatus from "http-status";

const getAllCategoryFromDB = async () => {
  const result = await CategoryModel.find().populate('subCategories');
  return result;
};

const getSingleCategoryFromDB = async (id: string) => {
  const result = await CategoryModel.findById(id).populate(
    'subCategories'
  );
  return result;
};

const createCategoryIntoDB = async (payload: TCategory) => {
  const isCategoryExists = await CategoryModel.findOne({ name: payload?.name });

  //creating slug
  payload.slug = payload.name.split(" ").join("-").toLowerCase();

  if (isCategoryExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Category with ${isCategoryExists?.name} is already exists!`
    );
  }
  const result = await CategoryModel.create(payload);
  return result;
};


const editCategory = async (id: string, payload: TCategory) => {
  const isCategoryExists = await CategoryModel.findById(id)

  if (!isCategoryExists) {
    throw new AppError(404, 'Category not Found!')
  }

 const updatedCategory = await CategoryModel.findByIdAndUpdate(id, payload, {
   new: true,
   runValidators: true, 
 });
  
  if (payload.deletedImages) {
    if (payload.deletedImages?.length > 0 ) {
      await Promise.all(payload.deletedImages.map((imageurl) => deleteImageFromCLoudinary(imageurl)))
    }
  }
  return updatedCategory;
};

const deleteCategoryFromDB = async (id: string) => {
  const result = await CategoryModel.findByIdAndDelete(id);
  return result;
};

export const categoryServices = {
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  createCategoryIntoDB,
  deleteCategoryFromDB,
  editCategory,
};
