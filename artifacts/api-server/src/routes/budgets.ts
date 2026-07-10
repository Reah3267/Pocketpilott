import { Router, type IRouter } from "express";
import { eq, sum, and, gte } from "drizzle-orm";
import { db, budgetsTable, transactionsTable } from "@workspace/db";
import {
  CreateBudgetBody,
  UpdateBudgetParams,
  UpdateBudgetBody,
  DeleteBudgetParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Compute used amount per budget category from expense transactions this month
async function getUsedForCategory(category: string): Promise<number> {
  const now = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [result] = await db
    .select({ total: sum(transactionsTable.amount) })
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.category, category),
        eq(transactionsTable.isIncome, false),
        gte(transactionsTable.date, firstOfMonth)
      )
    );

  return result?.total ? parseFloat(result.total) : 0;
}

router.get("/budgets", async (_req, res): Promise<void> => {
  const rows = await db.select().from(budgetsTable);

  const budgets = await Promise.all(
    rows.map(async (row) => ({
      ...row,
      total: parseFloat(row.total),
      used: await getUsedForCategory(row.category),
    }))
  );

  res.json(budgets);
});

router.post("/budgets", async (req, res): Promise<void> => {
  const parsed = CreateBudgetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(budgetsTable)
    .values({
      title: parsed.data.title,
      category: parsed.data.category,
      total: String(parsed.data.total),
    })
    .returning();

  const used = await getUsedForCategory(row.category);

  res.status(201).json({ ...row, total: parseFloat(row.total), used });
});

router.patch("/budgets/:id", async (req, res): Promise<void> => {
  const params = UpdateBudgetParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBudgetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
  if (parsed.data.total !== undefined) updateData.total = String(parsed.data.total);

  const [row] = await db
    .update(budgetsTable)
    .set(updateData)
    .where(eq(budgetsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Budget not found" });
    return;
  }

  const used = await getUsedForCategory(row.category);
  res.json({ ...row, total: parseFloat(row.total), used });
});

router.delete("/budgets/:id", async (req, res): Promise<void> => {
  const params = DeleteBudgetParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(budgetsTable)
    .where(eq(budgetsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Budget not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
