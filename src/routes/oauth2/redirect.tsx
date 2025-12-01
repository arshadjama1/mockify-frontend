import { createFileRoute, redirect } from '@tanstack/react-router';
import { authApi } from '@/api/auth';
import { CURRENT_USER_KEY } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const Route = createFileRoute('/oauth2/redirect')({
  validateSearch: (search: Record<string, any>) => ({
    access_token: search.access_token as string | undefined,
    error: search.error as string | undefined,
  }),

  beforeLoad: async ({ search, context }) => {
    const { access_token, error } = search;
    const { queryClient } = context;

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      throw redirect({ to: '/login' });
    }

    if (!access_token) {
      toast.error('No access token received');
      throw redirect({ to: '/login' });
    }

    // Save token
    localStorage.setItem('accessToken', access_token);

    // Fetch user using the token
    const user = await authApi.getCurrentUser();
    queryClient.setQueryData(CURRENT_USER_KEY, user);

    toast.success('Successfully signed in with Google');

    throw redirect({ to: '/dashboard' });
  },

  component: OAuth2RedirectPage,
});

function OAuth2RedirectPage() {
  return <LoadingSpinner />;
}
