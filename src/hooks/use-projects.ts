import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '@/api/projects';
import type { ProjectInput } from '@/lib/validations';

export function useProjects(organizationId: string) {
  return useQuery({
    queryKey: ['projects', organizationId],
    queryFn: () => projectsApi.getAll(organizationId),
    enabled: !!organizationId,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectInput) => projectsApi.create(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', data.organizationId],
      });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({
        queryKey: ['organizations', data.organizationId],
      });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Omit<ProjectInput, 'organizationId'>;
    }) => projectsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });
}
