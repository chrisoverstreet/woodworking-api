import DataLoader from 'dataloader';

import createMediaLoader from './Media.loader';
import createProjectLoader from './Project.loader';
import createUserLoader from './User.loader';
import { Media } from '../entity/Media';
import { Project } from '../entity/Project';
import { User } from '../entity/User';

export interface DataLoaders {
  MediaLoader: DataLoader<string, Media | null>;
  ProjectLoader: DataLoader<string, Project | null>;
  UserLoader: DataLoader<string, User | null>;
}

export default function initializeDataLoaders(): DataLoaders {
  return {
    MediaLoader: createMediaLoader(),
    ProjectLoader: createProjectLoader(),
    UserLoader: createUserLoader(),
  };
}
