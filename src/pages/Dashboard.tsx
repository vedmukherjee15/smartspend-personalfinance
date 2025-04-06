
import React from 'react';
import { BarChart3, ArrowDown, ArrowUp, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const categoryColors = {
  Food: '#10B981', // green
  Shopping: '#3B82F6', // blue
  Transport: '#6366F1', // indigo
  Utilities: '#8B5CF6', // violet
  Entertainment: '#EC4899', // pink
};

const Dashboard = () => {
  const { transactions, targets } = useAppContext();
  
  // Get username from localStorage
  const username = localStorage.getItem('user') || 'User';

  // Calculate total spending and category-wise spending
  const totalSpending = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for charts
  const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    target: targets[category] || 1000,
    percentage: targets[category] ? Math.min(100, (amount / targets[category]) * 100) : 0
  }));

  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate monthly change (mock data for now)
  const monthlyChange = 12.5;
  const isIncrease = monthlyChange > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {username}</h1>
          <p className="mt-1 text-gray-500">Here's what's happening with your finances</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="flex items-center text-sm font-medium text-finance-primary hover:text-finance-primary/80 transition-colors">
            <RefreshCcw className="mr-1 h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpending.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs">
              {isIncrease ? (
                <ArrowUp className="mr-1 h-3 w-3 text-red-500" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-green-500" />
              )}
              <span className={isIncrease ? "text-red-500" : "text-green-500"}>
                {Math.abs(monthlyChange)}% {isIncrease ? "increase" : "decrease"}
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Expense Category</CardTitle>
            <div className="rounded-full p-1 bg-amber-100">
              <BarChart3 className="h-3 w-3 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {categoryData.sort((a, b) => b.amount - a.amount)[0]?.category}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ₹{categoryData.sort((a, b) => b.amount - a.amount)[0]?.amount.toLocaleString()}
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <div className="rounded-full p-1 bg-blue-100">
              <BarChart3 className="h-3 w-3 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {categoryData.some(category => category.percentage >= 100)
                    ? "Over Budget"
                    : "On Track"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {categoryData.filter(category => category.percentage >= 100).length} categories over budget
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spending by category chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Your spending habits broken down</CardDescription>
          </CardHeader>
          <CardContent className="px-1">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" name="Spent" fill="#0C9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No transaction data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Track how close you are to your limits</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">
                        ₹{item.amount.toLocaleString()} / ₹{item.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className={`h-2 ${item.percentage >= 100 ? 'bg-red-200' : 'bg-gray-200'}`}
                    />
                    <div className="text-xs text-gray-500 flex justify-end">
                      {item.percentage >= 100 ? (
                        <span className="text-red-500">
                          {Math.round(item.percentage)}% (Over budget)
                        </span>
                      ) : (
                        <span>
                          {Math.round(item.percentage)}% of budget
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No budget data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom section - breakdown visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Distribution</CardTitle>
          <CardDescription>Visual breakdown of your spending</CardDescription>
        </CardHeader>
        <CardContent className="px-1">
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={categoryColors[entry.name as keyof typeof categoryColors] || "#82ca9d"} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No transaction data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
