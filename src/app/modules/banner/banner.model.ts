import { Schema, model } from 'mongoose';

const bannerSchema = new Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    image: { type: String, required: true },
    buttonText: { type: String },
    buttonLink: { type: String },
    discount: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BannerModel = model('Banner', bannerSchema);
