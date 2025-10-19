import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { faqServices } from "./faq.service";

const getAllFaqs = catchAsync(async (req, res) => {
  const result = await faqServices.getAllFaqsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FAQs retrieved successfully!",
    data: result,
  });
});

const getSingleFaq = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await faqServices.getSingleFaqFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FAQ retrieved successfully!",
    data: result,
  });
});

const createFaq = catchAsync(async (req, res) => {
  const faqData = req.body;
  const result = await faqServices.createFaqOnDB(faqData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FAQ created successfully!",
    data: result,
  });
});

export const faqControllers = {
  createFaq,
  getAllFaqs,
  getSingleFaq,
};
