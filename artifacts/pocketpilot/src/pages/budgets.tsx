import { useListBudgets, useDeleteBudget, getListBudgetsQueryKey } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BudgetForm } from "@/components/budget-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Budgets() {
  const { data: budgets, isLoading } = useListBudgets();
  const deleteBudget = useDeleteBudget();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      deleteBudget.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBudgetsQueryKey() });
        }
      });
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground mt-1">Track your spending limits by category.</p>
        </div>
        <BudgetForm />
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : budgets?.length ? (
            budgets.map((budget) => {
              const percent = Math.min((budget.used / budget.total) * 100, 100);
              const isOver = budget.used > budget.total;
              const isNearLimit = percent > 85 && !isOver;
              
              return (
                <motion.div
                  key={budget.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="relative group overflow-hidden h-full">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => handleDelete(budget.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                          <Target className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base">{budget.title}</CardTitle>
                      </div>
                      <CardDescription>{budget.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <span className="text-2xl font-bold font-mono tracking-tighter">
                              {formatCurrency(budget.used)}
                            </span>
                            <span className="text-xs text-muted-foreground block">
                              of {formatCurrency(budget.total)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-medium ${isOver ? 'text-destructive' : isNearLimit ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <Progress 
                          value={percent} 
                          className="h-2"
                          indicatorClassName={isOver ? "bg-destructive" : isNearLimit ? "bg-amber-500" : "bg-primary"}
                        />
                        
                        {isOver && (
                          <div className="flex items-center gap-1.5 text-xs text-destructive font-medium pt-1">
                            <AlertTriangle className="h-3 w-3" />
                            Exceeded by {formatCurrency(budget.used - budget.total)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-card/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No budgets set</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
                Create budgets to keep your spending on track across different categories.
              </p>
              <BudgetForm />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
