import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationsApi } from '@/api/organizations';
import type { OrganizationInput } from '@/lib/validations';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationsApi.getAll,
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => organizationsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrganizationInput) => organizationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization created successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create organization',
      );
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrganizationInput }) =>
      organizationsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', id] });
      toast.success('Organization updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update organization',
      );
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization deleted successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to delete organization',
      );
    },
  });
}
