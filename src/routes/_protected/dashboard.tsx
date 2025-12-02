import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  FolderKanban,
  FileCode,
  Database,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizations } from '@/hooks/use-organizations';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
});

export function DashboardPage() {
  const { user } = useAuth();
  const { data: organizations, isLoading } = useOrganizations();
  console.log(organizations);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your Mockify workspace
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : organizations?.length}
            </div>
            <p className="text-xs text-muted-foreground">Total organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? '...'
                : organizations?.reduce(
                    (acc, org) => acc + org.projectCount,
                    0,
                  )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schemas</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Mock data schemas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Mock records created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started by creating your first organization or exploring
            existing ones
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Link to="/organizations">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Organization
            </Button>
          </Link>
          <Link to="/organizations">
            <Button variant="outline">View All Organizations</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Organizations */}
      {organizations.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
            <CardDescription>
              Your most recently created organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.slice(0, 5).map((org) => (
                <Link
                  key={org.id}
                  to="/organizations/$orgId"
                  params={{ orgId: org.id }}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {org.projectCount} project
                        {org.projectCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View →
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
