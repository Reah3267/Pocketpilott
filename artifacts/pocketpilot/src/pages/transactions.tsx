import { useListTransactions } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionForm } from "@/components/transaction-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
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

export default function Transactions() {
  const { formatCurrency } = useCurrency();
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  
  const { data: transactions, isLoading } = useListTransactions();

  const filteredTransactions = transactions?.filter(tx => {
    if (filterType === "income" && !tx.isIncome) return false;
    if (filterType === "expense" && tx.isIncome) return false;
    
    if (search && !tx.title.toLowerCase().includes(search.toLowerCase()) && !tx.category.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Review and manage your financial activity.</p>
        </div>
        <TransactionForm />
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-4 bg-card p-2 rounded-lg border shadow-sm">
        <div className="flex-1">
          <Input 
            placeholder="Search transactions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0" 
          />
        </div>
        <div className="w-[1px] h-6 bg-border"></div>
        <div className="w-[140px]">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-0">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income only</SelectItem>
              <SelectItem value="expense">Expenses only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div variants={item} className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Transaction</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-[80px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredTransactions?.length ? (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">
                    <div>
                      {tx.title}
                      {tx.note && <div className="text-xs text-muted-foreground font-normal mt-0.5">{tx.note}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{formatDate(tx.date)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs">{tx.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{tx.paymentMethod}</TableCell>
                  <TableCell className={`text-right font-mono font-medium ${tx.isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                    {tx.isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
