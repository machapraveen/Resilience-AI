
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [notifyEmailEnabled, setNotifyEmailEnabled] = useState(true);
  const [notifySlackEnabled, setNotifySlackEnabled] = useState(false);
  const [notifyMobileEnabled, setNotifyMobileEnabled] = useState(true);
  const [autoRemediateEnabled, setAutoRemediateEnabled] = useState(true);
  const [predictionThreshold, setPredictionThreshold] = useState('85');
  const [theme, setTheme] = useState('system');
  const [dataRefreshInterval, setDataRefreshInterval] = useState('30');
  
  const handleSaveNotifications = () => {
    toast.success('Notification settings saved');
  };
  
  const handleSaveAutomation = () => {
    toast.success('Automation settings saved');
  };
  
  const handleSavePreferences = () => {
    toast.success('Preferences saved');
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure application settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="notifications" className="w-full max-w-3xl">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-email">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="notify-email" 
                    checked={notifyEmailEnabled} 
                    onCheckedChange={setNotifyEmailEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-slack">Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to a Slack channel
                    </p>
                  </div>
                  <Switch 
                    id="notify-slack" 
                    checked={notifySlackEnabled} 
                    onCheckedChange={setNotifySlackEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-mobile">Mobile Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your mobile device
                    </p>
                  </div>
                  <Switch 
                    id="notify-mobile" 
                    checked={notifyMobileEnabled} 
                    onCheckedChange={setNotifyMobileEnabled} 
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-remediate">Auto-Remediation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically attempt to fix issues when detected
                    </p>
                  </div>
                  <Switch 
                    id="auto-remediate" 
                    checked={autoRemediateEnabled} 
                    onCheckedChange={setAutoRemediateEnabled} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prediction-threshold">Prediction Threshold (%)</Label>
                  <p className="text-sm text-muted-foreground">
                    CPU utilization threshold for predictions
                  </p>
                  <Select
                    value={predictionThreshold}
                    onValueChange={setPredictionThreshold}
                  >
                    <SelectTrigger id="prediction-threshold" className="w-full">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="85">85%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveAutomation}>
                    Save Automation Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Data Refresh Interval (seconds)</Label>
                  <Select
                    value={dataRefreshInterval}
                    onValueChange={setDataRefreshInterval}
                  >
                    <SelectTrigger id="refresh-interval" className="w-full">
                      <SelectValue placeholder="Select refresh interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SettingsPage;
