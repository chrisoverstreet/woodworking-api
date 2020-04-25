import DataLoader from 'dataloader';

import { User } from '../entity/User';

async function batchUsers(ids: readonly string[]): Promise<(User | null)[]> {
  const users = await User.findByIds([...ids]);

  const usersMap = new Map<string, User>();
  users.forEach((user) => usersMap.set(user.id, user));

  return ids.map((id) => usersMap.get(id) || null);
}

export default function createUserLoader(): DataLoader<string, User | null> {
  return new DataLoader<string, User | null>(batchUsers);
}
