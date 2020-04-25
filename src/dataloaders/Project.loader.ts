import DataLoader from 'dataloader';

import { Project } from '../entity/Project';

async function batchProjects(
  ids: readonly string[],
): Promise<(Project | null)[]> {
  const projects = await Project.findByIds([...ids], {
    loadRelationIds: { disableMixedMap: true },
  });

  const projectsMap = new Map<string, Project>();
  projects.forEach((project) => projectsMap.set(project.id, project));

  return ids.map((id) => projectsMap.get(id) || null);
}

export default function createProjectLoader(): DataLoader<
  string,
  Project | null
> {
  return new DataLoader<string, Project | null>(batchProjects);
}
