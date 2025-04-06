
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';

const categoryColors = {
  Food: '#10B981', // green
  Shopping: '#3B82F6', // blue
  Transport: '#6366F1', // indigo
  Utilities: '#8B5CF6', // violet
  Entertainment: '#EC4899', // pink
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Visualize = () => {
  const { transactions } = useAppContext();
  const [periodFilter, setPeriodFilter] = useState('all');

  if (!transactions.length) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visualize Your Spending</h1>
          <p className="mt-1 text-gray-500">See where your money is going</p>
        </div>

        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
              <LineChart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Transaction Data</h3>
            <p className="text-gray-500 mb-6">
              Please upload your transaction data in the Upload Data section to visualize your spending patterns.
            </p>
            <Button asChild>
              <Link to="/upload" className="bg-finance-primary hover:bg-finance-primary/90">
                Go to Upload Data
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Filter transactions based on selected period
  const filteredTransactions = (() => {
    if (periodFilter === 'all') return transactions;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (periodFilter === 'last30') {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (periodFilter === 'last90') {
      cutoffDate.setDate(now.getDate() - 90);
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  })();

  // Prepare data for charts
  const categoryTotals = filteredTransactions.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const barChartData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({ category, amount }));

  // Group transactions by date for time series
  const dateGrouped = filteredTransactions.reduce((acc, { date, amount }) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    acc[formattedDate] = (acc[formattedDate] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const timeSeriesData = Object.entries(dateGrouped)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, amount]) => ({ date, amount }));

  // Daily spending over time (line chart)
  const lineChartData = timeSeriesData.map(({ date, amount }) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visualize Your Spending</h1>
          <p className="mt-1 text-gray-500">See where your money is going</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="last90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
              <CardDescription>Total: ₹{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={categoryColors[entry.name as keyof typeof categoryColors] || "#82ca9d"} 
                        />
                      ))}
                    </Pie>
                    <Legend formatter={(value) => `${value}`} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Where most of your money goes</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={barChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" />
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                      <Bar dataKey="amount" fill="#0C9488" radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Spending Trend</CardTitle>
                <CardDescription>Your spending over time</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={lineChartData.slice(-10)} // Show last 10 days for clarity
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#0C9488" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Detailed view of each spending category</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={150}
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
                </div>

                <div className="space-y-6">
                  {barChartData.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{item.category}</h3>
                        <span className="font-bold">₹{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(item.amount / Math.max(...barChartData.map(d => d.amount))) * 100}%`,
                            backgroundColor: categoryColors[item.category as keyof typeof categoryColors] || "#82ca9d" 
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {(item.amount / filteredTransactions.reduce((sum, t) => sum + t.amount, 0) * 100).toFixed(1)}% of total spending
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending Over Time</CardTitle>
              <CardDescription>Track how your spending has changed</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#0C9488" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Timeline</CardTitle>
              <CardDescription>Your most recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((transaction, index) => (
                    <div 
                      key={index} 
                      className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${categoryColors[transaction.category as keyof typeof categoryColors]}20`, 
                              color: categoryColors[transaction.category as keyof typeof categoryColors] 
                            }}
                          >
                            {transaction.category}
                          </div>
                          <div className="font-bold text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Fix missing imports
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LineChart } from 'lucide-react';

export default Visualize;
