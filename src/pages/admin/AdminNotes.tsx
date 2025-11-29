import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  StickyNote,
  Search,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface Note {
  id: string;
  entity_type: string;
  entity_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export default function AdminNotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['admin-notes', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('internal_notes')
        .select('*')
        .eq('entity_type', 'general')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('note', `%${searchQuery}%`);
      }

      const { data } = await query;
      return (data || []) as Note[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (note: string) => {
      const { error } = await supabase.from('internal_notes').insert({
        entity_type: 'general',
        entity_id: user?.id || 'system',
        note,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Note created');
      setNewNote('');
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
    },
    onError: () => toast.error('Failed to create note')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase
        .from('internal_notes')
        .update({ note, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Note updated');
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
    },
    onError: () => toast.error('Failed to update note')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('internal_notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-notes'] });
    },
    onError: () => toast.error('Failed to delete note')
  });

  const handleCreate = () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }
    createMutation.mutate(newNote);
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.note);
  };

  const saveEdit = () => {
    if (!editContent.trim()) {
      toast.error('Note cannot be empty');
      return;
    }
    updateMutation.mutate({ id: editingId!, note: editContent });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Internal Notes</h1>
        <p className="text-muted-foreground">Private notes for admin reference</p>
      </div>

      {/* Create New Note */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <Button onClick={handleCreate} disabled={!newNote.trim()}>
            <StickyNote className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : notes.length === 0 ? (
        <Card className="bg-card/50">
          <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <StickyNote className="w-8 h-8 mb-2 opacity-50" />
            <p>No notes yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap mb-3">{note.note}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(note.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => startEdit(note)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500"
                          onClick={() => deleteMutation.mutate(note.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
