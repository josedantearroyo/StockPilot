
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

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
        toast({ variant: 'destructive', title: 'Error', description: 'El nombre y el correo no pueden estar vacíos.' });
        return;
    }
    toast({ title: 'Éxito', description: 'Perfil actualizado correctamente.' });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    if (newPassword.length < 6) {
        toast({ variant: 'destructive', title: 'Error', description: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        return;
    }
    toast({ title: 'Éxito', description: 'Contraseña cambiada correctamente.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div>
      <PageHeader title="Perfil" description="Gestiona la configuración de tu cuenta y la información de tu perfil." />
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
                <Button className="w-full">Cambiar Avatar</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
            <Card>
                <form onSubmit={handleProfileUpdate}>
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>Actualiza tus datos personales aquí.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Guardar Cambios</Button>
                    </CardFooter>
                </form>
            </Card>
             <Card>
                <form onSubmit={handlePasswordChange}>
                    <CardHeader>
                        <CardTitle>Cambiar Contraseña</CardTitle>
                        <CardDescription>Actualiza tu contraseña aquí. Asegúrate de que sea segura.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Contraseña Actual</Label>
                            <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-password">Nueva Contraseña</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Actualizar Contraseña</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
}

    