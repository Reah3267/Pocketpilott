import { useGetByCategory, useGetMonthlySummary } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--chart-5))',
  'hsl(var(--primary))'
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Reports() {
  const { data: categoryData, isLoading: loadingCat } = useGetByCategory();
  const { data: monthlyData, isLoading: loadingMonth } = useGetMonthlySummary();

  const handleExport = () => {
    alert("Exporting report as PDF...");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-md text-sm">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground capitalize">{entry.name}:</span>
              <span className="font-mono font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-md text-sm">
          <p className="font-semibold mb-1">{payload[0].name}</p>
          <p className="font-mono font-medium">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Visualize your financial habits over time.</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Income vs expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMonth ? (
              <Skeleton className="h-[350px] w-full" />
            ) : monthlyData?.length ? (
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(val) => `$${val/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.4)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                    <Bar dataKey="income" name="Income" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                Not enough data for chart
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money went</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCat ? (
              <Skeleton className="h-[300px] w-full" />
            ) : categoryData?.length ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="category"
                      stroke="none"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No spending data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Largest expense areas</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCat ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : categoryData?.length ? (
              <div className="space-y-5 mt-2">
                {categoryData.sort((a, b) => b.amount - a.amount).slice(0, 5).map((item, index) => {
                  const max = Math.max(...categoryData.map(d => d.amount));
                  const percent = (item.amount / max) * 100;
                  
                  return (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          {item.category}
                        </span>
                        <span className="font-mono">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
