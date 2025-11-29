import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Database,
  FileJson,
  Loader2,
} from 'lucide-react';
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

const EXPORTABLE_TABLES = [
  { key: 'plans', label: 'Plans', description: 'Pricing plans and packages' },
  { key: 'addons', label: 'Add-ons', description: 'Extra features and add-ons' },
  { key: 'blog_posts', label: 'Blog Posts', description: 'All blog content' },
  { key: 'testimonials', label: 'Testimonials', description: 'Customer reviews' },
  { key: 'stats', label: 'Stats', description: 'Counter statistics' },
  { key: 'achievements', label: 'Achievements', description: 'Achievement badges' },
  { key: 'social_links', label: 'Social Links', description: 'Social media links' },
  { key: 'site_settings', label: 'Site Settings', description: 'General settings' },
  { key: 'site_content', label: 'Site Content', description: 'Hero, About content' },
  { key: 'dynamic_sections', label: 'Dynamic Sections', description: 'Custom sections' },
  { key: 'coupons', label: 'Coupons', description: 'Discount coupons' },
];

export default function AdminBackup() {
  const [selectedTables, setSelectedTables] = useState<string[]>(EXPORTABLE_TABLES.map(t => t.key));
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const toggleTable = (key: string) => {
    setSelectedTables(prev => 
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  const selectAll = () => setSelectedTables(EXPORTABLE_TABLES.map(t => t.key));
  const selectNone = () => setSelectedTables([]);

  const exportData = async () => {
    if (selectedTables.length === 0) {
      toast.error('Please select at least one table to export');
      return;
    }

    setExporting(true);
    try {
      const exportData: Record<string, unknown[]> = {};

      for (const table of selectedTables) {
        const { data, error } = await supabase.from(table as any).select('*');
        if (error) throw error;
        exportData[table] = data || [];
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Backup exported successfully!');
    } catch (error) {
      toast.error('Export failed: ' + (error as Error).message);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      for (const [table, records] of Object.entries(data)) {
        if (!EXPORTABLE_TABLES.find(t => t.key === table)) continue;
        if (!Array.isArray(records) || records.length === 0) continue;

        // Clear existing data and insert new
        await supabase.from(table as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        // Insert in batches of 100
        for (let i = 0; i < records.length; i += 100) {
          const batch = records.slice(i, i + 100);
          await supabase.from(table as any).insert(batch as any);
        }
      }

      toast.success('Data imported successfully!');
    } catch (error) {
      toast.error('Import failed: ' + (error as Error).message);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Backup & Restore</h1>
        <p className="text-muted-foreground">Export and import your portfolio data</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-500" />
              Export Data
            </CardTitle>
            <CardDescription>Download your data as JSON file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
              <Button variant="outline" size="sm" onClick={selectNone}>Select None</Button>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {EXPORTABLE_TABLES.map((table) => (
                <div 
                  key={table.key}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedTables.includes(table.key)}
                    onCheckedChange={() => toggleTable(table.key)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{table.label}</p>
                    <p className="text-xs text-muted-foreground">{table.description}</p>
                  </div>
                  <Database className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>

            <Button 
              className="w-full" 
              onClick={exportData}
              disabled={exporting || selectedTables.length === 0}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileJson className="w-4 h-4 mr-2" />
              )}
              Export Selected ({selectedTables.length})
            </Button>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Import Data
            </CardTitle>
            <CardDescription>Restore data from a backup file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileJson className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload a JSON backup file to restore your data
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={importing}>
                    {importing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Choose File
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Warning
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Importing data will replace existing records. This action cannot be undone.
                      Make sure you have a backup of your current data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <label className="cursor-pointer">
                        I understand, proceed
                        <input
                          type="file"
                          className="hidden"
                          accept=".json"
                          onChange={handleImport}
                        />
                      </label>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-500">Important</p>
                  <p className="text-muted-foreground">
                    Always create a backup before importing. Imported data will replace existing records.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Backup Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Create regular backups before making major changes
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Store backups in multiple locations (local + cloud)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Test your backups periodically to ensure they work
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Note: Media files (images) are not included in backups
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
