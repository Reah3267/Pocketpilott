import { Router, type IRouter } from "express";
import { eq, sql, sum, count, desc } from "drizzle-orm";
import { db, transactionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/summary", async (_req, res): Promise<void> => {
  // income total
  const [incomeRow] = await db
    .select({ total: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .where(eq(transactionsTable.isIncome, true));

  // expense total
  const [expenseRow] = await db
    .select({ total: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .where(eq(transactionsTable.isIncome, false));

  const totalIncome = incomeRow?.total ? parseFloat(incomeRow.total) : 0;
  const totalExpenses = expenseRow?.total ? parseFloat(expenseRow.total) : 0;

  // recent transactions (last 10)
  const recent = await db
    .select()
    .from(transactionsTable)
    .orderBy(desc(transactionsTable.date), desc(transactionsTable.createdAt))
    .limit(10);

  res.json({
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    recentTransactions: recent.map((r) => ({ ...r, amount: parseFloat(r.amount) })),
  });
});

router.get("/summary/by-category", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      category: transactionsTable.category,
      amount: sum(transactionsTable.amount),
      count: count(),
    })
    .from(transactionsTable)
    .where(eq(transactionsTable.isIncome, false))
    .groupBy(transactionsTable.category);

  res.json(
    rows.map((r) => ({
      category: r.category,
      amount: r.amount ? parseFloat(r.amount) : 0,
      count: r.count,
    }))
  );
});

router.get("/summary/monthly", async (_req, res): Promise<void> => {
  // Last 6 months
  const rows = await db
    .select({
      month: sql<string>`to_char(${transactionsTable.date}::date, 'YYYY-MM')`,
      isIncome: transactionsTable.isIncome,
      total: sum(transactionsTable.amount),
    })
    .from(transactionsTable)
    .where(
      sql`${transactionsTable.date}::date >= (CURRENT_DATE - INTERVAL '6 months')`
    )
    .groupBy(
      sql`to_char(${transactionsTable.date}::date, 'YYYY-MM')`,
      transactionsTable.isIncome
    )
    .orderBy(sql`to_char(${transactionsTable.date}::date, 'YYYY-MM')`);

  // Pivot into MonthStat shape
  const map = new Map<string, { income: number; expenses: number }>();
  for (const row of rows) {
    if (!map.has(row.month)) map.set(row.month, { income: 0, expenses: 0 });
    const entry = map.get(row.month)!;
    const amt = row.total ? parseFloat(row.total) : 0;
    if (row.isIncome) entry.income += amt;
    else entry.expenses += amt;
  }

  const result = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, stats]) => ({ month, ...stats }));

  res.json(result);
});

export default router;
