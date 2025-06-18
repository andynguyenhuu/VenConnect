'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Globe, Shield, Bell, User, Key, BarChart3, Palette, Layout, Monitor } from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState('default')
  const [density, setDensity] = useState('comfortable')
  const [conversationView, setConversationView] = useState('list')
  const [accentColor, setAccentColor] = useState('blue')

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Badge variant="secondary">Enterprise</Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your account profile information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Andy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Nguyen" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="andy@ven.com.au" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" placeholder="VenConnect Enterprise" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="australia/melbourne">Australia/Melbourne</SelectItem>
                    <SelectItem value="australia/sydney">Australia/Sydney</SelectItem>
                    <SelectItem value="asia/ho_chi_minh">Asia/Ho_Chi_Minh</SelectItem>
                    <SelectItem value="asia/singapore">Asia/Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Preferences
              </CardTitle>
              <CardDescription>
                Configure regional settings and data preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region">Primary Region</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="australia">Australia (Sydney)</SelectItem>
                    <SelectItem value="vietnam">Vietnam (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                    <SelectItem value="vnd">VND - Vietnamese Dong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save conversations</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your conversations to the cloud
                    </p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme across the application
                    </p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Interface Personalization
              </CardTitle>
              <CardDescription>
                Customize your VenConnect interface to match your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sidebar Width */}
              <div className="space-y-3">
                <Label htmlFor="sidebarWidth">Sidebar Width</Label>
                <Select value={sidebarWidth} onValueChange={setSidebarWidth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sidebar width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow">Narrow (240px)</SelectItem>
                    <SelectItem value="default">Default (288px)</SelectItem>
                    <SelectItem value="wide">Wide (320px)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Adjust the width of the conversation sidebar for better workflow.
                </p>
              </div>

              <Separator />

              {/* Interface Density */}
              <div className="space-y-3">
                <Label htmlFor="density">Interface Density</Label>
                <Select value={density} onValueChange={setDensity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interface density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Control spacing and padding throughout the interface.
                </p>
              </div>

              <Separator />

              {/* Conversation View */}
              <div className="space-y-3">
                <Label htmlFor="conversationView">Conversation View</Label>
                <Select value={conversationView} onValueChange={setConversationView}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select conversation view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="cards">Card View</SelectItem>
                    <SelectItem value="compact">Compact List</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how conversations are displayed in the sidebar.
                </p>
              </div>

              <Separator />

              {/* Theme & Colors */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <Label>Theme & Accent Colors</Label>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <Select value={accentColor} onValueChange={setAccentColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accent color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue (Default)</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-12 mx-auto rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <Label className="text-xs">Blue</Label>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-12 mx-auto rounded-md bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <Label className="text-xs">Purple</Label>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-12 mx-auto rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <Label className="text-xs">Green</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High contrast mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better accessibility
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduced motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button>Save Personalization Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Secure your account with two-factor authentication
                    </p>
                  </div>
                  <Badge variant="outline">Required</Badge>
                </div>
                <Button variant="outline">Setup 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Usage alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when approaching usage limits
                  </p>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Important security and login notifications
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Usage
              </CardTitle>
              <CardDescription>
                Monitor your VenConnect usage and performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-2xl font-bold">8,934</div>
                  <div className="text-sm text-muted-foreground">Total Messages</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold">$2,847</div>
                  <div className="text-sm text-muted-foreground">Monthly Cost (AUD)</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold">99.8%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Storage Usage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conversations</span>
                    <span>87 MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Attachments</span>
                    <span>37 MB</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Storage</span>
                    <span>124 MB / 1 GB</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{width: '12.4%'}}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export Usage Data
                  </Button>
                  <Button variant="outline" size="sm">
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys & Integration
              </CardTitle>
              <CardDescription>
                Manage your API keys and third-party integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Replicate API Key</h4>
                  <Badge variant={true ? "secondary" : "destructive"}>
                    {true ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Required for Claude 4 Sonnet access
                </p>
                <div className="flex gap-2">
                  <Input placeholder="r8_..." type="password" />
                  <Button variant="outline">Update</Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Supabase Connection</h4>
                  <Badge variant="destructive">Not Connected</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Database and authentication service
                </p>
                <Button variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Configure Supabase
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium mb-2">API Usage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>This month:</span>
                    <span>8,934 requests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span>$2,847.50 AUD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limit:</span>
                    <span>50,000 requests</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}