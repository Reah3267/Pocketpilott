import { useGetSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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

export default function Dashboard() {
  const { data: summary, isLoading } = useGetSummary();

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here is your financial overview.</p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-[120px] bg-primary-foreground/20" />
            ) : (
              <div className="text-4xl font-bold font-mono tracking-tighter">
                {formatCurrency(summary?.balance || 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[120px]" />
            ) : (
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(summary?.totalIncome || 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[120px]" />
            ) : (
              <div className="text-2xl font-bold font-mono text-destructive">
                {formatCurrency(summary?.totalExpenses || 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : summary?.recentTransactions?.length ? (
              <div className="space-y-6">
                {summary.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tx.isIncome ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-none group-hover:text-primary transition-colors">{tx.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{tx.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className={`font-mono text-sm font-medium ${tx.isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                      {tx.isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No recent transactions</p>
                <p className="text-xs text-muted-foreground/70 mt-1">When you spend or receive money, it will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
