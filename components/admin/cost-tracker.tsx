'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const costByRegion = [
  { name: 'Australia', value: 2184.30, color: '#2563eb' },
  { name: 'Vietnam', value: 1100.20, color: '#dc2626' },
]

const monthlyCosts = [
  { month: 'Jan', AUD: 2845, VND: 48765000 },
  { month: 'Feb', AUD: 3123, VND: 53548000 },
  { month: 'Mar', AUD: 2967, VND: 50862000 },
  { month: 'Apr', AUD: 3421, VND: 58654000 },
  { month: 'May', AUD: 3567, VND: 61148000 },
  { month: 'Jun', AUD: 3284, VND: 56280000 },
]

const costBreakdown = [
  { category: 'API Calls', audCost: 2847.50, vndCost: 48813000, percentage: 86.7 },
  { category: 'File Storage', audCost: 234.80, vndCost: 4024000, percentage: 7.2 },
  { category: 'Data Transfer', audCost: 202.20, vndCost: 3467000, percentage: 6.1 },
]

// Exchange rate (1 AUD = 17,150 VND)
const AUD_TO_VND = 17150

export function CostTracker() {
  const [currency, setCurrency] = useState<'AUD' | 'VND'>('AUD')
  const [timeRange, setTimeRange] = useState('month')

  const formatCurrency = (amount: number, curr: 'AUD' | 'VND') => {
    if (curr === 'AUD') {
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(amount)
    } else {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount)
    }
  }

  const totalCost = costByRegion.reduce((sum, region) => sum + region.value, 0)
  const totalCostVND = totalCost * AUD_TO_VND

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={currency} onValueChange={(v) => setCurrency(v as 'AUD' | 'VND')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AUD">🇦🇺 AUD</SelectItem>
              <SelectItem value="VND">🇻🇳 VND</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(currency === 'AUD' ? totalCost : totalCostVND, currency)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">-8.2%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                currency === 'AUD' ? totalCost / 248 : totalCostVND / 248, 
                currency
              )}
            </div>
            <Badge variant="secondary" className="mt-1">
              248 active users
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Monthly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                currency === 'AUD' ? totalCost * 1.15 : totalCostVND * 1.15, 
                currency
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+15%</span>
              <span className="ml-1">estimated</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost by Region</CardTitle>
            <CardDescription>
              Monthly cost distribution between regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costByRegion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costByRegion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => 
                      formatCurrency(
                        currency === 'AUD' ? value : value * AUD_TO_VND, 
                        currency
                      )
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>
              Cost trend over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCosts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => 
                      formatCurrency(value, currency)
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey={currency} 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>
            Detailed breakdown by service category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Cost ({currency})</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costBreakdown.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>
                    {formatCurrency(
                      currency === 'AUD' ? item.audCost : item.vndCost,
                      currency
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm">{item.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {Math.random() > 0.5 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
