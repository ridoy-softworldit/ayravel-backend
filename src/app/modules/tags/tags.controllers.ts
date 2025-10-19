import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { tagServices } from "./tags.services";

const getAllTags = catchAsync(async (req, res) => {
  const result = await tagServices.getAllTagsFromDB(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tags retrieve successfully!",
    data: result,
  });
});

const getSingleTag = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await tagServices.getSingleTagFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag data retrieve successfully!",
    data: result,
  });
});

// Create Tag
const createTag = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
  const body = req.body;

  const tagData = {
    ...body,
    image: files["image"]?.[0]?.path || body.image || "",
    icon: {
      name: body.icon.name || body["icon.name"], //  Support both formData and JSON
      url: files["icon"]?.[0]?.path || body.iconUrl || "",
    },
  };

  const result = await tagServices.createTagOnDB(tagData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag created successfully!",
    data: result,
  });
});

// Update Tag
const updateTag = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
  const body = req.body;

  const tagData: any = {
    ...body,
  };

  if (files["image"]?.[0]?.path) {
    tagData.image = files["image"][0].path;
  }

  if (files["icon"]?.[0]?.path || body.iconName || body.iconUrl) {
    tagData.icon = {
      name: body.icon.name || body["icon.name"],
      url: files["icon"]?.[0]?.path || body.iconUrl || "",
    };
  }

  const result = await tagServices.updateTagOnDB(req.params.id, tagData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag updated successfully!",
    data: result,
  });
});

const getStatus = catchAsync(async (req, res) => {
  const result = await tagServices.getStatus();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tag updated successfully!",
    data: result,
  });
});

export const tagControllers = {
  getAllTags,
  getSingleTag,
  createTag,
  updateTag,
  getStatus,
};
