
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryTotal } from '@/models/types';

const Recommendations = () => {
  const { transactions, targets } = useAppContext();
  const [period, setPeriod] = useState('all');

  // Filter transactions by period
  const filteredTransactions = (() => {
    if (period === 'all') return transactions;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (period === 'last30') {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (period === 'last90') {
      cutoffDate.setDate(now.getDate() - 90);
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  })();

  // Calculate total spending by category
  const categorySummary = filteredTransactions.reduce((acc, { category, amount }) => {
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by amount
  const categorySummaryArray: CategoryTotal[] = Object.entries(categorySummary)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
  
  // Find top expense category
  const topCategory = categorySummaryArray.length > 0 ? categorySummaryArray[0].category : null;
  const topAmount = categorySummaryArray.length > 0 ? categorySummaryArray[0].amount : 0;

  // Check which categories exceed their targets
  const categoriesExceedingTarget = Object.entries(categorySummary)
    .filter(([category, amount]) => {
      const target = targets[category as keyof typeof targets] || 0;
      return amount > target;
    })
    .map(([category, amount]) => ({
      category,
      amount,
      target: targets[category as keyof typeof targets] || 0,
      excess: amount - (targets[category as keyof typeof targets] || 0)
    }))
    .sort((a, b) => b.excess - a.excess);

  // Generate recommendations based on spending patterns
  const getRecommendation = (category: string, amount: number) => {
    const recommendations = {
      'Food': "You're spending quite a bit on food. Consider cooking at home more often to save money.",
      'Shopping': "Your shopping expenses are high. Try reviewing and cutting down on non-essential purchases.",
      'Transport': "Consider alternatives like public transport or carpooling to reduce costs.",
      'Utilities': "Review your energy usage; there might be ways to lower your bills.",
      'Entertainment': "Assess your subscriptions and entertainment expenses to see if any can be reduced."
    };

    return recommendations[category as keyof typeof recommendations] || "You're managing your expenses well. Keep it up!";
  };
  
  // Additional tips based on overall spending patterns
  const generateAdditionalTips = () => {
    const tips = [];
    
    // Check for categories exceeding targets
    if (categoriesExceedingTarget.length > 0) {
      tips.push(`You've exceeded your budget in ${categoriesExceedingTarget.length} categories.`);
    }
    
    // Check total spending vs. total budget
    const totalSpent = Object.values(categorySummary).reduce((sum, amount) => sum + amount, 0);
    const totalBudget = Object.values(targets).reduce((sum, amount) => sum + amount, 0);
    
    if (totalSpent > totalBudget) {
      tips.push(`Overall, you've spent ₹${(totalSpent - totalBudget).toLocaleString()} more than your total budget.`);
    } else {
      tips.push(`Great job! You're under your total budget by ₹${(totalBudget - totalSpent).toLocaleString()}.`);
    }
    
    // Check if there's a very dominant category
    if (topAmount > 0) {
      const topCategoryPercentage = (topAmount / totalSpent) * 100;
      if (topCategoryPercentage > 50) {
        tips.push(`${topCategory} makes up ${topCategoryPercentage.toFixed(1)}% of your spending. Consider if this aligns with your financial goals.`);
      }
    }
    
    return tips;
  };

  if (!transactions.length) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h1>
          <p className="mt-1 text-gray-500">Get actionable insights to improve your financial habits</p>
        </div>

        <Card className="text-center">
          <CardContent className="pt-10 pb-10">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-6 mb-6">
                <LightbulbIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Transaction Data</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Please upload your transaction data in the Upload Data section to receive personalized spending recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h1>
          <p className="mt-1 text-gray-500">Get actionable insights to improve your financial habits</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Select value={period} onValueChange={setPeriod}>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Spending Insight</CardTitle>
            <CardDescription>
              {topCategory ? `Your highest expense category is ${topCategory} (₹${topAmount.toLocaleString()})` : 'No expense data available'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-finance-primary/10 rounded-lg border border-finance-primary/20">
              <div className="flex items-start">
                <div className="mr-4">
                  <LightbulbIcon className="h-8 w-8 text-finance-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Primary Recommendation</h3>
                  <p className="text-gray-700">
                    {topCategory ? getRecommendation(topCategory, topAmount) : "Upload more transaction data to get personalized recommendations."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Analysis</CardTitle>
            <CardDescription>Categories exceeding your targets</CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesExceedingTarget.length > 0 ? (
              <div className="space-y-4">
                {categoriesExceedingTarget.map((item, idx) => (
                  <div key={idx} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{item.category}</h4>
                      <span className="text-red-500 font-medium">+₹{item.excess.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                      <div 
                        className="h-2 rounded-full bg-red-500" 
                        style={{ width: `${Math.min(100, (item.amount / item.target) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700">
                      You've spent ₹{item.amount.toLocaleString()} out of your ₹{item.target.toLocaleString()} target.
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">On Budget</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Great job! You're within budget for all your spending categories.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Insights</CardTitle>
            <CardDescription>Tips to improve your financial health</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {generateAdditionalTips().map((tip, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <TrendingUpIcon className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
              <li className="flex items-start mt-4 pt-3 border-t border-gray-100">
                <div className="mr-3 mt-0.5">
                  <InfoIcon className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-gray-700">
                  Our AI analyzes your spending patterns to provide these recommendations. 
                  The more data you provide, the more accurate our insights will be.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categorySummaryArray.map((item, idx) => {
              const target = targets[item.category as keyof typeof targets] || 0;
              const overBudget = item.amount > target;
              const progress = target > 0 ? Math.min((item.amount / target) * 100, 100) : 0;
              
              return (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">{item.category}</h4>
                    <span className={overBudget ? "text-red-500 font-medium" : "text-gray-900 font-medium"}>
                      ₹{item.amount.toLocaleString()} / ₹{target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${overBudget ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {overBudget 
                      ? `₹${(item.amount - target).toLocaleString()} over budget` 
                      : `₹${(target - item.amount).toLocaleString()} remaining`}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { CheckCircle, Info, Lightbulb, TrendingUp } from 'lucide-react';
import { CheckCircleIcon, InfoIcon, LightbulbIcon, TrendingUpIcon } from 'lucide-react';

export default Recommendations;
