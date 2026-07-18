import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router';
import { authApi } from '@/api/auth';
import { CURRENT_USER_KEY } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { tokenStore } from '@/api/token';

export const Route = createFileRoute('/oauth2/redirect')({
  validateSearch: (search: Record<string, any>) => ({
    status: search.status as string | undefined,
    error: search.error as string | undefined,
  }),

  beforeLoad: async ({ search, context }) => {
    const { status, error } = search;
    const { queryClient } = context;

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      throw redirect({ to: '/login' });
    }

    if (status !== 'success') {
      toast.error('Invalid authentication response');
      throw redirect({ to: '/login' });
    }

    try {
      const { access_token } = await authApi.refresh();
      tokenStore.set(access_token);

      const user = await authApi.getCurrentUser();
      queryClient.setQueryData(CURRENT_USER_KEY, user);

      toast.success('Successfully signed in with Google');
      throw redirect({ to: '/dashboard' });

    } catch (err) {
      if (isRedirect(err)) {
        throw err;
      }

      console.error('OAuth token exchange failed:', err);
      toast.error('Failed to complete secure authentication');
      throw redirect({ to: '/login' });
    }
  },

  component: OAuth2RedirectPage,
});

function OAuth2RedirectPage() {
  return <LoadingSpinner />;
}