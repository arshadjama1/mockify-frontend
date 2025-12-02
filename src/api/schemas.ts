import { apiClient } from './client';
import type { MockSchema, MockSchemaDetail } from './types';

export const schemasApi = {
  getByProject: async (projectId: string): Promise<MockSchema[]> => {
    const response = await apiClient.get<MockSchema[]>(
      `/projects/${projectId}/schemas`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<MockSchemaDetail> => {
    const response = await apiClient.get<MockSchemaDetail>(`/schemas/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    projectId: string;
    schemaJson: Record<string, object>;
  }): Promise<MockSchema> => {
    const response = await apiClient.post<MockSchema>('/schemas', data);
    return response.data;
  },

  update: async (
    id: string,
    data: { name: string; schemaJson: Record<string, object> },
  ): Promise<MockSchema> => {
    const response = await apiClient.put<MockSchema>(`/schemas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/schemas/${id}`);
  },
};
