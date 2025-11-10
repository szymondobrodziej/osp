'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Shield, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InstallCertPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Instalacja Certyfikatu SSL</h1>
          </div>
          <p className="text-lg text-gray-600">
            Aby używać geolokalizacji na telefonie, musisz zainstalować certyfikat CA
          </p>
        </div>

        {/* Krok 1: Pobierz certyfikat */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white text-lg px-3 py-1">1</Badge>
              <div>
                <CardTitle className="text-2xl">Pobierz certyfikat CA</CardTitle>
                <CardDescription>Kliknij przycisk poniżej, aby pobrać certyfikat</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <a href="/rootCA.pem" download="mkcert-rootCA.pem">
              <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-lg py-6">
                <Download className="w-6 h-6 mr-2" />
                Pobierz certyfikat CA (rootCA.pem)
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Krok 2: Instalacja na iOS */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white text-lg px-3 py-1">2</Badge>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Smartphone className="w-6 h-6" />
                  Instalacja na iOS (iPhone/iPad)
                </CardTitle>
                <CardDescription>Wykonaj poniższe kroki na swoim urządzeniu iOS</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 1: Pobierz certyfikat</p>
                  <p className="text-sm text-gray-600">Kliknij przycisk "Pobierz certyfikat CA" powyżej. Safari zapyta czy chcesz pobrać profil konfiguracyjny - kliknij "Zezwól".</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 2: Otwórz Ustawienia</p>
                  <p className="text-sm text-gray-600">Przejdź do <strong>Ustawienia</strong> → <strong>Ogólne</strong> → <strong>VPN i zarządzanie urządzeniem</strong></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 3: Zainstaluj profil</p>
                  <p className="text-sm text-gray-600">Zobaczysz pobrany profil "mkcert". Kliknij na niego i wybierz <strong>Zainstaluj</strong>. Wpisz kod PIN urządzenia.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 4: Włącz zaufanie do certyfikatu</p>
                  <p className="text-sm text-gray-600">Przejdź do <strong>Ustawienia</strong> → <strong>Ogólne</strong> → <strong>Informacje</strong> → <strong>Ustawienia zaufania certyfikatu</strong>. Włącz przełącznik przy "mkcert".</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Krok 3: Instalacja na Android */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white text-lg px-3 py-1">3</Badge>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Smartphone className="w-6 h-6" />
                  Instalacja na Android
                </CardTitle>
                <CardDescription>Wykonaj poniższe kroki na swoim urządzeniu Android</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 1: Pobierz certyfikat</p>
                  <p className="text-sm text-gray-600">Kliknij przycisk "Pobierz certyfikat CA" powyżej. Plik zostanie zapisany w folderze Pobrane.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 2: Otwórz Ustawienia</p>
                  <p className="text-sm text-gray-600">Przejdź do <strong>Ustawienia</strong> → <strong>Zabezpieczenia</strong> → <strong>Szyfrowanie i dane uwierzytelniające</strong> → <strong>Zainstaluj certyfikat</strong></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 3: Wybierz certyfikat CA</p>
                  <p className="text-sm text-gray-600">Wybierz <strong>Certyfikat CA</strong>, następnie znajdź i wybierz pobrany plik "mkcert-rootCA.pem".</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Krok 4: Potwierdź instalację</p>
                  <p className="text-sm text-gray-600">Wpisz PIN lub hasło urządzenia, aby potwierdzić instalację certyfikatu.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ostrzeżenie */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <p className="font-semibold text-orange-900">Ważne informacje:</p>
                <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
                  <li>Ten certyfikat jest ważny tylko dla lokalnego serwera deweloperskiego</li>
                  <li>Certyfikat wygasa 10 lutego 2028</li>
                  <li>Po zainstalowaniu certyfikatu, odśwież stronę aplikacji</li>
                  <li>Jeśli nadal widzisz ostrzeżenie o certyfikacie, zrestartuj przeglądarkę</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Powrót */}
        <div className="text-center">
          <Link href="/">
            <Button size="lg" variant="outline" className="text-lg">
              Powrót do aplikacji
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

