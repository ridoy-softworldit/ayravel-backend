"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_const_1 = require("./user.const");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    _id: false,
    versionKey: false,
});
//mongoose schema for user
const userSchema = new mongoose_1.Schema({
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
        enum: user_const_1.userRoles,
        default: "customer",
    },
    image: {
        type: String,
    },
    gender: {
        type: String,
        enum: user_const_1.possibleGenders,
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
        enum: user_const_1.userStatus,
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
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
//Pre middleware to encrypt password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.password) {
            user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
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
    docs.forEach((doc) => {
        if (doc && doc.password) {
            doc.password = "";
        }
    });
    next();
});
// user model
exports.UserModel = (0, mongoose_1.model)("user", userSchema);
