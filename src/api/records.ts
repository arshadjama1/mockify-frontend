import { apiClient } from './client';
import type { MockRecord } from './types';

export const recordsApi = {
  create: async (
    schemaId: string,
    body: { data: Record<string, any> },
  ): Promise<MockRecord> => {
    const response = await apiClient.post<MockRecord>(
      `/schemas/${schemaId}/records`,
      {
        data: body.data,
      },
    );
    return response.data;
  },

  getAll: async (schemaId: string): Promise<MockRecord[]> => {
    const response = await apiClient.get<MockRecord[]>(
      `/schemas/${schemaId}/records`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<MockRecord> => {
    const response = await apiClient.get<MockRecord>(`/records/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: { data: Record<string, any>; ttlMinutes?: number },
  ): Promise<MockRecord> => {
    const response = await apiClient.put<MockRecord>(`/records/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/records/${id}`);
  },
};
