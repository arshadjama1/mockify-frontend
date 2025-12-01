import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { toast } from 'sonner';
import type { LoginRequest, RegisterRequest, User } from '@/api/types';

export const CURRENT_USER_KEY = ['auth', 'me'];

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: CURRENT_USER_KEY,
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.access_token);
      toast.success('Logged in');

      queryClient.setQueryData(CURRENT_USER_KEY, res.user);
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Invalid login');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.access_token);
      toast.success('Account created');

      queryClient.setQueryData(CURRENT_USER_KEY, res.user);
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');

      queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });

      toast.success('Logged out');
    },
    onError: () => {
      // Even if server fails, clear client state
      localStorage.removeItem('accessToken');
      queryClient.removeQueries({ queryKey: CURRENT_USER_KEY });
    },
  });
}

export function useGoogleLogin() {
  return {
    initiateGoogleLogin: () => {
      window.location.href = authApi.getGoogleAuthUrl();
    },
  };
}
