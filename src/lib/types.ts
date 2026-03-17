export interface SessionUser {
  id: string;
  email: string;
  name: string;
  coupleId?: string;
}

export interface CouplePartner {
  id: string;
  name: string;
  email: string;
}

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlySpending {
  month: string;
  user1: number;
  user2: number;
  total: number;
}
