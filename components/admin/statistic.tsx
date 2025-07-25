// components/admin/statistic.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatisticProps {
  title: string;
  value: string | number;
  description?: string; // Make description optional
  icon?: React.ReactNode; // Make icon optional and accept any React node
}

// 1. Accept icon and description as props
export function Statistic({ title, value, description, icon }: StatisticProps) {
  return (
    <Card className='bg-white dark:bg-gray-900 shadow-xl'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* 2. Render the icon if provided */}
        {icon && <div>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* 3. Render the description if provided */}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}