import { recordsApi } from '@/api/records';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRecords(schemaId: string) {
  return useQuery({
    queryKey: ['schemas', schemaId, 'records'],
    queryFn: () => recordsApi.getAll(schemaId),
    enabled: !!schemaId,
  });
}

export function useRecord(id: string) {
  return useQuery({
    queryKey: ['records', id],
    queryFn: () => recordsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schemaId,
      data,
    }: {
      schemaId: string;
      data: { data: Record<string, any> };
    }) => recordsApi.create(schemaId, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ['schemas', result.schemaId, 'records'],
      });
      queryClient.invalidateQueries({
        queryKey: ['schemas', result.schemaId],
      });
      toast.success('Record created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create record');
    },
  });
}

export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { data: Record<string, any> };
    }) => recordsApi.update(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['records', result.id] });
      queryClient.invalidateQueries({
        queryKey: ['schemas', result.schemaId, 'records'],
      });
      toast.success('Record updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update record');
    },
  });
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recordsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] });
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Record deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete record');
    },
  });
}
