import DataLoader from 'dataloader';

import createProjectLoader from './Project.loader';
import createUserLoader from './User.loader';
import { Project } from '../entity/Project';
import { User } from '../entity/User';

export interface DataLoaders {
  ProjectLoader: DataLoader<string, Project | null>;
  UserLoader: DataLoader<string, User | null>;
}

export default function initializeDataLoaders(): DataLoaders {
  return {
    ProjectLoader: createProjectLoader(),
    UserLoader: createUserLoader(),
  };
}
