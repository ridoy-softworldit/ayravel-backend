import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../config";
import { possibleGenders, userRoles, userStatus } from "./user.const";
import { IAuthProvider, TUser } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

//mongoose schema for user
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required to create a user!"],
    },
    email: {
      type: String,
      required: [true, "Email is required to create a user!"],
      unique: [true, "User with this email already exists!"],
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long!"],
    },
    role: {
      type: String,
      enum: userRoles,
      default: "customer",
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: possibleGenders,
      default: "male",
    },
    contactNo: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: userStatus,
      default: "active",
    },
    walletPoint: {
      type: Number,
      default: 100,
    },
    commissionBalance: { type: Number, default: 0 },
    socials: {
      type: [String],
      default: [],
    },
    cardInfo: {
      type: Object,
      default: null,
    },
    auths: {
      type: [authProviderSchema],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

//Pre middleware to encrypt password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

//removing password from document for security
userSchema.post("save", function (doc, next) {
  if (doc.password) {
    doc.password = "";
  }

  next();
});

// Remove passwords from results
userSchema.post("find", function (docs, next) {
  docs.forEach((doc: any) => {
    if (doc && doc.password) {
      doc.password = "";
    }
  });
  next();
});

// user model
export const UserModel = model<TUser>("user", userSchema);
