import { schemasApi } from '@/api/schemas';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSchemas(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'schemas'],
    queryFn: () => schemasApi.getByProject(projectId),
    enabled: !!projectId,
  });
}

export function useSchema(id: string) {
  return useQuery({
    queryKey: ['schemas', id],
    queryFn: () => schemasApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSchema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      projectId: string;
      schemaJson: Record<string, any>;
    }) => schemasApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', variables.projectId, 'schemas'],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects', variables.projectId],
      });
      toast.success('Schema created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create schema');
    },
  });
}

export function useUpdateSchema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; schemaJson: Record<string, any> };
    }) => schemasApi.update(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['schemas', result.id] });
      queryClient.invalidateQueries({
        queryKey: ['projects', result.projectId, 'schemas'],
      });
      toast.success('Schema updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update schema');
    },
  });
}

export function useDeleteSchema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => schemasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['schemas'] });
      toast.success('Schema deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete schema');
    },
  });
}
