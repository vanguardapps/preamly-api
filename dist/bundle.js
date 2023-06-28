import jwt from 'jsonwebtoken';
import fs, { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { KafkaPubSub } from 'graphql-kafka-subscriptions';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import pluralize from 'pluralize';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

var httpStatusCodes;
(function (httpStatusCodes) {
    httpStatusCodes["UNAUTHORIZED"] = "401";
    httpStatusCodes["FORBIDDEN"] = "403";
    httpStatusCodes["BAD_REQUEST"] = "400";
    httpStatusCodes["INTERNAL_SERVER"] = "500";
})(httpStatusCodes || (httpStatusCodes = {}));
var httpStatusCodes$1 = httpStatusCodes;

var Kind;
(function (Kind) {
    Kind["APIError"] = "APIError";
    Kind["AuthenticationError"] = "AuthenticationError";
    Kind["AuthorizationError"] = "AuthorizationError";
    Kind["DatabaseError"] = "DatabaseError";
    Kind["DeveloperError"] = "DeveloperError";
    Kind["SchemaError"] = "SchemaError";
    Kind["SignInResultSuccess"] = "SignInResultSuccess";
    Kind["User"] = "User";
    Kind["Users"] = "Users";
    Kind["ValidationError"] = "ValidationError";
})(Kind || (Kind = {}));
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
})(Role || (Role = {}));

// APIError class - used for all errors thrown in proprietary codebase
/** APIError - Base class for all API errors. Can be used on its own for non-HTTP situations. */
class APIError extends Error {
    constructor(error, details = {}) {
        if (typeof error === "string") {
            super(error);
        }
        else {
            super(error.message, { cause: error });
        }
        // Prevent overwriting of message after call to super()
        if (details === null || details === void 0 ? void 0 : details.message)
            delete details.message;
        // Assign all properties from details to this error object
        Object.assign(this, details);
        this.kind = Kind.APIError;
        this.name = Kind.APIError.toString();
    }
}
class AuthenticationError extends APIError {
    constructor(error, details = {}) {
        super(error, details);
        this.kind = Kind.AuthenticationError;
        this.name = Kind.AuthenticationError.toString();
    }
    get status() {
        return httpStatusCodes$1.UNAUTHORIZED;
    }
}
class DatabaseError extends APIError {
    constructor(error, details = {}) {
        super(error, details);
        this.kind = Kind.DatabaseError;
        this.name = Kind.DatabaseError.toString();
    }
    get status() {
        return httpStatusCodes$1.INTERNAL_SERVER;
    }
}
class DeveloperError extends APIError {
    constructor(error, details = {}) {
        super(error, details);
        this.kind = Kind.DeveloperError;
        this.name = Kind.DeveloperError.toString();
    }
}
const convertToValidError = (error) => {
    if ((error === null || error === void 0 ? void 0 : error.kind) && Object.values(Kind).includes(error.kind)) {
        return error;
    }
    else {
        return new APIError(error);
    }
};

const addIdAndKind = (schema, kind) => {
    const previousTransform = schema.options.toJSON.transform;
    schema.options.toJSON.transform = (doc, ret) => {
        if (ret && !(ret === null || ret === void 0 ? void 0 : ret.kind)) {
            ret.kind = kind;
        }
        if (ret && !(ret === null || ret === void 0 ? void 0 : ret.id) && (ret === null || ret === void 0 ? void 0 : ret._id)) {
            ret.id = ret._id.toString();
        }
        previousTransform(doc, ret);
    };
};

const addPluralKinds = (schema, kind) => {
    schema.post("find", function (res) {
        const pluralKind = pluralize(kind.toString());
        res = {
            result: res,
        };
        if (Object.values(Kind).includes(pluralKind)) {
            res.kind = pluralKind;
        }
        else {
            throw new DeveloperError(`Schema pluralization for kind ${kind} failed (tried using '${pluralKind}'). Define plural exception for ${kind} with 'pluralize' that results in compatible pluralization.`);
        }
        // TODO find alternative for use of 'any' here
        return mongoose.overwriteMiddlewareResult(res);
    });
};

