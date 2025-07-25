
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
    const { toast } = useToast();

    const handleSave = () => {
        toast({ title: 'Success', description: 'Settings saved successfully.' });
    };

  return (
    <div>
      <PageHeader title="Settings" description="Customize your application experience." />
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Adjust your application preferences below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="space-y-4 rounded-md border p-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="theme" className="flex flex-col space-y-1">
                            <span>Theme</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Select the visual theme for the application.
                            </span>
                        </Label>
                        <Select defaultValue="light">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="space-y-4 rounded-md border p-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Email Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Receive email updates for important events.
                        </span>
                        </Label>
                        <Switch id="email-notifications" />
                    </div>
                    <Separator />
                     <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                        <span>Push Notifications</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Get push notifications on your devices.
                        </span>
                        </Label>
                        <Switch id="push-notifications" disabled />
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
