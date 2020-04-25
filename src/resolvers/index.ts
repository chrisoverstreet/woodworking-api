import path from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

const resolversArray = fileLoader(path.join(__dirname, '.**/*.resolver.ts'), {
  recursive: true,
});

export default mergeResolvers(resolversArray);
