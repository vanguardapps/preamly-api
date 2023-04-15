// models/User.ts - Mongoose Schema definition and singleton model provision
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import addIdAndKind from "./utils/add-id-and-kind";
import addPluralKinds from "./utils/add-plural-kinds";
import { Role, Kind } from "../graphql/codegen-server/schema-types";
import { TokenType, generateToken, verifyToken, } from "../utils/token";
/**
 *
 * 2023-01-01 Roy McClanahan
 * this type of schema definition relies on default behavior of Mongoose to create virtual
 * getters for the "id" field. here is the key section of documentation:
 * https://mongoosejs.com/docs/guide.html#id:
 * "Mongoose assigns each of your schemas an id virtual getter by default which returns the
 *  document's _id field cast to a string, or in the case of ObjectIds, its hexString."
 *
 **/
// define the User schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        maxLength: [255, "First name must be less than 256 characters."],
        // example validator for future use in other models
        /*validate: {
        // just a sample validator
        validator: (v: string): boolean => {
          return /[a-zA-Z \'\-\_\"\~]+/.test(v);
        },
        message: (props) => `${props.value} is not an acceptable value.`,
      },*/
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        maxLength: [255, "Last name must be less than 256 characters."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        maxLength: [1024, "Email length must not exceed 1024 characters"],
        match: [
            /^[a-zA-Z0-9._%+-]+\@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please use an email addres with only alphanumeric characters or any of these ( . _ % + - )",
        ],
        index: {
            unique: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    roles: [
        {
            type: String,
            enum: Role,
        },
    ],
}, {
    toObject: {
        transform: (doc, ret) => {
            if (ret === null || ret === void 0 ? void 0 : ret.password) {
                delete ret.password;
            }
        },
    },
    toJSON: {
        transform: (doc, ret) => {
            if (ret === null || ret === void 0 ? void 0 : ret.password) {
                delete ret.password;
            }
        },
    },
});
// create any necessary indexes
userSchema.index({
    firstName: "text",
    lastName: "text",
    email: "text",
});
userSchema.pre("save", async function () {
    let user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password"))
        return Promise.resolve();
    try {
        // generate a salt (change 10 to a constant)
        const salt = await bcrypt.genSalt(10);
        // hash the password using our new salt
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    catch (err) {
        return Promise.reject("an error occurred while hasing the new password.");
    }
});
userSchema.post("save", (doc) => {
    if (doc === null || doc === void 0 ? void 0 : doc.password) {
        doc.password = "";
    }
});
// can't use arrow function because need to retain default scoping of 'this' of regular function
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.generateRefreshToken = function () {
    const payload = {
        userId: this.id,
        email: this.email,
        type: TokenType.REFRESH,
        roles: this.roles,
    };
    this.token = generateToken(payload);
};
userSchema.methods.generateAccessToken = function () {
    const payload = {
        userId: this.id,
        email: this.email,
        type: TokenType.REFRESH,
        roles: this.roles,
    };
    if (verifyToken(this.token, payload)) {
        payload.type = TokenType.ACCESS;
        return generateToken(payload);
    }
};
// add the "kind" field to the schema and ensure it has a regular "id"
addIdAndKind(userSchema, Kind.User);
// add support for pluralization of kind when returning array of documents
addPluralKinds(userSchema, Kind.User);
// create the global singleton User model
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
//# sourceMappingURL=UserModel.js.map