export interface Expense {
  expenseId: string;
  name: string;
  amount: number;
  dueDay: number;
  dueDate: string;
  category: string;
  status: "paid" | "unpaid" | "due";
}

export interface SortConfig {
  key: keyof Expense;
  direction: "asc" | "desc";
}

export interface ChartDataItem {
  browser: string;
  visitors: number;
  fill: string;
}

export interface CategoryTotal {
  [key: string]: number;
}

export interface MonthItem {
  label: string;
  full: string;
  value: string;
}

export interface CreateExpenseCallback {
  year: string;
  month: string;
}
