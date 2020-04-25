import { DeleteResult } from 'typeorm';
import { User } from '../entity/User';

interface AddUserArgs {
  firebaseUid: string;
  name: string;
  email: string;
}

export async function addUser({
  firebaseUid,
  name,
  email,
}: AddUserArgs): Promise<User> {
  const user = new User();

  user.firebaseUid = firebaseUid;
  user.name = name;
  user.email = email;

  return user.save();
}

export async function deleteUser(userId: string): Promise<DeleteResult> {
  return User.delete({ id: userId });
}

export async function getUser(id: string): Promise<User | null> {
  const user = await User.findOne({ where: { id } });
  return user || null;
}

export async function getUserByFirebaseUid(
  firebaseUid: string,
): Promise<User | null> {
  const user = await User.findOne({ where: { firebaseUid } });
  return user || null;
}
