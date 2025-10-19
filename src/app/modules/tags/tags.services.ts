import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { TagModel } from "./tags.model";
import { TTag } from "./tags.interface";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { ProductModel } from "../product/product.model";

const getAllTagsFromDB = async (query: Record<string, string>) => {
  const result = TagModel.find();


  const queryBuilder = new QueryBuilder(result, query)
 const tagSearchableFields = [
  'name',
];
  const allTags = queryBuilder.search(tagSearchableFields).filter().sort().paginate();

  const [data, meta] = await Promise.all([
    allTags.build().exec(),
    queryBuilder.getMeta()
  ])
  return {
    data, meta
  }
};

const getSingleTagFromDB = async (id: string) => {
  const result = await TagModel.findById(id);

  return result;
};

const createTagOnDB = async (payload: TTag) => {
  const isTagExists = await TagModel.findOne({ name: payload?.name });

  if (isTagExists) {
    throw new AppError(httpStatus.CONFLICT, "Tag Already Exists!");
  }

  payload.slug = payload?.name.split(" ").join("-");

  const result = await TagModel.create(payload);

  return result;
};


const updateTagOnDB = async (id: string,payload: TTag) => {
  const isTagExists = await TagModel.findById(id);

  if (!isTagExists) {
    throw new AppError(httpStatus.CONFLICT, 'Tag dose not Exists!');
  }


  const result = await TagModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  })

  if (payload.deletedImage) {
    await deleteImageFromCLoudinary(payload.deletedImage)
  }



  return result;
};


export const getStatus = async () => {
  const totalTags = await TagModel.countDocuments();
  const taggedProducts = await ProductModel.countDocuments({
    'brandAndCategories.tags.0': { $exists: true },
  });
  const tagTypesAgg = await TagModel.aggregate([
    { $match: { type: { $exists: true, $ne: '' } } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $project: { _id: 0, name: '$_id', count: 1 } },
  ]);

   const mostUsedTagAgg = await ProductModel.aggregate([
     { $unwind: '$brandAndCategories.tags' },
     { $group: { _id: '$brandAndCategories.tags', count: { $sum: 1 } } },
     { $sort: { count: -1 } },
     { $limit: 1 },
     {
       $lookup: {
         from: 'tags',
         localField: '_id',
         foreignField: '_id',
         as: 'tag',
       },
     },
     { $unwind: '$tag' },
     { $project: { _id: 0, name: '$tag.name', count: 1 } },
   ]);


  return { totalTags, tagTypesAgg, taggedProducts,mostUsedTagAgg };
};
export const tagServices = {
  getAllTagsFromDB,
  getSingleTagFromDB,
  createTagOnDB,
  updateTagOnDB,
  getStatus,
};
