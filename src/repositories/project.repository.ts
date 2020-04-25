import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Project } from '../entity/Project';
import { User } from '../entity/User';

interface AddProjectArgs {
  user: User;
  title: string;
  content: string | null;
  publishedAt: Date | null;
}

export async function addProject({
  user,
  title,
  content,
  publishedAt,
}: AddProjectArgs): Promise<Project> {
  const project = new Project();

  project.user = user;
  project.title = title;
  project.content = content || undefined;
  project.publishedAt = publishedAt || undefined;

  return project.save();
}

export interface UpdateProjectArgs {
  id: string;
  title: string | null | undefined;
  content: string | null | undefined;
  publishedAt: Date | null | undefined;
}

export async function updateProject({
  id,
  title,
  content,
  publishedAt,
}: UpdateProjectArgs): Promise<void> {
  const partialEntity: QueryPartialEntity<Project> = {};

  if (typeof title === 'string') {
    partialEntity.title = title;
  } else if (title === null) {
    partialEntity.title = undefined;
  }

  if (typeof content === 'string') {
    partialEntity.content = content;
  } else if (content === null) {
    partialEntity.content = undefined;
  }

  if (publishedAt) {
    partialEntity.publishedAt = publishedAt;
  }

  const { affected = 0 } = await Project.update(
    {
      id,
    },
    partialEntity,
  );
  if (!affected) {
    throw new Error('Failed to update project');
  }
}
