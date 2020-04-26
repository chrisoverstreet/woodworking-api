import {
  AuthenticationError,
  ApolloError,
  ValidationError,
} from 'apollo-server-express';
import { Stream } from 'stream';

import { addProject, updateProject } from '../repositories/project.repository';
import { addProjectMedia } from '../repositories/projectMedia.repository';
import { Context } from '../context';
import { Media } from '../entity/Media';
import { Project } from '../entity/Project';

async function mediaResolver(
  { id }: Project,
  _args: void,
  { MediaByProjectIdLoader, MediaLoader }: Context,
): Promise<Media[]> {
  const media = await MediaByProjectIdLoader.load(id);

  media.forEach((singleMedia) =>
    MediaLoader.prime(singleMedia.id, singleMedia),
  );

  return media;
}

async function userResolver(
  { user }: Project,
  _args: void,
  { UserLoader }: Context,
) {
  return UserLoader.load(user.id);
}

function userIdResolver({ user }: Project): string {
  return user.id;
}

interface ProjectArgs {
  id: string;
}

async function projectResolver(
  _parent: void,
  { id }: ProjectArgs,
  { ProjectLoader }: Context,
): Promise<Project> {
  const project = await ProjectLoader.load(id);

  if (!project) {
    throw new ValidationError('Project not found');
  }

  return project;
}

interface AddProjectArgs {
  title: string;
  content: string | null;
  publishedAt: string | null;
}

async function addProjectResolver(
  _parent: void,
  { title, content, publishedAt }: AddProjectArgs,
  { ProjectLoader, userId, UserLoader }: Context,
): Promise<Project> {
  if (!userId) {
    throw new AuthenticationError('Not signed in');
  }

  const user = await UserLoader.load(userId);
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  const project = await addProject({
    user,
    title,
    content,
    publishedAt: publishedAt ? new Date(publishedAt) : null,
  });

  ProjectLoader.prime(project.id, project);

  return project;
}

interface AddProjectMediaArgs {
  file: Promise<{
    mimetype: string;
    createReadStream: () => Stream;
  }>;
  projectId: string;
}

async function addProjectMediaResolver(
  _parent: void,
  { file, projectId }: AddProjectMediaArgs,
  { MediaLoader, ProjectLoader, userId, UserLoader }: Context,
): Promise<Media> {
  if (!userId) {
    throw new AuthenticationError('Not authorized');
  }

  const user = await UserLoader.load(userId);
  if (!user) {
    throw new ValidationError('User not found');
  }

  const project = await ProjectLoader.load(projectId);
  if (!project) {
    throw new ValidationError('Project not found');
  }
  if (project.user.id !== userId) {
    throw new ValidationError('Not authorized');
  }

  const projectMedia = await addProjectMedia({ file, project, user });

  const media = await MediaLoader.load(projectMedia.media.id);

  if (!media) {
    throw new ApolloError('There was an error uploading media');
  }

  return media;
}

interface UpdateProjectArgs {
  id: string;
  title: string | null | undefined;
  content: string | null | undefined;
  publishedAt: string | null | undefined;
}

async function updateProjectResolver(
  _parent: void,
  { id, title, content, publishedAt }: UpdateProjectArgs,
  { ProjectLoader, userId }: Context,
) {
  if (!userId) {
    throw new ValidationError('Unauthorized');
  }

  const project = await ProjectLoader.load(id);
  if (!project) {
    throw new ValidationError('Project not found');
  }
  if (project.user.id !== userId) {
    throw new AuthenticationError('Unauthorized');
  }

  await updateProject({
    id,
    title,
    content,
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
  });

  ProjectLoader.clear(project.id);

  return ProjectLoader.load(project.id);
}

export default {
  Project: {
    media: mediaResolver,
    user: userResolver,
    userId: userIdResolver,
  },
  Query: {
    project: projectResolver,
  },
  Mutation: {
    addProject: addProjectResolver,
    addProjectMedia: addProjectMediaResolver,
    updateProject: updateProjectResolver,
  },
};
