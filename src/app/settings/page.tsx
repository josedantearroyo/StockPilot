
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
        toast({ title: 'Éxito', description: 'Configuración guardada correctamente.' });
    };

  return (
    <div>
      <PageHeader title="Configuración" description="Personaliza tu experiencia en la aplicación." />
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Ajusta tus preferencias de la aplicación a continuación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Apariencia</h3>
                <div className="space-y-4 rounded-md border p-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="theme" className="flex flex-col space-y-1">
                            <span>Tema</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Selecciona el tema visual para la aplicación.
                            </span>
                        </Label>
                        <Select defaultValue="light">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccionar tema" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Claro</SelectItem>
                                <SelectItem value="dark">Oscuro</SelectItem>
                                <SelectItem value="system">Sistema</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificaciones</h3>
                <div className="space-y-4 rounded-md border p-4">
                    <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Notificaciones por Correo</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Recibe actualizaciones por correo para eventos importantes.
                        </span>
                        </Label>
                        <Switch id="email-notifications" />
                    </div>
                    <Separator />
                     <div className="flex flex-row items-center justify-between">
                        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                        <span>Notificaciones Push</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Recibe notificaciones push en tus dispositivos.
                        </span>
                        </Label>
                        <Switch id="push-notifications" disabled />
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSave}>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    