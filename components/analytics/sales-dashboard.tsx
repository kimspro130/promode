"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  Download,
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface ProductSales {
  name: string;
  sales: number;
  revenue: number;
  color: string;
}

interface AnalyticsMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SalesDashboard() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          created_at,
          user_id,
          order_items (
            product_id,
            quantity,
            price,
            products (
              name
            )
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (ordersError) {
        throw ordersError;
      }

      // Process sales data by date
      const salesByDate = new Map<string, { revenue: number; orders: number; customers: Set<string> }>();
      const productSalesMap = new Map<string, { sales: number; revenue: number }>();

      orders?.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        
        if (!salesByDate.has(date)) {
          salesByDate.set(date, { revenue: 0, orders: 0, customers: new Set() });
        }
        
        const dayData = salesByDate.get(date)!;
        dayData.revenue += order.total_amount;
        dayData.orders += 1;
        dayData.customers.add(order.user_id);

        // Process product sales
        order.order_items?.forEach(item => {
          const productName = item.products?.name || 'Unknown Product';
          if (!productSalesMap.has(productName)) {
            productSalesMap.set(productName, { sales: 0, revenue: 0 });
          }
          const productData = productSalesMap.get(productName)!;
          productData.sales += item.quantity;
          productData.revenue += item.price * item.quantity;
        });
      });

      // Convert to chart data
      const chartData: SalesData[] = Array.from(salesByDate.entries()).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
        customers: data.customers.size,
      }));

      // Convert product sales to chart data
      const productChartData: ProductSales[] = Array.from(productSalesMap.entries())
        .map(([name, data], index) => ({
          name,
          sales: data.sales,
          revenue: data.revenue,
          color: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5); // Top 5 products

      // Calculate metrics
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;
      const uniqueCustomers = new Set(orders?.map(order => order.user_id)).size;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth (comparing with previous period)
      // This is a simplified calculation - in a real app, you'd compare with the previous period
      const revenueGrowth = Math.random() * 20 - 10; // Mock data
      const ordersGrowth = Math.random() * 15 - 7.5; // Mock data

      setSalesData(chartData);
      setProductSales(productChartData);
      setMetrics({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const csvData = salesData.map(row => 
      `${row.date},${row.revenue},${row.orders},${row.customers}`
    ).join('\n');
    
    const blob = new Blob([`Date,Revenue,Orders,Customers\n${csvData}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-data-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const MetricCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    format = 'number' 
  }: {
    title: string;
    value: number;
    growth?: number;
    icon: any;
    format?: 'number' | 'currency';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {format === 'currency' ? formatCurrency(value) : value.toLocaleString()}
        </div>
        {growth !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground">
            {growth > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={growth > 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(growth).toFixed(1)}%
            </span>
            <span className="ml-1">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Analytics</h2>
          <p className="text-muted-foreground">
            Track your store's performance and growth
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <TabsList>
              <TabsTrigger value="7d">7 days</TabsTrigger>
              <TabsTrigger value="30d">30 days</TabsTrigger>
              <TabsTrigger value="90d">90 days</TabsTrigger>
              <TabsTrigger value="1y">1 year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          growth={metrics.revenueGrowth}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          growth={metrics.ordersGrowth}
          icon={ShoppingBag}
        />
        <MetricCard
          title="Customers"
          value={metrics.totalCustomers}
          icon={Users}
        />
        <MetricCard
          title="Avg. Order Value"
          value={metrics.averageOrderValue}
          icon={Package}
          format="currency"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="orders">Order Volume</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productSales}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productSales.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: product.color }}
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(product.revenue)}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} sold
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
