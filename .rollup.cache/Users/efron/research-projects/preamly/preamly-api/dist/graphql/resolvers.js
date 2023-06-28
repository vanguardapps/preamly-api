import { KafkaPubSub } from "graphql-kafka-subscriptions";
import UserModel from "../models/UserModel";
import filterEmptyProperties from "../utils/filter-empty-properties";
import { convertToValidError, AuthenticationError } from "../utils/api-error";
import GQLError from "./gql-error";
import { Kind, } from "./codegen-server/schema-types";
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
export default resolvers;
//# sourceMappingURL=resolvers.js.map