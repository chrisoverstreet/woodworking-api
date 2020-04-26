import { AuthenticationError, ValidationError } from 'apollo-server-express';
import { Stream } from 'stream';

import { addWebResult } from '../repositories/webResult.respository';
import { Context } from '../context';
import { User } from '../entity/User';
import { WebResult } from '../entity/WebResult';
import { Media } from '../entity/Media';

async function mediaResolver(
  { media: { id } }: WebResult,
  _args: void,
  { MediaLoader }: Context,
): Promise<Media> {
  const media = await MediaLoader.load(id);

  if (!media) {
    throw new ValidationError('Media not found');
  }

  return media;
}

async function userResolver(
  { user }: WebResult,
  _args: void,
  { UserLoader }: Context,
): Promise<User | null> {
  if (!user) {
    return null;
  }

  return UserLoader.load(user.id);
}

interface WebResultArgs {
  id: string;
}

async function webResultResolver(
  _parent: void,
  { id }: WebResultArgs,
  { WebResultLoader }: Context,
): Promise<WebResult> {
  const webResult = await WebResultLoader.load(id);

  if (!webResult) {
    throw new ValidationError('Web result not found');
  }

  return webResult;
}

interface AddWebResultArgs {
  title: string;
  content: string | undefined;
  author: string | undefined;
  url: string;
  file: Promise<{
    mimetype: string;
    createReadStream: () => Stream;
  }>;
}

async function addWebResultResolver(
  _parent: void,
  { title, content, author, url, file }: AddWebResultArgs,
  { userId, UserLoader }: Context,
) {
  if (!userId) {
    throw new AuthenticationError('Not authorized');
  }

  const user = await UserLoader.load(userId);
  if (!user) {
    throw new ValidationError('User not found');
  }

  return addWebResult({ title, content, author, url, file, user });
}

export default {
  WebResult: {
    media: mediaResolver,
    user: userResolver,
  },
  Query: {
    webResult: webResultResolver,
  },
  Mutation: {
    addWebResult: addWebResultResolver,
  },
};
