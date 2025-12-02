import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateRecord, useDeleteRecord } from '@/hooks/use-records';
import { useSchema } from '@/hooks/use-schemas';
import { formatRelativeTime } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Database,
  Plus,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_protected/schemas/$schemaId')({
  component: SchemaDetail,
});

function SchemaDetail() {
  const { schemaId } = Route.useParams();
  const { data: schema, isLoading } = useSchema(schemaId);
  const createRecordMutation = useCreateRecord();
  const deleteRecordMutation = useDeleteRecord();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [recordData, setRecordData] = useState('{}');

  const handleCreateRecord = async (schemaId: string) => {
    try {
      const data = JSON.parse(recordData);
      await createRecordMutation.mutateAsync({
        schemaId: schemaId,
        data: { data },
      });
      setRecordData('{}');
      setIsCreateOpen(false);
    } catch (error) {
      toast.error('Invalid JSON data');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      await deleteRecordMutation.mutateAsync(id);
    }
  };

  const copySchemaJson = () => {
    navigator.clipboard.writeText(JSON.stringify(schema?.schemaJson, null, 2));
    toast.success('Schema definition copied');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Schema not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/projects/$projectId"
          params={{ projectId: schema.project.id }}
        >
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {schema.project.name}
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{schema.name}</h1>
            <p className="text-muted-foreground">
              {schema.project.name} • {schema.project.organizationName}
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Record</DialogTitle>
                  <DialogDescription>Add a new mock record</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="recordData">Record Data (JSON)</Label>
                    <textarea
                      id="recordData"
                      placeholder='{"name": "John"}'
                      value={recordData}
                      onChange={(e) => setRecordData(e.target.value)}
                      className="font-mono text-sm min-h-[200px]"
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
                    onClick={() => handleCreateRecord(schemaId)}
                    disabled={createRecordMutation.isPending}
                  >
                    {createRecordMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schema.stats.totalRecords}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {schema.stats.activeRecords}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {schema.stats.expiredRecords}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schema Definition */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Schema Definition</CardTitle>
            <Button variant="outline" size="sm" onClick={copySchemaJson}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(schema.schemaJson, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          {schema.recentRecords && schema.recentRecords.length > 0 ? (
            <div className="space-y-4">
              {schema.recentRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {record.expired ? (
                        <span className="text-xs text-red-600">Expired</span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        ID: {record.id}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(record.data, null, 2)}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {formatRelativeTime(record.createdAt)} • Expires{' '}
                    {formatRelativeTime(record.expiresAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No records yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Record
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
