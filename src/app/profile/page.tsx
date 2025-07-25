
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { toast } = useToast();
  const [name, setName] = useState('Admin');
  const [email, setEmail] = useState('admin@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
        toast({ variant: 'destructive', title: 'Error', description: 'Name and email cannot be empty.' });
        return;
    }
    // Logic to update user profile
    toast({ title: 'Success', description: 'Profile updated successfully.' });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
        toast({ variant: 'destructive', title: 'Error', description: 'New password must be at least 6 characters long.' });
        return;
    }
    // Logic to change password
    toast({ title: 'Success', description: 'Password changed successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div>
      <PageHeader title="Profile" description="Manage your account settings and profile information." />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{email}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full">Change Avatar</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
            <Card>
                <form onSubmit={handleProfileUpdate}>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Save Changes</Button>
                    </CardFooter>
                </form>
            </Card>
             <Card>
                <form onSubmit={handlePasswordChange}>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password here. Make sure it's a strong one.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Update Password</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
