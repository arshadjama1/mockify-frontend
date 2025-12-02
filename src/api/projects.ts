import { apiClient as api } from '@/api/client';
import type { Project, ProjectDetail } from '@/api/types';
import type { ProjectInput } from '@/lib/validations';

export const projectsApi = {
  getAll: async (organizationId: string): Promise<Project[]> => {
    const response = await api.get<Project[]>(
      `/organizations/${organizationId}/projects`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<ProjectDetail> => {
    const response = await api.get<ProjectDetail>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: ProjectInput): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Omit<ProjectInput, 'organizationId'>,
  ): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};
