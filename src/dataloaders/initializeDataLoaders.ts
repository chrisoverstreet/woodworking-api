import DataLoader from 'dataloader';

import createMediaByProjectIdLoader from './MediaByProjectIdLoader';
import createMediaLoader from './Media.loader';
import createProjectLoader from './Project.loader';
import createUserLoader from './User.loader';
import { Media } from '../entity/Media';
import { Project } from '../entity/Project';
import { User } from '../entity/User';

export interface DataLoaders {
  MediaByProjectIdLoader: DataLoader<string, Media[]>;
  MediaLoader: DataLoader<string, Media | null>;
  ProjectLoader: DataLoader<string, Project | null>;
  UserLoader: DataLoader<string, User | null>;
}

export default function initializeDataLoaders(): DataLoaders {
  return {
    MediaByProjectIdLoader: createMediaByProjectIdLoader(),
    MediaLoader: createMediaLoader(),
    ProjectLoader: createProjectLoader(),
    UserLoader: createUserLoader(),
  };
}
