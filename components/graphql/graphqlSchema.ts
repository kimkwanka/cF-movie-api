import { buildSchema } from 'graphql';

const schema = buildSchema(`
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

type Query {
    movies: [Movie]
}
`);

export { schema };
export default { schema };
