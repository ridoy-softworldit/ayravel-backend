import z from "zod";

export const termsAndConditionsZodSchema = z.object({
  name: z.string({
    error: () => "Name is required!",
  }),
  description: z.string({
    error: () => "Description is required!",
  }),
  type: z.enum(["global", "shops"], {
    message: "Type must be either 'global' or 'shops'",
  }),
  issuedBy: z.number({
    error: () => "IssuedBy is required!",
  }),
  isApproved: z.boolean().optional(),
});
