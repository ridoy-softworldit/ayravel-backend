
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";
import { AttributesModel } from "./attributes.model";
import { AttributeSearchableFields } from "./attributes.consts";
import { TAttributes } from "./attributes.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllAttributesFromDB = async (query: Record<string, string>) => {


  const attributeQuery = new QueryBuilder(AttributesModel.find(), query)
    const SearchableFields = ['name'];
  const allAttributes = attributeQuery
    .search(SearchableFields)
    .filter()
    .sort()
    .paginate();
  
  allAttributes.modelQuery = allAttributes.modelQuery.populate({
    path: 'category',
    select: 'name -_id'
  })
  
  const [data, meta] = await Promise.all([
    allAttributes.build().exec(),
    attributeQuery.getMeta(),
  ]);

  const result = {data, meta}

  return result;
};

const getSingleAttributeFromDB = async (id: string) => {
  const result = AttributesModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Attribute does not exists!");
  }

  return result;
};


const getStatsFromDB = async () => {
  const stats = await AttributesModel.aggregate([
    {
      $facet: {
        totalAttributes: [{ $count: 'count' }],
        requiredAttributes: [
          { $match: { required: true } },
          { $count: 'count' },
        ],
        dropdownAttributes: [
          { $match: { type: 'dropdown' } },
          { $count: 'count' },
        ],
        categories: [
          { $match: { category: { $exists: true, $ne: null } } },
          { $group: { _id: '$category' } },
          { $count: 'count' },
        ],
      },
    },
  ]);

  // result structured nicely
  return {
    totalAttributes: stats[0].totalAttributes[0]?.count || 0,
    requiredAttributes: stats[0].requiredAttributes[0]?.count || 0,
    dropdownAttributes: stats[0].dropdownAttributes[0]?.count || 0,
    categories: stats[0].categories[0]?.count || 0,
  };
};


const createAttributeIntoDB = async (payload: TAttributes) => {
  const isAttributeExists = await AttributesModel.findOne({
    name: payload?.name,
  });

  if (isAttributeExists) {
    throw new AppError(httpStatus.CONFLICT, "Attribute already exists!");
  }

  payload.slug = payload?.name.split(" ").join("-");

  const result = await AttributesModel.create(payload);

  return result;
};

const updateAttributeIntoDB = async (id: string, payload: TAttributes) => {
  const isAttributeExists = await AttributesModel.findById(id);

  if (!isAttributeExists) {
    throw new AppError(httpStatus.CONFLICT, 'Attribute does not exist!');
  }

  if (payload.name) {
    payload.slug = payload?.name.split(' ').join('-');
  }

  const result = await AttributesModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  return result;
};


export const attributeServices = {
  getAllAttributesFromDB,
  getSingleAttributeFromDB,
  createAttributeIntoDB,
  updateAttributeIntoDB,
  getStatsFromDB,
};
