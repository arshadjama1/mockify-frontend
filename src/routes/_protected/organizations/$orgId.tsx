import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useOrganization } from '@/hooks/use-organizations';
import { useCreateProject, useDeleteProject } from '@/hooks/use-projects';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderKanban, Database, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';

export const Route = createFileRoute('/_protected/organizations/$orgId')({
  component: OrganizationDetail,
});

export function OrganizationDetail() {
  const { orgId } = Route.useParams();
  const { data: organization, isLoading } = useOrganization(orgId);
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    await createProjectMutation.mutateAsync({
      name: projectName,
      organizationId: orgId,
    });
    setProjectName('');
    setIsCreateOpen(false);
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProjectMutation.mutateAsync(id);
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

  if (!organization) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Organization not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/organizations">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organizations
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {organization.name}
            </h1>
            <p className="text-muted-foreground">
              Owned by {organization.owner.name} • Created{' '}
              {formatRelativeTime(organization.createdAt)}
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Add a new project to {organization.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="E-commerce API"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>

        {organization.projects && organization.projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {organization.projects.map((project) => (
              <Card
                key={project.id}
                className="relative group hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: project.id }}
                      className="flex-1"
                    >
                      <CardTitle className="hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        handleDeleteProject(project.id, project.name)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Database className="h-3 w-3" />
                      {project.schemaCount}{' '}
                      {project.schemaCount === 1 ? 'schema' : 'schemas'}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Created {formatRelativeTime(project.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first project to start building mock APIs
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
