import { GraphQLResolveInfo } from 'graphql';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Director = {
  __typename?: 'Director';
  bio: Scalars['String'];
  birth: Scalars['String'];
  death: Scalars['String'];
  name: Scalars['String'];
};

export type Genre = {
  __typename?: 'Genre';
  description: Scalars['String'];
  name: Scalars['String'];
};

export type Movie = {
  __typename?: 'Movie';
  _id: Scalars['String'];
  description: Scalars['String'];
  director: Director;
  featured: Scalars['Boolean'];
  genre: Genre;
  rating: Scalars['Float'];
  slug: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  discover?: Maybe<Array<Maybe<TmdbMovieSimple>>>;
  movie?: Maybe<TmdbMovieDetailed>;
  movies?: Maybe<Array<Maybe<Movie>>>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type QueryMovieArgs = {
  id: Scalars['Int'];
};

export type TmdbConfiguration = {
  __typename?: 'TMDBConfiguration';
  backdrop_sizes: Array<Scalars['String']>;
  base_url: Scalars['String'];
  logo_sizes: Array<Scalars['String']>;
  poster_sizes: Array<Scalars['String']>;
  profile_sizes: Array<Scalars['String']>;
  secure_base_url: Scalars['String'];
  still_sizes: Array<Scalars['String']>;
};

export type TmdbMovieDetailed = {
  __typename?: 'TMDBMovieDetailed';
  adult: Scalars['Boolean'];
  backdrop_path?: Maybe<Scalars['String']>;
  budget: Scalars['Int'];
  genre_ids: Array<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  imdb_id?: Maybe<Scalars['String']>;
  original_language: Scalars['Boolean'];
  original_title: Scalars['String'];
  overview?: Maybe<Scalars['String']>;
  popularity: Scalars['Float'];
  poster_path: Scalars['String'];
  production_companies: Array<TmdbProductionCompany>;
  production_countries: Array<TmdbProductionCountry>;
  release_date: Scalars['String'];
  revenue: Scalars['Int'];
  runtime?: Maybe<Scalars['Int']>;
  spoken_languages: Array<TmdbProductionSpokenLanguaeges>;
  status: Scalars['String'];
  tagline?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  video: Scalars['Boolean'];
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type TmdbMovieSimple = {
  __typename?: 'TMDBMovieSimple';
  adult: Scalars['Boolean'];
  backdrop_path: Scalars['String'];
  genre_ids: Array<Scalars['String']>;
  id: Scalars['Int'];
  original_language: Scalars['Boolean'];
  original_title: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path: Scalars['String'];
  release_date: Scalars['String'];
  title: Scalars['String'];
  video: Scalars['Boolean'];
  vote_average: Scalars['Float'];
  vote_count: Scalars['Int'];
};

export type TmdbProductionCompany = {
  __typename?: 'TMDBProductionCompany';
  id: Scalars['Int'];
  logo_path?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  origin_country: Scalars['String'];
};

export type TmdbProductionCountry = {
  __typename?: 'TMDBProductionCountry';
  iso_3166_1: Scalars['String'];
  name: Scalars['String'];
};

export type TmdbProductionSpokenLanguaeges = {
  __typename?: 'TMDBProductionSpokenLanguaeges';
  iso_639_1: Scalars['String'];
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  birthday: Scalars['String'];
  email: Scalars['String'];
  favoriteMovies: Array<Maybe<Scalars['String']>>;
  password: Scalars['String'];
  username: Scalars['String'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Director: ResolverTypeWrapper<Director>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Genre: ResolverTypeWrapper<Genre>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Movie: ResolverTypeWrapper<Movie>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TMDBConfiguration: ResolverTypeWrapper<TmdbConfiguration>;
  TMDBMovieDetailed: ResolverTypeWrapper<TmdbMovieDetailed>;
  TMDBMovieSimple: ResolverTypeWrapper<TmdbMovieSimple>;
  TMDBProductionCompany: ResolverTypeWrapper<TmdbProductionCompany>;
  TMDBProductionCountry: ResolverTypeWrapper<TmdbProductionCountry>;
  TMDBProductionSpokenLanguaeges: ResolverTypeWrapper<TmdbProductionSpokenLanguaeges>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Director: Director;
  Float: Scalars['Float'];
  Genre: Genre;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Movie: Movie;
  Query: {};
  String: Scalars['String'];
  TMDBConfiguration: TmdbConfiguration;
  TMDBMovieDetailed: TmdbMovieDetailed;
  TMDBMovieSimple: TmdbMovieSimple;
  TMDBProductionCompany: TmdbProductionCompany;
  TMDBProductionCountry: TmdbProductionCountry;
  TMDBProductionSpokenLanguaeges: TmdbProductionSpokenLanguaeges;
  User: User;
};

export type DirectorResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Director'] = ResolversParentTypes['Director'],
> = {
  bio?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  birth?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  death?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenreResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Genre'] = ResolversParentTypes['Genre'],
> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie'],
> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  director?: Resolver<ResolversTypes['Director'], ParentType, ContextType>;
  featured?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  genre?: Resolver<ResolversTypes['Genre'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  discover?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['TMDBMovieSimple']>>>,
    ParentType,
    ContextType
  >;
  movie?: Resolver<
    Maybe<ResolversTypes['TMDBMovieDetailed']>,
    ParentType,
    ContextType,
    RequireFields<QueryMovieArgs, 'id'>
  >;
  movies?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Movie']>>>,
    ParentType,
    ContextType
  >;
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['User']>>>,
    ParentType,
    ContextType
  >;
};

export type TmdbConfigurationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TMDBConfiguration'] = ResolversParentTypes['TMDBConfiguration'],
> = {
  backdrop_sizes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  base_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logo_sizes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  poster_sizes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  profile_sizes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  secure_base_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  still_sizes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TmdbMovieDetailedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TMDBMovieDetailed'] = ResolversParentTypes['TMDBMovieDetailed'],
> = {
  adult?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  backdrop_path?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  budget?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  genre_ids?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  homepage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imdb_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  original_language?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  original_title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  overview?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  popularity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  poster_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  production_companies?: Resolver<
    Array<ResolversTypes['TMDBProductionCompany']>,
    ParentType,
    ContextType
  >;
  production_countries?: Resolver<
    Array<ResolversTypes['TMDBProductionCountry']>,
    ParentType,
    ContextType
  >;
  release_date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  runtime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  spoken_languages?: Resolver<
    Array<ResolversTypes['TMDBProductionSpokenLanguaeges']>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tagline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  video?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  vote_average?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  vote_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TmdbMovieSimpleResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TMDBMovieSimple'] = ResolversParentTypes['TMDBMovieSimple'],
> = {
  adult?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  backdrop_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  genre_ids?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  original_language?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  original_title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  overview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  popularity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  poster_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  release_date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  video?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  vote_average?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  vote_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TmdbProductionCompanyResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TMDBProductionCompany'] = ResolversParentTypes['TMDBProductionCompany'],
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  logo_path?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  origin_country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TmdbProductionCountryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TMDBProductionCountry'] = ResolversParentTypes['TMDBProductionCountry'],
> = {
  iso_3166_1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TmdbProductionSpokenLanguaegesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TMDBProductionSpokenLanguaeges'] = ResolversParentTypes['TMDBProductionSpokenLanguaeges'],
> = {
  iso_639_1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favoriteMovies?: Resolver<
    Array<Maybe<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Director?: DirectorResolvers<ContextType>;
  Genre?: GenreResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  TMDBConfiguration?: TmdbConfigurationResolvers<ContextType>;
  TMDBMovieDetailed?: TmdbMovieDetailedResolvers<ContextType>;
  TMDBMovieSimple?: TmdbMovieSimpleResolvers<ContextType>;
  TMDBProductionCompany?: TmdbProductionCompanyResolvers<ContextType>;
  TMDBProductionCountry?: TmdbProductionCountryResolvers<ContextType>;
  TMDBProductionSpokenLanguaeges?: TmdbProductionSpokenLanguaegesResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
