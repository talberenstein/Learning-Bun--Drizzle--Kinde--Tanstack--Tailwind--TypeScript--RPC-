import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  name: z.string(),
  amount: z.number(),
});

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
  { id: 1, name: "Rent", amount: 1000 },
  { id: 2, name: "Groceries", amount: 100 },
  { id: 3, name: "Gas", amount: 50 },
];

const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", expenseSchema), async (c) => {
    c.status(201);
    const data = await c.req.valid("json");
    const expense = expenseSchema.parse(data);
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    // const expense = await c.req.json();
    console.log({ expense });
    return c.json({ message: "Expense created!" });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    fakeExpenses.splice(index, 1);
    return c.json({ message: "Expense deleted!" });
  })
  .put("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeExpenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return c.notFound();
    }
    const expense = fakeExpenses[index];
    const updatedExpense = { ...expense, ...c.req.json() };
    fakeExpenses[index] = updatedExpense;
    return c.json({ message: "Expense updated!" });
  })

  //delete
  .delete("/", (c) => {
    return c.json({ message: "Expense deleted!" });
  });

export { expensesRoute };
