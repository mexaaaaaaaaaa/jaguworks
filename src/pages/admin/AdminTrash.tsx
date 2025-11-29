import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Trash2,
  RotateCcw,
  Clock,
  FileText,
  Package,
  MessageSquare,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TrashItem {
  id: string;
  original_table: string;
  original_id: string;
  data: Record<string, unknown>;
  deleted_at: string;
  expires_at: string;
}

const tableIcons: Record<string, typeof FileText> = {
  blog_posts: FileText,
  plans: Package,
  testimonials: MessageSquare,
  achievements: Award,
};

export default function AdminTrash() {
  const queryClient = useQueryClient();

  const { data: trashItems = [], isLoading } = useQuery({
    queryKey: ['admin-trash'],
    queryFn: async () => {
      const { data } = await supabase
        .from('trash_bin')
        .select('*')
        .order('deleted_at', { ascending: false });
      return (data || []) as TrashItem[];
    }
  });

  const restoreMutation = useMutation({
    mutationFn: async (item: TrashItem) => {
      // Restore to original table
      const { error: insertError } = await supabase
        .from(item.original_table as any)
        .insert(item.data as any);

      if (insertError) throw insertError;

      // Remove from trash
      await supabase.from('trash_bin').delete().eq('id', item.id);
    },
    onSuccess: () => {
      toast.success('Item restored successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-trash'] });
    },
    onError: (error) => {
      toast.error('Restore failed: ' + (error as Error).message);
    }
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('trash_bin').delete().eq('id', id);
    },
    onSuccess: () => {
      toast.success('Item permanently deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-trash'] });
    }
  });

  const emptyTrashMutation = useMutation({
    mutationFn: async () => {
      await supabase.from('trash_bin').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    },
    onSuccess: () => {
      toast.success('Trash emptied');
      queryClient.invalidateQueries({ queryKey: ['admin-trash'] });
    }
  });

  const getItemName = (item: TrashItem) => {
    const data = item.data;
    return (data.name || data.title || data.content?.toString().slice(0, 50) || 'Unnamed item') as string;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Trash</h1>
          <p className="text-muted-foreground">
            {trashItems.length} items • Items are permanently deleted after 30 days
          </p>
        </div>
        {trashItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Empty Trash
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Empty Trash?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {trashItems.length} items. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground"
                  onClick={() => emptyTrashMutation.mutate()}
                >
                  Empty Trash
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {trashItems.length === 0 ? (
        <Card className="bg-card/50">
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Trash2 className="w-12 h-12 mb-4 opacity-50" />
            <p>Trash is empty</p>
            <p className="text-sm">Deleted items will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {trashItems.map((item) => {
            const Icon = tableIcons[item.original_table] || FileText;
            const daysUntilExpiry = Math.ceil(
              (new Date(item.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{getItemName(item)}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{item.original_table.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>Deleted {formatDistanceToNow(new Date(item.deleted_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {daysUntilExpiry <= 7 && (
                        <span className="text-xs text-yellow-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {daysUntilExpiry}d left
                        </span>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => restoreMutation.mutate(item)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{getItemName(item)}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => permanentDeleteMutation.mutate(item.id)}
                            >
                              Delete Forever
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-yellow-500/10 border-yellow-500/20">
        <CardContent className="p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500">Auto-cleanup</p>
            <p className="text-muted-foreground">
              Items in trash are automatically deleted after 30 days. Restore important items before they expire.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