const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = dirname(__filename$1);
let options;
try {
    options = JSON.parse(fs.readFileSync(path.join(__dirname$1, "../keys/jwt-options.json"), "utf8"));
}
catch (err) {
    if (err.code === "ENOENT") {
        throw new Error("JWT options file not found");
    }
    else {
        throw err;
    }
}
var TokenType;
(function (TokenType) {
    TokenType["ACCESS"] = "access";
    TokenType["REFRESH"] = "refresh";
})(TokenType || (TokenType = {}));
const generateToken = (payload) => {
    if (!((payload === null || payload === void 0 ? void 0 : payload.userId) && (payload === null || payload === void 0 ? void 0 : payload.email) && (payload === null || payload === void 0 ? void 0 : payload.type) && (payload === null || payload === void 0 ? void 0 : payload.roles))) {
        throw new Error("Invalid token payload.");
    }
    let keyFile;
    if (payload.type === TokenType.ACCESS) {
        keyFile = process.env.JWT_ACCESS_PRIVATE_KEYFILE;
    }
    else if (payload.type === TokenType.REFRESH) {
        keyFile = process.env.JWT_REFRESH_PRIVATE_KEYFILE;
    }
    else {
        throw new Error("Invalid token type.");
    }
    try {
        const key = fs.readFileSync(path.join(__dirname$1, `../../keys/${keyFile}`));
        return jwt.sign(payload, key, options);
    }
    catch (err) {
        if (err.code === "ENOENT") {
            throw new Error("JWT access private key file not found");
        }
        throw err;
    }
};
const verifyToken = (token, payload) => {
    return true;
};

// models/User.ts - Mongoose Schema definition and singleton model provision
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
    if (verifyToken(this.token)) {
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

const filterEmptyProperties = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value));
};

// Converts an APIError into the Error type expected to by the
// GraphQL queries in schema.graphql
class GQLError {
    constructor(error) {
        var _a;
        this.message =
            process.env.PREAMLY_DEBUG_MODE === "true"
                ? (_a = error.stack) !== null && _a !== void 0 ? _a : error.message
                : `${error.kind}: ${error.message}`;
        this.kind = error.kind;
    }
}

// part of a test for the Kafka setup that I keep in place
const pubsub = new KafkaPubSub({
    topic: "RoyMessages",
    host: "127.0.0.1",
    port: "9092",
    globalConfig: {}, // options passed directly to the consumer and producer
});
let messages = [];
// graphql resolvers
const resolvers = {
    Query: {
        viewMessages: () => {
            return messages;
        },
        users: async () => {
            try {
                const allUsers = (await UserModel.find({}));
                console.log(allUsers);
                if (!allUsers) {
                    return {
                        users: [],
                    };
                }
                return {
                    users: allUsers.result.map((user) => user.toJSON()),
                    kind: allUsers.kind,
                };
            }
            catch (err) {
                return new GQLError(convertToValidError(err));
            }
        },
        // // !!!TODO!!! the user() query will need to have authorization checking in it, and check for role 'admin'
        user: async (parent, { input }) => {
            try {
                const user = await UserModel.findOne(filterEmptyProperties(input));
                console.log(user);
                if (!user) {
                    return new GQLError(new AuthenticationError("User not found."));
                }
                return user.toJSON();
            }
            catch (err) {
                return new GQLError(convertToValidError(err));
            }
        },
        getUser: async (parent, args, { userId, roles, error }) => {
            try {
                if (error) {
                    return error;
                }
                if (userId) {
                    const user = await UserModel.findById(userId);
                    if (!user) {
                        return new GQLError(new AuthenticationError("User not found."));
                    }
                    return user.toJSON();
                }
                return new GQLError(new AuthenticationError("User not logged in."));
            }
            catch (err) {
                return new GQLError(convertToValidError(err));
            }
        },
    },
    Mutation: {
        sendMessage: (parent, { name, content }) => {
            const id = messages.length.toString();
            const new_message = {
                id,
                name: name || "Roy",
                content,
            };
            messages.push(new_message);
            pubsub.publish("RoyMessages", { receiveMessage: new_message });
            return new_message;
        },
        createUser: async (parent, { input: { firstName, lastName, email, password } }) => {
            try {
                // TODO - add validation (newUser.validate() turned into a promise
                // or just newUser.validateSync()
                const newUser = await new UserModel({
                    firstName,
                    lastName,
                    email,
                    password,
                    token: null,
                });
                const savedUser = await newUser.save();
                if (!savedUser) {
                }
                return savedUser.toJSON();
            }
            catch (err) {
                return new GQLError(convertToValidError(err));
            }
        },
        signIn: async (parent, { input: { email, password } }, { userId, roles, error }) => {
            try {
                if (error) {
                    return error;
                }
                // TODO input validation should happen here for email and password
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return new GQLError(new AuthenticationError(`User with email ${email} not found.`));
                }
                if (!(await user.comparePassword(password))) {
                    return new GQLError(new AuthenticationError("Incorrect password."));
                }
                user.generateRefreshToken();
                const token = user.generateAccessToken();
                return {
                    id: "0",
                    token,
                    kind: Kind.SignInResultSuccess,
                    redirect: "/home", // TODO customize this for the user entity. maybe like /user/home or something, not sure.
                };
            }
            catch (err) {
                return new GQLError(convertToValidError(err));
            }
        },
    },
    Subscription: {
        receiveMessage: {
            subscribe: () => pubsub.asyncIterator(["RoyMessages"]),
        },
    },
    CreateUserResult: {
        __resolveType(obj) {
            if (obj === null || obj === void 0 ? void 0 : obj.kind) {
                return obj.kind;
            }
            return Kind.APIError;
        },
    },
    UserResult: {
        __resolveType(obj) {
            if (obj === null || obj === void 0 ? void 0 : obj.kind) {
                return obj.kind;
            }
            return Kind.APIError;
        },
    },
    UsersResult: {
        __resolveType(obj) {
            if (obj === null || obj === void 0 ? void 0 : obj.kind) {
                return obj.kind;
            }
            return Kind.APIError;
        },
    },
    SignInResult: {
        __resolveType(obj) {
            if (obj === null || obj === void 0 ? void 0 : obj.kind) {
                return obj.kind;
            }
            console.log(obj.kind);
            return Kind.APIError;
        },
    },
};

