import { useState } from 'react';
import {
  useOrganizations,
  useCreateOrganization,
  useDeleteOrganization,
} from '@/hooks/use-organizations';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Trash2, FolderKanban, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const Route = createFileRoute('/_protected/organizations/')({
  component: OrganizationsPage,
});

export function OrganizationsPage() {
  const { data: organizations, isLoading } = useOrganizations();
  console.log(organizations);
  const createMutation = useCreateOrganization();
  const deleteMutation = useDeleteOrganization();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [orgName, setOrgName] = useState('');

  const handleCreate = async () => {
    if (!orgName.trim()) {
      toast.error('Organization name is required');
      return;
    }

    await createMutation.mutateAsync({ name: orgName });
    setOrgName('');
    setIsCreateOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your organizations and their projects
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to manage your mock APIs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  placeholder="My Company"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : organizations && organizations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.id} className="relative group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Link
                    to="/organizations/$orgId"
                    params={{ orgId: org.id }}
                    className="flex-1"
                  >
                    <CardTitle className="hover:text-primary transition-colors">
                      {org.name}
                    </CardTitle>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(org.id, org.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-3 w-3" />
                    {org.projectCount}{' '}
                    {org.projectCount === 1 ? 'project' : 'projects'}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Created {formatRelativeTime(org.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No organizations yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Get started by creating your first organization
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
