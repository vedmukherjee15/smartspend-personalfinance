
import React, { useState, useRef } from 'react';
import { Upload, FileType, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';

const UploadData = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTransactions, categorizeTransaction } = useAppContext();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processCSV = (text: string) => {
    try {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');
      
      // Check for required columns
      const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
      const descIndex = headers.findIndex(h => h.toLowerCase().includes('desc'));
      const amountIndex = headers.findIndex(h => h.toLowerCase().includes('amount'));
      
      if (dateIndex === -1 || descIndex === -1 || amountIndex === -1) {
        throw new Error("CSV file must contain Date, Description, and Amount columns");
      }
      
      const transactions = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        return {
          id: `csv-${index}`,
          date: values[dateIndex].trim(),
          description: values[descIndex].trim(),
          amount: parseFloat(values[amountIndex].trim()),
          category: categorizeTransaction(values[descIndex].trim())
        };
      }).filter(t => !isNaN(t.amount));
      
      setTransactions(transactions);
      setFileUploaded(true);
      setUploadError(null);
      toast.success(`Successfully processed ${transactions.length} transactions`);
    } catch (error) {
      setUploadError((error as Error).message);
      toast.error("Error processing file");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSV(text);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setUploadError("Error reading file");
      setIsUploading(false);
      toast.error("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleDemoDataLoad = () => {
    setIsUploading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const demoTransactions = [
        { id: "1", date: "2023-03-01", description: "Uber to work", amount: 250, category: "Transport" },
        { id: "2", date: "2023-03-02", description: "Zomato dinner", amount: 450, category: "Food" },
        { id: "3", date: "2023-03-03", description: "Amazon purchase", amount: 1200, category: "Shopping" },
        { id: "4", date: "2023-03-05", description: "Electricity bill", amount: 800, category: "Utilities" },
        { id: "5", date: "2023-03-07", description: "Netflix subscription", amount: 199, category: "Entertainment" },
        { id: "6", date: "2023-03-10", description: "Grocery shopping", amount: 1500, category: "Food" },
        { id: "7", date: "2023-03-12", description: "Metro card recharge", amount: 500, category: "Transport" },
        { id: "8", date: "2023-03-15", description: "Mobile phone bill", amount: 699, category: "Utilities" },
        { id: "9", date: "2023-03-18", description: "Movie tickets", amount: 600, category: "Entertainment" },
        { id: "10", date: "2023-03-20", description: "Online shopping", amount: 2100, category: "Shopping" },
        { id: "11", date: "2023-03-23", description: "Restaurant dinner", amount: 1200, category: "Food" },
        { id: "12", date: "2023-03-25", description: "Cab fare", amount: 350, category: "Transport" },
        { id: "13", date: "2023-03-28", description: "Water bill", amount: 400, category: "Utilities" },
        { id: "14", date: "2023-03-30", description: "Clothing purchase", amount: 1800, category: "Shopping" },
      ];
      
      setTransactions(demoTransactions);
      setFileUploaded(true);
      setUploadError(null);
      setIsUploading(false);
      toast.success("Demo data loaded successfully");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
        <p className="mt-1 text-gray-500">Import your transaction data to get insights</p>
      </div>

      <Tabs defaultValue="file">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="demo">Demo Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="mt-6">
          <Card className="border-dashed border-2 hover:border-finance-primary transition-colors">
            <CardHeader>
              <CardTitle>Upload Transactions File</CardTitle>
              <CardDescription>
                Upload a CSV file containing your transaction data
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Upload className="h-10 w-10 text-finance-primary" />
              </div>
              <div className="text-center space-y-2 mb-6">
                <h3 className="font-medium">Drag & drop your file here</h3>
                <p className="text-sm text-gray-500">or click to browse your computer</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                onClick={handleFileSelect} 
                className="bg-finance-primary hover:bg-finance-primary/90"
                disabled={isUploading}
              >
                {isUploading ? "Processing..." : "Select File"}
              </Button>
              <div className="text-xs text-gray-500 mt-4">
                Supported formats: CSV with date, description, and amount columns
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Load Demo Data</CardTitle>
              <CardDescription>
                Try out the app features with pre-populated transaction data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-6">
                Don't have your own data yet? No problem! Load our demo dataset to explore all features of SmartSpend. 
                The demo data includes a variety of transactions across different categories.
              </p>
              <Button 
                onClick={handleDemoDataLoad} 
                className="bg-finance-primary hover:bg-finance-primary/90 w-full"
                disabled={isUploading}
              >
                {isUploading ? "Loading Demo Data..." : "Load Demo Data"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {fileUploaded && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Upload Complete</AlertTitle>
          <AlertDescription className="text-green-700">
            Your transaction data has been successfully processed. View your data in the Visualize section.
          </AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>
            {uploadError}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>How to prepare your data for upload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Supported File Formats</h3>
              <p className="text-sm text-gray-600">
                Currently we support CSV files with the following columns:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-4">
                <li>Date (in any standard format)</li>
                <li>Description (transaction details)</li>
                <li>Amount (numerical value)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Automatic Categorization</h3>
              <p className="text-sm text-gray-600">
                Our system will automatically categorize your transactions based on the descriptions.
                The categories include: Food, Shopping, Transport, Utilities, and Entertainment.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Sample Data Format</h3>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
                Date,Description,Amount<br/>
                2023-03-01,Uber to work,250<br/>
                2023-03-02,Zomato dinner,450<br/>
                2023-03-03,Amazon purchase,1200
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadData;
