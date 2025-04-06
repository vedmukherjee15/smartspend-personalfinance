
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface SpendingTarget {
  category: string;
  amount: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

export type CategoryType = 'Food' | 'Shopping' | 'Transport' | 'Utilities' | 'Entertainment';

export interface UserSettings {
  targets: {
    [key in CategoryType]: number;
  };
}
