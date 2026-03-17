export const DEMO_ACCOUNTS = [
  { id: "1", name: "Chase Checking", type: "depository", currentBalance: 4250.0, ownerName: "Alex", institutionName: "Chase" },
  { id: "2", name: "Chase Savings", type: "depository", currentBalance: 12800.0, ownerName: "Alex", institutionName: "Chase" },
  { id: "3", name: "BofA Checking", type: "depository", currentBalance: 3120.5, ownerName: "Jordan", institutionName: "Bank of America" },
  { id: "4", name: "BofA Credit Card", type: "credit", currentBalance: -1450.0, ownerName: "Jordan", institutionName: "Bank of America" },
];

export const DEMO_TRANSACTIONS = [
  { id: "t1", name: "Whole Foods", merchantName: "Whole Foods Market", amount: -87.32, category: "FOOD_AND_DRINK", date: "2026-03-16", userId: "alex", userName: "Alex" },
  { id: "t2", name: "Netflix", merchantName: "Netflix", amount: -15.99, category: "ENTERTAINMENT", date: "2026-03-15", userId: "jordan", userName: "Jordan" },
  { id: "t3", name: "Shell Gas", merchantName: "Shell", amount: -52.4, category: "TRANSPORTATION", date: "2026-03-15", userId: "alex", userName: "Alex" },
  { id: "t4", name: "Target", merchantName: "Target", amount: -134.56, category: "GENERAL_MERCHANDISE", date: "2026-03-14", userId: "jordan", userName: "Jordan" },
  { id: "t5", name: "Spotify", merchantName: "Spotify", amount: -9.99, category: "ENTERTAINMENT", date: "2026-03-14", userId: "alex", userName: "Alex" },
  { id: "t6", name: "Chipotle", merchantName: "Chipotle", amount: -24.5, category: "FOOD_AND_DRINK", date: "2026-03-13", userId: "jordan", userName: "Jordan" },
  { id: "t7", name: "Amazon", merchantName: "Amazon", amount: -67.89, category: "GENERAL_MERCHANDISE", date: "2026-03-13", userId: "alex", userName: "Alex" },
  { id: "t8", name: "Uber", merchantName: "Uber", amount: -18.75, category: "TRANSPORTATION", date: "2026-03-12", userId: "jordan", userName: "Jordan" },
  { id: "t9", name: "CVS Pharmacy", merchantName: "CVS", amount: -32.1, category: "MEDICAL", date: "2026-03-12", userId: "alex", userName: "Alex" },
  { id: "t10", name: "Rent Payment", merchantName: null, amount: -2200.0, category: "RENT_AND_UTILITIES", date: "2026-03-01", userId: "alex", userName: "Alex" },
  { id: "t11", name: "Electric Bill", merchantName: "ConEd", amount: -145.0, category: "RENT_AND_UTILITIES", date: "2026-03-03", userId: "jordan", userName: "Jordan" },
  { id: "t12", name: "Gym Membership", merchantName: "Equinox", amount: -95.0, category: "PERSONAL_CARE", date: "2026-03-01", userId: "alex", userName: "Alex" },
];

export const DEMO_SPENDING_BY_CATEGORY = [
  { category: "Rent & Utilities", amount: 2345, percentage: 38, color: "#0066cc" },
  { category: "Food & Drink", amount: 680, percentage: 11, color: "#3486e8" },
  { category: "Transportation", amount: 420, percentage: 7, color: "#7aacf4" },
  { category: "Entertainment", amount: 210, percentage: 3, color: "#aecbfa" },
  { category: "Shopping", amount: 890, percentage: 14, color: "#d2e3fc" },
  { category: "Medical", amount: 150, percentage: 2, color: "#e8f0fe" },
  { category: "Personal Care", amount: 320, percentage: 5, color: "#80868b" },
  { category: "Other", amount: 1185, percentage: 19, color: "#dadce0" },
];

export const DEMO_MONTHLY_SPENDING = [
  { month: "Oct", alex: 2800, jordan: 2100, total: 4900 },
  { month: "Nov", alex: 3100, jordan: 2400, total: 5500 },
  { month: "Dec", alex: 3800, jordan: 3200, total: 7000 },
  { month: "Jan", alex: 2600, jordan: 2300, total: 4900 },
  { month: "Feb", alex: 2900, jordan: 2100, total: 5000 },
  { month: "Mar", alex: 3200, jordan: 2800, total: 6000 },
];

export const DEMO_BUDGET_GOALS = [
  { id: "b1", name: "Groceries", category: "FOOD_AND_DRINK", targetAmount: 800, currentSpent: 560, period: "monthly" },
  { id: "b2", name: "Dining Out", category: "FOOD_AND_DRINK", targetAmount: 400, currentSpent: 380, period: "monthly" },
  { id: "b3", name: "Transportation", category: "TRANSPORTATION", targetAmount: 300, currentSpent: 190, period: "monthly" },
  { id: "b4", name: "Entertainment", category: "ENTERTAINMENT", targetAmount: 200, currentSpent: 85, period: "monthly" },
  { id: "b5", name: "Shopping", category: "GENERAL_MERCHANDISE", targetAmount: 500, currentSpent: 520, period: "monthly" },
];

export const DEMO_DEBTS = [
  { id: "d1", name: "Student Loan (Alex)", totalAmount: 28000, currentBalance: 22400, interestRate: 5.5, minimumPayment: 320, dueDate: 15, assignedTo: "Alex", paidThisMonth: 320 },
  { id: "d2", name: "Car Loan", totalAmount: 18000, currentBalance: 12600, interestRate: 4.2, minimumPayment: 380, dueDate: 1, assignedTo: "Jordan", paidThisMonth: 380 },
  { id: "d3", name: "Credit Card (Jordan)", totalAmount: 5200, currentBalance: 1450, interestRate: 19.9, minimumPayment: 85, dueDate: 22, assignedTo: "Jordan", paidThisMonth: 200 },
  { id: "d4", name: "Medical Bill", totalAmount: 2400, currentBalance: 1800, interestRate: 0, minimumPayment: 100, dueDate: 10, assignedTo: "Alex", paidThisMonth: 0 },
];

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    FOOD_AND_DRINK: "Food & Drink",
    ENTERTAINMENT: "Entertainment",
    TRANSPORTATION: "Transportation",
    GENERAL_MERCHANDISE: "Shopping",
    RENT_AND_UTILITIES: "Rent & Utilities",
    MEDICAL: "Medical",
    PERSONAL_CARE: "Personal Care",
    INCOME: "Income",
    TRANSFER: "Transfer",
  };
  return map[category] || category;
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    FOOD_AND_DRINK: "#0066cc",
    ENTERTAINMENT: "#7aacf4",
    TRANSPORTATION: "#3486e8",
    GENERAL_MERCHANDISE: "#aecbfa",
    RENT_AND_UTILITIES: "#002952",
    MEDICAL: "#d93025",
    PERSONAL_CARE: "#80868b",
  };
  return map[category] || "#dadce0";
}
