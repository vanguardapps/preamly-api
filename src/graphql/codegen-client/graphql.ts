/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ApiError = Error & {
  __typename?: 'APIError';
  kind: Kind;
  message: Scalars['String'];
};

export type AuthenticationError = Error & {
  __typename?: 'AuthenticationError';
  kind: Kind;
  message: Scalars['String'];
};

export type AuthorizationError = Error & {
  __typename?: 'AuthorizationError';
  kind: Kind;
  message: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type CreateUserResult = ApiError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | User | ValidationError;

export type DatabaseError = Error & {
  __typename?: 'DatabaseError';
  kind: Kind;
  message: Scalars['String'];
};

export type DeveloperError = Error & {
  __typename?: 'DeveloperError';
  kind: Kind;
  message: Scalars['String'];
};

export type Error = {
  kind: Kind;
  message: Scalars['String'];
};

export enum Kind {
  ApiError = 'APIError',
  AuthenticationError = 'AuthenticationError',
  AuthorizationError = 'AuthorizationError',
  DatabaseError = 'DatabaseError',
  DeveloperError = 'DeveloperError',
  SchemaError = 'SchemaError',
  SignInResultSuccess = 'SignInResultSuccess',
  User = 'User',
  Users = 'Users',
  ValidationError = 'ValidationError'
}

export type Message = {
  __typename?: 'Message';
  content?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: CreateUserResult;
  sendMessage: Message;
  signIn: SignInResult;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationSendMessageArgs = {
  content?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationSignInArgs = {
  input: SignInInput;
};

export type Node = {
  id: Scalars['ID'];
  kind: Kind;
};

export type Query = {
  __typename?: 'Query';
  getUser: UserResult;
  user: UserResult;
  users: UsersResult;
  viewMessages?: Maybe<Array<Message>>;
};


export type QueryUserArgs = {
  input: UserInput;
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SchemaError = Error & {
  __typename?: 'SchemaError';
  kind: Kind;
  message: Scalars['String'];
};

export type SignInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignInResult = ApiError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | SignInResultSuccess | ValidationError;

export type SignInResultSuccess = Node & {
  __typename?: 'SignInResultSuccess';
  id: Scalars['ID'];
  kind: Kind;
  redirect: Scalars['String'];
  token: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  receiveMessage: Message;
};

export type User = Node & {
  __typename?: 'User';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  kind: Kind;
  lastName: Scalars['String'];
  password: Scalars['String'];
  roles: Array<Role>;
  token?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  lastName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type UserResult = ApiError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | User | ValidationError;

export type Users = {
  __typename?: 'Users';
  users: Array<User>;
};

export type UsersResult = ApiError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | Users | ValidationError;

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  kind: Kind;
  message: Scalars['String'];
};
