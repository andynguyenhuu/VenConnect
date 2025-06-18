'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts'
import { useState } from 'react'

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  AU: Math.floor(Math.random() * 1000) + 200,
  VN: Math.floor(Math.random() * 800) + 150,
}))

const dailyData = Array.from({ length: 7 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (6 - i))
  return {
    day: date.toLocaleDateString('en', { weekday: 'short' }),
    AU: Math.floor(Math.random() * 5000) + 3000,
    VN: Math.floor(Math.random() * 4000) + 2500,
    total: 0,
  }
}).map(d => ({ ...d, total: d.AU + d.VN }))

const modelUsage = [
  { model: 'Claude 4 Sonnet', calls: 8432, percentage: 68 },
  { model: 'Claude 4 Sonnet (June)', calls: 3214, percentage: 26 },
  { model: 'Other', calls: 742, percentage: 6 },
]

export function UsageChart() {
  const [timeRange, setTimeRange] = useState('7d')
  const [chartType, setChartType] = useState('line')

  const data = timeRange === '24h' ? hourlyData : dailyData

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">
            Total: {data.reduce((sum, d) => sum + d.AU + d.VN, 0).toLocaleString()}
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            AU: {data.reduce((sum, d) => sum + d.AU, 0).toLocaleString()}
          </Badge>
          <Badge variant="outline" className="text-red-600">
            VN: {data.reduce((sum, d) => sum + d.VN, 0).toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage by Region</CardTitle>
          <CardDescription>
            API calls distribution between Australia and Vietnam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === '24h' ? 'hour' : 'day'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="AU" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="VN" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              ) : chartType === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === '24h' ? 'hour' : 'day'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="AU" fill="#2563eb" />
                  <Bar dataKey="VN" fill="#dc2626" />
                </BarChart>
              ) : (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === '24h' ? 'hour' : 'day'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="AU" 
                    stackId="1"
                    stroke="#2563eb" 
                    fill="#2563eb"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="VN" 
                    stackId="1"
                    stroke="#dc2626" 
                    fill="#dc2626"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Model Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Model Usage Distribution</CardTitle>
          <CardDescription>
            API calls by model version in the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modelUsage.map((model) => (
              <div key={model.model} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{model.model}</span>
                  <span className="font-medium">{model.calls.toLocaleString()} calls</span>
                </div>
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${model.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
