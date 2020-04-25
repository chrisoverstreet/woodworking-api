import { AuthenticationError, ValidationError } from 'apollo-server-express';

import { Context } from '../context';
import { Project } from '../entity/Project';
import { addProject, updateProject } from '../repositories/project.repository';

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
    user: userResolver,
    userId: userIdResolver,
  },
  Query: {
    project: projectResolver,
  },
  Mutation: {
    addProject: addProjectResolver,
    updateProject: updateProjectResolver,
  },
};
