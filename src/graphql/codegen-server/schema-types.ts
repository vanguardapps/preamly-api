import { GraphQLResolveInfo } from 'graphql';
import { GQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type APIError = Error & {
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

export type CreateUserResult = APIError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | User | ValidationError;

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
  APIError = 'APIError',
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


export type MutationcreateUserArgs = {
  input: CreateUserInput;
};


export type MutationsendMessageArgs = {
  content?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationsignInArgs = {
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


export type QueryuserArgs = {
  input: UserInput;
};

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
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

export type SignInResult = APIError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | SignInResultSuccess | ValidationError;

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

export type UserResult = APIError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | User | ValidationError;

export type Users = {
  __typename?: 'Users';
  users: Array<User>;
};

export type UsersResult = APIError | AuthenticationError | AuthorizationError | DatabaseError | DeveloperError | SchemaError | Users | ValidationError;

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  kind: Kind;
  message: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes = ResolversObject<{
  CreateUserResult: ( APIError ) | ( AuthenticationError ) | ( AuthorizationError ) | ( DatabaseError ) | ( DeveloperError ) | ( SchemaError ) | ( User ) | ( ValidationError );
  SignInResult: ( APIError ) | ( AuthenticationError ) | ( AuthorizationError ) | ( DatabaseError ) | ( DeveloperError ) | ( SchemaError ) | ( SignInResultSuccess ) | ( ValidationError );
  UserResult: ( APIError ) | ( AuthenticationError ) | ( AuthorizationError ) | ( DatabaseError ) | ( DeveloperError ) | ( SchemaError ) | ( User ) | ( ValidationError );
  UsersResult: ( APIError ) | ( AuthenticationError ) | ( AuthorizationError ) | ( DatabaseError ) | ( DeveloperError ) | ( SchemaError ) | ( Users ) | ( ValidationError );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  APIError: ResolverTypeWrapper<APIError>;
  AuthenticationError: ResolverTypeWrapper<AuthenticationError>;
  AuthorizationError: ResolverTypeWrapper<AuthorizationError>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateUserInput: CreateUserInput;
  CreateUserResult: ResolverTypeWrapper<ResolversUnionTypes['CreateUserResult']>;
  DatabaseError: ResolverTypeWrapper<DatabaseError>;
  DeveloperError: ResolverTypeWrapper<DeveloperError>;
  Error: ResolversTypes['APIError'] | ResolversTypes['AuthenticationError'] | ResolversTypes['AuthorizationError'] | ResolversTypes['DatabaseError'] | ResolversTypes['DeveloperError'] | ResolversTypes['SchemaError'] | ResolversTypes['ValidationError'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Kind: Kind;
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['SignInResultSuccess'] | ResolversTypes['User'];
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  SchemaError: ResolverTypeWrapper<SchemaError>;
  SignInInput: SignInInput;
  SignInResult: ResolverTypeWrapper<ResolversUnionTypes['SignInResult']>;
  SignInResultSuccess: ResolverTypeWrapper<SignInResultSuccess>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserResult: ResolverTypeWrapper<ResolversUnionTypes['UserResult']>;
  Users: ResolverTypeWrapper<Users>;
  UsersResult: ResolverTypeWrapper<ResolversUnionTypes['UsersResult']>;
  ValidationError: ResolverTypeWrapper<ValidationError>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  APIError: APIError;
  AuthenticationError: AuthenticationError;
  AuthorizationError: AuthorizationError;
  Boolean: Scalars['Boolean'];
  CreateUserInput: CreateUserInput;
  CreateUserResult: ResolversUnionTypes['CreateUserResult'];
  DatabaseError: DatabaseError;
  DeveloperError: DeveloperError;
  Error: ResolversParentTypes['APIError'] | ResolversParentTypes['AuthenticationError'] | ResolversParentTypes['AuthorizationError'] | ResolversParentTypes['DatabaseError'] | ResolversParentTypes['DeveloperError'] | ResolversParentTypes['SchemaError'] | ResolversParentTypes['ValidationError'];
  ID: Scalars['ID'];
  Message: Message;
  Mutation: {};
  Node: ResolversParentTypes['SignInResultSuccess'] | ResolversParentTypes['User'];
  Query: {};
  SchemaError: SchemaError;
  SignInInput: SignInInput;
  SignInResult: ResolversUnionTypes['SignInResult'];
  SignInResultSuccess: SignInResultSuccess;
  String: Scalars['String'];
  Subscription: {};
  User: User;
  UserInput: UserInput;
  UserResult: ResolversUnionTypes['UserResult'];
  Users: Users;
  UsersResult: ResolversUnionTypes['UsersResult'];
  ValidationError: ValidationError;
}>;

export type APIErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['APIError'] = ResolversParentTypes['APIError']> = ResolversObject<{
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticationErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['AuthenticationError'] = ResolversParentTypes['AuthenticationError']> = ResolversObject<{
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthorizationErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['AuthorizationError'] = ResolversParentTypes['AuthorizationError']> = ResolversObject<{
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateUserResultResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['CreateUserResult'] = ResolversParentTypes['CreateUserResult']> = ResolversObject<{
  __resolveType?: TypeResolveFn<'APIError' | 'AuthenticationError' | 'AuthorizationError' | 'DatabaseError' | 'DeveloperError' | 'SchemaError' | 'User' | 'ValidationError', ParentType, ContextType>;
}>;

export type DatabaseErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DatabaseError'] = ResolversParentTypes['DatabaseError']> = ResolversObject<{
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeveloperErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DeveloperError'] = ResolversParentTypes['DeveloperError']> = ResolversObject<{
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType?: TypeResolveFn<'APIError' | 'AuthenticationError' | 'AuthorizationError' | 'DatabaseError' | 'DeveloperError' | 'SchemaError' | 'ValidationError', ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MessageResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createUser?: Resolver<ResolversTypes['CreateUserResult'], ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  sendMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, Partial<MutationsendMessageArgs>>;
  signIn?: Resolver<ResolversTypes['SignInResult'], ParentType, ContextType, RequireFields<MutationsignInArgs, 'input'>>;
}>;

export type NodeResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType?: TypeResolveFn<'SignInResultSuccess' | 'User', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getUser?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType, RequireFields<QueryuserArgs, 'input'>>;
  users?: Resolver<ResolversTypes['UsersResult'], ParentType, ContextType>;
  viewMessages?: Resolver<Maybe<Array<ResolversTypes['Message']>>, ParentType, ContextType>;
}>;

export type SchemaErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['SchemaError'] = ResolversParentTypes['SchemaError']> = ResolversObject<{
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignInResultResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['SignInResult'] = ResolversParentTypes['SignInResult']> = ResolversObject<{
  __resolveType?: TypeResolveFn<'APIError' | 'AuthenticationError' | 'AuthorizationError' | 'DatabaseError' | 'DeveloperError' | 'SchemaError' | 'SignInResultSuccess' | 'ValidationError', ParentType, ContextType>;
}>;

export type SignInResultSuccessResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['SignInResultSuccess'] = ResolversParentTypes['SignInResultSuccess']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  redirect?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  receiveMessage?: SubscriptionResolver<ResolversTypes['Message'], "receiveMessage", ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResultResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['UserResult'] = ResolversParentTypes['UserResult']> = ResolversObject<{
  __resolveType?: TypeResolveFn<'APIError' | 'AuthenticationError' | 'AuthorizationError' | 'DatabaseError' | 'DeveloperError' | 'SchemaError' | 'User' | 'ValidationError', ParentType, ContextType>;
}>;

export type UsersResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Users'] = ResolversParentTypes['Users']> = ResolversObject<{
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsersResultResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['UsersResult'] = ResolversParentTypes['UsersResult']> = ResolversObject<{
  __resolveType?: TypeResolveFn<'APIError' | 'AuthenticationError' | 'AuthorizationError' | 'DatabaseError' | 'DeveloperError' | 'SchemaError' | 'Users' | 'ValidationError', ParentType, ContextType>;
}>;

export type ValidationErrorResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError']> = ResolversObject<{
  kind?: Resolver<ResolversTypes['Kind'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GQLContext> = ResolversObject<{
  APIError?: APIErrorResolvers<ContextType>;
  AuthenticationError?: AuthenticationErrorResolvers<ContextType>;
  AuthorizationError?: AuthorizationErrorResolvers<ContextType>;
  CreateUserResult?: CreateUserResultResolvers<ContextType>;
  DatabaseError?: DatabaseErrorResolvers<ContextType>;
  DeveloperError?: DeveloperErrorResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SchemaError?: SchemaErrorResolvers<ContextType>;
  SignInResult?: SignInResultResolvers<ContextType>;
  SignInResultSuccess?: SignInResultSuccessResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserResult?: UserResultResolvers<ContextType>;
  Users?: UsersResolvers<ContextType>;
  UsersResult?: UsersResultResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
}>;

