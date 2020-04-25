import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

import { getFirebaseUserFromRequest } from './lib/firebase';
import initializeDataLoaders, {
  DataLoaders,
} from './dataloaders/initializeDataLoaders';
import { getUserByFirebaseUid } from './repositories/user.repository';

export interface Context extends DataLoaders {
  userId: string | null;
}

export default async function context({
  req,
}: ExpressContext): Promise<Context> {
  const dataLoaders = initializeDataLoaders();

  let userId = null;
  const firebaseUser = await getFirebaseUserFromRequest(req);
  if (firebaseUser?.uid) {
    const user = await getUserByFirebaseUid(firebaseUser.uid);
    if (user) {
      dataLoaders.UserLoader.prime(user.id, user);
      userId = user.id;
    }
  }

  return {
    ...dataLoaders,
    userId,
  };
}
