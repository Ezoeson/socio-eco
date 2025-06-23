import dynamic from 'next/dynamic';

// ==================== SELECT ====================
export const Select = dynamic(
  () => import('@/components/ui/select').then((mod) => mod.Select),
  { ssr: false }
);
export const SelectContent = dynamic(
  () => import('@/components/ui/select').then((mod) => mod.SelectContent),
  { ssr: false }
);
export const SelectItem = dynamic(
  () => import('@/components/ui/select').then((mod) => mod.SelectItem),
  { ssr: false }
);
export const SelectTrigger = dynamic(
  () => import('@/components/ui/select').then((mod) => mod.SelectTrigger),
  { ssr: false }
);
export const SelectValue = dynamic(
  () => import('@/components/ui/select').then((mod) => mod.SelectValue),
  { ssr: false }
);

// ==================== TABLE ====================
export const Table = dynamic(
  () => import('@/components/ui/table').then((mod) => mod.Table),
  { ssr: false }
);
export const TableHeader = dynamic(
  () => import('@/components/ui/table').then((mod) => mod.TableHeader),
  { ssr: false }
);
export const TableBody = dynamic(
  () => import('@/components/ui/table').then((mod) => mod.TableBody),
  { ssr: false }
);
export const TableRow = dynamic(
  () => import('@/components/ui/table').then((mod) => mod.TableRow),
  { ssr: false }
);
export const TableHead = dynamic(
  () => import('@/components/ui/table').then((mod) => mod.TableHead),
  { ssr: false }
);
export const TableCell = dynamic(
  () => import('@/components/ui/table').then((mod) => mod.TableCell),
  { ssr: false }
);

// ==================== DIALOG ====================
export const Dialog = dynamic(
  () => import('@/components/ui/dialog').then((mod) => mod.Dialog),
  { ssr: false }
);
export const DialogContent = dynamic(
  () => import('@/components/ui/dialog').then((mod) => mod.DialogContent),
  { ssr: false }
);
export const DialogHeader = dynamic(
  () => import('@/components/ui/dialog').then((mod) => mod.DialogHeader),
  { ssr: false }
);
export const DialogTitle = dynamic(
  () => import('@/components/ui/dialog').then((mod) => mod.DialogTitle),
  { ssr: false }
);
export const DialogTrigger = dynamic(
  () => import('@/components/ui/dialog').then((mod) => mod.DialogTrigger),
  { ssr: false }
);
// ==================== TABS ====================
export const Tabs = dynamic(
  () => import('@/components/ui/tabs').then((mod) => mod.Tabs),
  { ssr: false }
);
export const TabsList = dynamic(
  () => import('@/components/ui/tabs').then((mod) => mod.TabsList),
  { ssr: false }
);
export const TabsTrigger = dynamic(
  () => import('@/components/ui/tabs').then((mod) => mod.TabsTrigger),
  { ssr: false }
);
export const TabsContent = dynamic(
  () => import('@/components/ui/tabs').then((mod) => mod.TabsContent),
  { ssr: false }
);
// ==================== BUTTON ====================
export const Button = dynamic(
  () => import('@/components/ui/button').then((mod) => mod.Button),
  { ssr: false }
);
// ==================== CHECKBOX ====================
export const Checkbox = dynamic(
  () => import('@/components/ui/checkbox').then((mod) => mod.Checkbox),
  { ssr: false }
);
