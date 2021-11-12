import { gql } from 'apollo-server-express';

const typeDefs = gql`
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

  type TMDB_Configuration {
    base_url: String!
    secure_base_url: String!
    backdrop_sizes: [String!]!
    logo_sizes: [String!]!
    poster_sizes: [String!]!
    profile_sizes: [String!]!
    still_sizes: [String!]!
  }

  type TMDB_Movie_Simple {
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

  type TMDB_Production_Company {
    name: String!
    id: Int!
    logo_path: String
    origin_country: String!
  }

  type TMDB_Production_Country {
    iso_3166_1: String!
    name: String!
  }

  type TMDB_Production_Spoken_Languaeges {
    iso_639_1: String!
    name: String!
  }

  type TMDB_Movie_Detailed {
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
    production_companies: [TMDB_Production_Company!]!
    production_countries: [TMDB_Production_Country!]!
    release_date: String!
    revenue: Int!
    runtime: Int
    spoken_languages: [TMDB_Production_Spoken_Languaeges!]!
    status: String!
    tagline: String
    title: String!
    video: Boolean!
    vote_average: Float!
    vote_count: Int!
  }

  type Query {
    movies: [Movie]
    discover: [TMDB_Movie_Simple]
    movie(id: Int!): TMDB_Movie_Detailed
  }
`;

export default typeDefs;
