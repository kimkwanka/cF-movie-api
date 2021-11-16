import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    _id: ID
    birthday: String!
    email: String!
    favoriteMovies: [String]!
    password: String!
    username: String!
  }

  type Genre {
    name: String!
    description: String!
  }

  type Director {
    name: String!
    bio: String!
    birth: String!
    death: String!
  }

  type Movie {
    _id: String!
    title: String!
    description: String!
    genre: Genre!
    director: Director!
    slug: String!
    featured: Boolean!
    rating: Float!
  }

  type TMDBConfiguration {
    base_url: String!
    secure_base_url: String!
    backdrop_sizes: [String!]!
    logo_sizes: [String!]!
    poster_sizes: [String!]!
    profile_sizes: [String!]!
    still_sizes: [String!]!
  }

  type TMDBMovieSimple {
    adult: Boolean!
    backdrop_path: String!
    genre_ids: [String!]!
    id: Int!
    original_language: Boolean!
    original_title: String!
    overview: String!
    popularity: Float!
    poster_path: String!
    release_date: String!
    title: String!
    video: Boolean!
    vote_average: Float!
    vote_count: Int!
  }

  type TMDBProductionCompany {
    name: String!
    id: Int!
    logo_path: String
    origin_country: String!
  }

  type TMDBProductionCountry {
    iso_3166_1: String!
    name: String!
  }

  type TMDBProductionSpokenLanguaeges {
    iso_639_1: String!
    name: String!
  }

  type TMDBMovieDetailed {
    adult: Boolean!
    backdrop_path: String
    budget: Int!
    genre_ids: [String!]!
    homepage: String
    id: Int!
    imdb_id: String
    original_language: Boolean!
    original_title: String!
    overview: String
    popularity: Float!
    poster_path: String!
    production_companies: [TMDBProductionCompany!]!
    production_countries: [TMDBProductionCountry!]!
    release_date: String!
    revenue: Int!
    runtime: Int
    spoken_languages: [TMDBProductionSpokenLanguaeges!]!
    status: String!
    tagline: String
    title: String!
    video: Boolean!
    vote_average: Float!
    vote_count: Int!
  }

  type Query {
    movies: [Movie]
    discover: [TMDBMovieSimple]
    movie(id: Int!): TMDBMovieDetailed
    users: [User]
  }
`;

export default typeDefs;