const connectDB = async () => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(process.env.MONGODB_CONN_STR);
            mongoose.set("strictQuery", false);
        }
        catch (err) {
            throw new DatabaseError(err);
        }
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const startApolloServer = async () => {
    // create websocket server
    const wsServer = new WebSocketServer({
        noServer: true,
    });
    const typeDefs = readFileSync(path.join(__dirname, "../src/graphql/schema.graphql"), { encoding: "utf-8" });
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const serverCleanup = useServer({ schema }, wsServer);
    // create the Apollo Server and set up proper cleanup for the websocket
    // server that we are using for subscriptions
    const server = new ApolloServer({
        schema,
        plugins: [
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    const contextMiddleware = async ({ req, res }) => {
        var _a;
        var _b;
        // create context object with default values
        let context = { userId: null, roles: null, error: null };
        try {
            if (req.method === "OPTIONS") {
                res.end();
                return context;
            }
            if (res.socket) {
                (_b = res.socket.server).ws || (_b.ws = (() => {
                    res.socket.server.on("upgrade", function (request, socket, head) {
                        wsServer.handleUpgrade(request, socket, head, function (ws) {
                            wsServer.emit("connection", ws, request);
                        });
                    });
                    return wsServer;
                })());
            }
            // retrieve token from request into variable token (if it exists)
            const token = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization)
                ? req.headers.authorization.split(/ +/)[1]
                : null;
            if (!token) {
                process.env.PREAMLY_DEBUG_MODE && console.log("User is not logged in.");
            }
            else {
                // test if token is valid
                const key = fs.readFileSync(path.join(__dirname, `./keys/${process.env.JWT_ACCESS_PRIVATE_KEYFILE}`));
                if (key) {
                    // !!! REMOVE THIS LINE BEFORE PROMOTING TO PRODUCTION !!!
                    process.env.PREAMLY_DEBUG_MODE &&
                        console.log("Contents of access key: ", key);
                    try {
                        const decoded = jwt.verify(token, key);
                        process.env.PREAMLY_DEBUG_MODE && console.log(decoded);
                        context.userId = decoded.payload.userId;
                        context.roles = decoded.payload.roles;
                        process.env.PREAMLY_DEBUG_MODE &&
                            console.log("User logged in successfully.");
                    }
                    catch (err) {
                        if (err.name === "TokenExpiredError") {
                            // TODO if token is expired, try to use refresh token.
                            // if not, we need to direct user to the login screen
                            // maybe this is a use case for TokenExpiredError afterall
                            throw new AuthenticationError(`Token is expired. ${process.env.PREAMLY_DEBUG_MODE === "true" &&
                                "Client should attempt to refresh token or reauthenticate."}`);
                        }
                        else {
                            throw new AuthenticationError("Token is invalid.");
                        }
                    }
                }
            }
        }
        catch (err) {
            if (err.code === "ENOENT") {
                context.error = new AuthenticationError(`Key file not found. ${process.env.PREAMLY_DEBUG_MODE === "true" &&
                    "Access key file not found in keys directory."}`);
            }
            else
                context.error = convertToValidError(err);
        }
        await connectDB();
        return context;
    };
    const { url } = await startStandaloneServer(server, {
        context: contextMiddleware,
        listen: { port: 4000 },
    });
    return url;
};
const url = await startApolloServer();
console.log(`🚀  Server ready at: ${url}`);
//# sourceMappingURL=bundle.js.map
