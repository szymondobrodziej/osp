'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FireExtinguisher, UserPlus, LogIn } from 'lucide-react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [mode, setMode] = useState<'select' | 'login' | 'join'>('select');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Formularz logowania
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Formularz "Dołącz do nas"
  const [joinData, setJoinData] = useState({
    unitName: '',
    presidentTitle: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Błąd logowania');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('join_requests')
        .insert([
          {
            unit_name: joinData.unitName,
            president_title: joinData.presidentTitle,
            email: joinData.email,
            phone: joinData.phone,
            street: joinData.street,
            city: joinData.city,
            postal_code: joinData.postalCode,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      setSuccess('Wniosek został wysłany! Skontaktujemy się z Tobą wkrótce.');
      setJoinData({
        unitName: '',
        presidentTitle: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
      });
    } catch (err: any) {
      setError(err.message || 'Błąd wysyłania wniosku');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <FireExtinguisher className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">OSP Commander</h1>
            <p className="text-gray-600">System zarządzania działaniami ratowniczymi</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setMode('login')}
              className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
            >
              <LogIn className="w-6 h-6 mr-2" />
              Zaloguj się
            </Button>

            <Button
              onClick={() => setMode('join')}
              variant="outline"
              className="w-full h-16 text-lg border-red-600 text-red-600 hover:bg-red-50"
            >
              <UserPlus className="w-6 h-6 mr-2" />
              Dołącz do nas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Logowanie</CardTitle>
            <CardDescription>Zaloguj się do swojego konta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? 'Logowanie...' : 'Zaloguj się'}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('select')}>
                  Powrót
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // mode === 'join'
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Dołącz do nas</CardTitle>
          <CardDescription>
            Cieszymy się, że jesteś zainteresowany wstąpieniem w nasze szeregi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinRequest} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unitName">Nazwa jednostki *</Label>
                <Input
                  id="unitName"
                  placeholder="np. OSP Warszawa"
                  value={joinData.unitName}
                  onChange={(e) => setJoinData({ ...joinData, unitName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="presidentTitle">Godność prezesa *</Label>
                <Input
                  id="presidentTitle"
                  placeholder="np. Prezes OSP"
                  value={joinData.presidentTitle}
                  onChange={(e) => setJoinData({ ...joinData, presidentTitle: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="prezes@osp.pl"
                    value={joinData.email}
                    onChange={(e) => setJoinData({ ...joinData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+48 123 456 789"
                    value={joinData.phone}
                    onChange={(e) => setJoinData({ ...joinData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Adres jednostki</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Ulica *</Label>
                    <Input
                      id="street"
                      placeholder="ul. Strażacka 1"
                      value={joinData.street}
                      onChange={(e) => setJoinData({ ...joinData, street: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Miasto *</Label>
                      <Input
                        id="city"
                        placeholder="Warszawa"
                        value={joinData.city}
                        onChange={(e) => setJoinData({ ...joinData, city: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Kod pocztowy *</Label>
                      <Input
                        id="postalCode"
                        placeholder="00-000"
                        value={joinData.postalCode}
                        onChange={(e) => setJoinData({ ...joinData, postalCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij wniosek'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setMode('select')}
              >
                Powrót
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

