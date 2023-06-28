import { KafkaPubSub } from "graphql-kafka-subscriptions";
import UserModel from "../models/UserModel";
import filterEmptyProperties from "../utils/filter-empty-properties";
import { convertToValidError, AuthenticationError, DatabaseError } from "../utils/api-error";
import GQLError from "./gql-error";
import {
  Resolvers,
  Kind,
  Message,
  User,
  Users,
} from "./codegen-server/schema-types";
import { DocumentArrayResult } from "../models/utils/non-standard-types";

// part of a test for the Kafka setup that I keep in place
const pubsub = new KafkaPubSub({
  topic: "RoyMessages",
  host: "127.0.0.1",
  port: "9092",
  globalConfig: {}, // options passed directly to the consumer and producer
});

let messages: Message[] = [];

// graphql resolvers
const resolvers: Resolvers = {
  Query: {
    viewMessages: () => {
      return messages;
    },
    users: async () => {
      try {
        const allUsers = (await UserModel.find(
          {}
        )) as unknown as DocumentArrayResult<User>;

        console.log(allUsers);

        if (!allUsers) {
          return {
            users: [],
          } as Users;
        }

        return {
          users: allUsers.result.map((user) => user.toJSON()),
          kind: allUsers.kind,
        } as Users;
      } catch (err: any) {
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

        return user.toJSON() as User;
      } catch (err: any) {
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
      } catch (err: any) {
        return new GQLError(convertToValidError(err));
      }
    },
  },

  Mutation: {
    sendMessage: (parent, { name, content }) => {
      const id = messages.length.toString();
      const new_message: Message = {
        id,
        name: name || "Roy",
        content,
      };
      messages.push(new_message);
      pubsub.publish("RoyMessages", { receiveMessage: new_message });
      return new_message;
    },
    createUser: async (
      parent,
      { input: { firstName, lastName, email, password } }
    ) => {
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
          return new GQLError(
            new DatabaseError(`Error creating new user with email ${email}`)
          );
        }
        return savedUser.toJSON();
      } catch (err: any) {
        return new GQLError(convertToValidError(err));
      }
    },
    signIn: async (
      parent,
      { input: { email, password } },
      { userId, roles, error }
    ) => {
      try {
        if (error) {
          return error;
        }

        // TODO input validation should happen here for email and password

        const user = await UserModel.findOne({ email });

        if (!user) {
          return new GQLError(
            new AuthenticationError(`User with email ${email} not found.`)
          );
        }

        if (!(await user.comparePassword(password))) {
          return new GQLError(new AuthenticationError("Incorrect password."));
        }

        user.generateRefreshToken();
        const token = user.generateAccessToken();

        return {
          id: "0", // inheritance in types necessitates id, but it's not used here
          token,
          kind: Kind.SignInResultSuccess,
          redirect: "/home", // TODO customize this for the user entity. maybe like /user/home or something, not sure.
        };
      } catch (err: any) {
        return new GQLError(convertToValidError(err));
      }
    },
  },

  Subscription: {
    receiveMessage: {
      subscribe: () => pubsub.asyncIterator(["RoyMessages"]) as any,
    },
  },

  CreateUserResult: {
    __resolveType(obj: any) {
      if (obj?.kind) {
        return obj.kind;
      }
      return Kind.APIError;
    },
  },

  UserResult: {
    __resolveType(obj: any) {
      if (obj?.kind) {
        return obj.kind;
      }
      return Kind.APIError;
    },
  },

  UsersResult: {
    __resolveType(obj: any) {
      if (obj?.kind) {
        return obj.kind;
      }
      return Kind.APIError;
    },
  },

  SignInResult: {
    __resolveType(obj: any) {
      if (obj?.kind) {
        return obj.kind;
      }
      console.log(obj.kind);
      return Kind.APIError;
    },
  },
};

export default resolvers;
