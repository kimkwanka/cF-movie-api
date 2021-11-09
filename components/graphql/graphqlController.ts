import { graphqlHTTP } from 'express-graphql';

import { schema } from './graphqlSchema';
import { rootValue } from './graphqlService';

export default graphqlHTTP({
  schema,
  rootValue,
  graphiql: process.env.NODE_ENV !== 'production',
});
