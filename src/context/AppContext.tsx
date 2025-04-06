
import { createContext, useState, useContext, ReactNode } from 'react';
import { Transaction, SpendingTarget, CategoryType } from '../models/types';
import { toast } from "sonner";

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  targets: Record<string, number>;
  setTargets: (targets: Record<string, number>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  categorizeTransaction: (description: string) => string;
  logout: () => void;
}

const defaultTargets = {
  'Food': 1000,
  'Shopping': 1500,
  'Transport': 800,
  'Utilities': 1200,
  'Entertainment': 500
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('authenticated') === 'true';
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [targets, setTargets] = useState<Record<string, number>>(defaultTargets);

  // Simple ML model simulation for categorizing transactions
  const categorizeTransaction = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('uber') || lowerDesc.includes('lyft') || lowerDesc.includes('train') || lowerDesc.includes('bus')) {
      return 'Transport';
    } else if (lowerDesc.includes('restaurant') || lowerDesc.includes('food') || lowerDesc.includes('grocery') || 
               lowerDesc.includes('zomato') || lowerDesc.includes('swiggy')) {
      return 'Food';
    } else if (lowerDesc.includes('amazon') || lowerDesc.includes('flipkart') || lowerDesc.includes('shop')) {
      return 'Shopping';
    } else if (lowerDesc.includes('netflix') || lowerDesc.includes('hotstar') || lowerDesc.includes('movie') || 
               lowerDesc.includes('subscription')) {
      return 'Entertainment';
    } else if (lowerDesc.includes('bill') || lowerDesc.includes('electricity') || lowerDesc.includes('water') || 
               lowerDesc.includes('internet') || lowerDesc.includes('rent')) {
      return 'Utilities';
    }
    
    return 'Shopping'; // Default category
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      category: transaction.category || categorizeTransaction(transaction.description)
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success("Transaction added successfully");
  };

  const logout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    transactions,
    setTransactions,
    targets,
    setTargets,
    addTransaction,
    categorizeTransaction,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};
