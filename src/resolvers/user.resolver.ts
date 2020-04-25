import { auth } from 'firebase-admin';
import { ForbiddenError, ValidationError } from 'apollo-server-express';

import { addUser } from '../repositories/user.repository';
import { User } from '../entity/User';
import { Context } from '../context';

export async function firebaseUidResolver(
  { id, firebaseUid }: User,
  _args: void,
  { userId }: Context,
): Promise<string | null> {
  return id === userId ? firebaseUid : null;
}

export async function emailResolver(
  { email, id }: User,
  _args: void,
  { userId }: Context,
): Promise<string | null> {
  return id === userId ? email : null;
}

interface UserArgs {
  id: string;
}

interface FirebaseJWTArgs {
  firebaseUid: string;
}

export async function firebaseJWTResolver(
  _parent: void,
  { firebaseUid }: FirebaseJWTArgs,
) {
  return auth().createCustomToken(firebaseUid);
}

export async function userResolver(
  _parent: void,
  { id }: UserArgs,
  { UserLoader }: Context,
): Promise<User> {
  const user = await UserLoader.load(id);

  if (!user) {
    throw new ValidationError('User not found');
  }

  return user;
}

interface RegisterUserArgs {
  firebaseUid: string;
  name: string;
  email: string;
}

export async function registerResolver(
  _parent: void,
  { firebaseUid, name, email }: RegisterUserArgs,
): Promise<User> {
  const user = await User.findOne({ where: { firebaseUid } });
  if (user) {
    throw new ForbiddenError('Already registered');
  }

  return addUser({ firebaseUid, name, email });
}

export default {
  User: {
    email: emailResolver,
    firebaseUid: firebaseUidResolver,
  },
  Query: {
    firebaseJWT: firebaseJWTResolver,
    user: userResolver,
  },
  Mutation: {
    register: registerResolver,
  },
};
