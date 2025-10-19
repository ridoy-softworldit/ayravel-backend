import QueryBuilder from "../../builder/QueryBuilder";
import { TFaq } from "./faq.interface";
import { FaqModel } from "./faq.model";

const createFaqOnDB = async (payload: TFaq) => {
  const result = await FaqModel.create(payload);
  return result;
};

const getAllFaqsFromDB = async (query: Record<string, unknown>) => {
  const faqQuery = new QueryBuilder(FaqModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await faqQuery.modelQuery;
  return result;
};

const getSingleFaqFromDB = async (id: string) => {
  const result = await FaqModel.findById(id);
  return result;
};

export const faqServices = {
  createFaqOnDB,
  getAllFaqsFromDB,
  getSingleFaqFromDB,
};
