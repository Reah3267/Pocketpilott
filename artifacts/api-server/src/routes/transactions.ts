import { Router, type IRouter } from "express";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db, transactionsTable } from "@workspace/db";
import {
  ListTransactionsQueryParams,
  CreateTransactionBody,
  GetTransactionParams,
  UpdateTransactionParams,
  UpdateTransactionBody,
  DeleteTransactionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/transactions", async (req, res): Promise<void> => {
  const query = ListTransactionsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, isIncome, paymentMethod, from, to } = query.data;

  const conditions = [];
  if (category != null) conditions.push(eq(transactionsTable.category, category));
  if (isIncome != null) conditions.push(eq(transactionsTable.isIncome, isIncome));
  if (paymentMethod != null) conditions.push(eq(transactionsTable.paymentMethod, paymentMethod));
  if (from != null) conditions.push(gte(transactionsTable.date, from));
  if (to != null) conditions.push(lte(transactionsTable.date, to));

  const rows = await db
    .select()
    .from(transactionsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(transactionsTable.date), desc(transactionsTable.createdAt));

  res.json(rows.map((r) => ({
    ...r,
    amount: parseFloat(r.amount),
  })));
});

router.post("/transactions", async (req, res): Promise<void> => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(transactionsTable)
    .values({
      title: parsed.data.title,
      amount: String(parsed.data.amount),
      isIncome: parsed.data.isIncome,
      category: parsed.data.category,
      note: parsed.data.note ?? "",
      date: parsed.data.date,
      paymentMethod: parsed.data.paymentMethod,
    })
    .returning();

  res.status(201).json({ ...row, amount: parseFloat(row.amount) });
});

router.get("/transactions/:id", async (req, res): Promise<void> => {
  const params = GetTransactionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  res.json({ ...row, amount: parseFloat(row.amount) });
});

router.patch("/transactions/:id", async (req, res): Promise<void> => {
  const params = UpdateTransactionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.amount !== undefined) updateData.amount = String(parsed.data.amount);
  if (parsed.data.isIncome !== undefined) updateData.isIncome = parsed.data.isIncome;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
  if (parsed.data.note !== undefined) updateData.note = parsed.data.note;
  if (parsed.data.date !== undefined) updateData.date = parsed.data.date;
  if (parsed.data.paymentMethod !== undefined) updateData.paymentMethod = parsed.data.paymentMethod;

  const [row] = await db
    .update(transactionsTable)
    .set(updateData)
    .where(eq(transactionsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  res.json({ ...row, amount: parseFloat(row.amount) });
});

router.delete("/transactions/:id", async (req, res): Promise<void> => {
  const params = DeleteTransactionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(transactionsTable)
    .where(eq(transactionsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
