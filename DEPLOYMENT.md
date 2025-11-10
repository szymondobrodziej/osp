# 🚀 Instrukcja wdrożenia OSP Commander na Vercel

## 📋 Spis treści

1. [Przygotowanie projektu](#1-przygotowanie-projektu)
2. [Utworzenie repozytorium GitHub](#2-utworzenie-repozytorium-github)
3. [Wdrożenie na Vercel](#3-wdrożenie-na-vercel)
4. [Aktualizacje aplikacji](#4-aktualizacje-aplikacji)
5. [Konfiguracja domeny własnej](#5-konfiguracja-domeny-własnej-opcjonalnie)
6. [Rozwiązywanie problemów](#6-rozwiązywanie-problemów)

---

## 1. Przygotowanie projektu

### 1.1. Sprawdź czy projekt działa lokalnie

```bash
cd osp-commander
npm install
npm run build
```

Jeśli build się powiedzie, projekt jest gotowy do wdrożenia! ✅

### 1.2. Upewnij się, że masz plik `.gitignore`

Plik `.gitignore` powinien zawierać:

```
# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# SSL certificates (tylko dla lokalnego developmentu)
.cert/

# env files
.env*

# vercel
.vercel
```

✅ Ten plik już istnieje w projekcie!

---

## 2. Utworzenie repozytorium GitHub

### 2.1. Utwórz nowe repozytorium na GitHub

1. Przejdź do https://github.com/new
2. Wypełnij dane:
   - **Repository name**: `osp-commander` (lub dowolna nazwa)
   - **Description**: `Profesjonalny system wsparcia dla Kierujących Działaniem Ratowniczym OSP`
   - **Visibility**:
     - ✅ **Public** - jeśli chcesz udostępnić kod publicznie
     - ✅ **Private** - jeśli chcesz zachować kod prywatnie (Vercel obsługuje prywatne repo za darmo!)
3. **NIE** zaznaczaj opcji "Initialize this repository with a README"
4. Kliknij **"Create repository"**

### 2.2. Połącz lokalny projekt z GitHub

W terminalu, w folderze `osp-commander`:

```bash
# Inicjalizuj git (jeśli jeszcze nie zrobione)
git init

# Dodaj wszystkie pliki
git add .

# Pierwszy commit
git commit -m "Initial commit - OSP Commander"

# Dodaj remote (ZAMIEŃ 'twoja-nazwa' na swoją nazwę użytkownika GitHub)
git remote add origin https://github.com/twoja-nazwa/osp-commander.git

# Wypchnij kod na GitHub
git branch -M main
git push -u origin main
```

**Przykład:**
```bash
git remote add origin https://github.com/szymondobrodziej/osp-commander.git
git branch -M main
git push -u origin main
```

✅ Kod jest teraz na GitHubie!

---

## 3. Wdrożenie na Vercel

### 3.1. Utwórz konto na Vercel

1. Przejdź do https://vercel.com/signup
2. Kliknij **"Continue with GitHub"**
3. Zaloguj się swoim kontem GitHub
4. Autoryzuj Vercel do dostępu do swoich repozytoriów

### 3.2. Zaimportuj projekt

1. Po zalogowaniu, kliknij **"Add New..."** → **"Project"**
2. Znajdź repozytorium `osp-commander` na liście
3. Kliknij **"Import"**

### 3.3. Skonfiguruj projekt

Na ekranie konfiguracji:

#### **Framework Preset**
- Vercel automatycznie wykryje **Next.js** ✅

#### **Root Directory**
- Ustaw na `osp-commander` (jeśli projekt jest w podfolderze)
- LUB zostaw puste (jeśli projekt jest w głównym folderze repo)

#### **Build and Output Settings**
- **Build Command**: `npm run build` (domyślne) ✅
- **Output Directory**: `.next` (domyślne) ✅
- **Install Command**: `npm install` (domyślne) ✅

#### **Environment Variables**
- Na razie zostaw puste (aplikacja nie wymaga zmiennych środowiskowych)

### 3.4. Wdróż!

1. Kliknij **"Deploy"**
2. Poczekaj 1-3 minuty na zakończenie budowania
3. Po zakończeniu zobaczysz ekran z konfetti! 🎉

### 3.5. Otwórz aplikację

Vercel automatycznie wygeneruje URL:
```
https://osp-commander.vercel.app
```
lub
```
https://osp-commander-twoja-nazwa.vercel.app
```

**Kliknij "Visit" aby otworzyć aplikację!** 🚀

**✅ WAŻNE: Geolokalizacja będzie działać od razu! Vercel automatycznie zapewnia HTTPS!**

---

## 4. Aktualizacje aplikacji

### 4.1. Automatyczne wdrożenia (CI/CD)

Vercel automatycznie wdraża każdą zmianę w kodzie! 🎯

**Proces:**

1. **Wprowadź zmiany w kodzie lokalnie**
   ```bash
   # Edytuj pliki w projekcie
   # np. zmień coś w components/checklist-view.tsx
   ```

2. **Commituj zmiany**
   ```bash
   git add .
   git commit -m "Opis zmian, np: Dodano mapę z hydrantami"
   ```

3. **Wypchnij na GitHub**
   ```bash
   git push
   ```

4. **Vercel automatycznie:**
   - Wykryje nowy commit
   - Zbuduje aplikację
   - Wdroży nową wersję
   - Wyśle powiadomienie email (jeśli włączone)

**Czas wdrożenia: 1-3 minuty** ⏱️

### 4.2. Podgląd zmian przed wdrożeniem (Preview Deployments)

Jeśli chcesz przetestować zmiany przed wdrożeniem na produkcję:

1. **Utwórz nową gałąź**
   ```bash
   git checkout -b feature/nowa-funkcja
   ```

2. **Wprowadź zmiany i commituj**
   ```bash
   git add .
   git commit -m "Testowa funkcja"
   git push -u origin feature/nowa-funkcja
   ```

3. **Vercel utworzy Preview Deployment**
   - Dostaniesz unikalny URL do testowania
   - np. `https://osp-commander-git-feature-nowa-funkcja.vercel.app`

4. **Po przetestowaniu, zmerguj do main**
   ```bash
   git checkout main
   git merge feature/nowa-funkcja
   git push
   ```

5. **Vercel wdroży na produkcję!**

### 4.3. Rollback (cofnięcie wdrożenia)

Jeśli coś pójdzie nie tak:

1. Przejdź do https://vercel.com/dashboard
2. Wybierz projekt `osp-commander`
3. Kliknij zakładkę **"Deployments"**
4. Znajdź poprzednią działającą wersję
5. Kliknij **"..."** → **"Promote to Production"**

**Aplikacja wróci do poprzedniej wersji w kilka sekund!** ⚡

---

## 5. Konfiguracja domeny własnej (opcjonalnie)

### 5.1. Jeśli masz własną domenę (np. `osp-commander.pl`)

1. Przejdź do projektu na Vercel
2. Kliknij **"Settings"** → **"Domains"**
3. Kliknij **"Add"**
4. Wpisz swoją domenę: `osp-commander.pl`
5. Vercel pokaże instrukcje konfiguracji DNS

### 5.2. Konfiguracja DNS

W panelu swojego dostawcy domeny (np. OVH, home.pl):

**Dla domeny głównej (`osp-commander.pl`):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Dla subdomeny (`www.osp-commander.pl`):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3. Certyfikat SSL

Vercel automatycznie wygeneruje certyfikat SSL (HTTPS) dla Twojej domeny! 🔐

**Czas propagacji DNS: 24-48 godzin** (zazwyczaj kilka minut)

---

## 6. Rozwiązywanie problemów

### Problem 1: Build Failed

**Objaw:** Wdrożenie kończy się błędem

**Rozwiązanie:**
1. Sprawdź logi budowania na Vercel (kliknij "View Build Logs")
2. Upewnij się, że `npm run build` działa lokalnie:
   ```bash
   npm run build
   ```
3. Sprawdź czy wszystkie zależności są w `package.json`
4. Sprawdź czy nie ma błędów TypeScript

### Problem 2: Aplikacja nie działa po wdrożeniu

**Objaw:** Biała strona lub błąd 500

**Rozwiązanie:**
1. Sprawdź logi Runtime na Vercel (zakładka "Logs")
2. Upewnij się, że nie używasz zmiennych środowiskowych, które nie są ustawione
3. Sprawdź czy ścieżki do plików są poprawne (case-sensitive!)
4. Sprawdź czy używasz `'use client'` w komponentach klienckich

### Problem 3: Geolokalizacja nie działa

**Objaw:** Błąd "only secure origins are allowed"

**Rozwiązanie:**
✅ Na Vercel to NIE jest problem! Vercel automatycznie zapewnia HTTPS, więc geolokalizacja będzie działać od razu!

Jeśli nadal nie działa:
1. Sprawdź czy przeglądarka ma uprawnienia do lokalizacji
2. Sprawdź czy użytkownik zaakceptował uprawnienia
3. Sprawdź logi w konsoli przeglądarki (F12)

### Problem 4: Wolne ładowanie

**Objaw:** Aplikacja ładuje się powoli

**Rozwiązanie:**
1. Vercel automatycznie optymalizuje obrazy i kod
2. Sprawdź czy używasz `next/image` dla obrazów
3. Włącz cache dla statycznych zasobów
4. Rozważ użycie Vercel Analytics do analizy wydajności

### Problem 5: Mapa (Leaflet) nie działa

**Objaw:** Mapa nie wyświetla się lub błąd "window is not defined"

**Rozwiązanie:**
✅ Już naprawione! Używamy `dynamic import` z `ssr: false`:
```tsx
const HydrantMap = dynamic(() => import('@/components/hydrant-map'), {
  ssr: false,
});
```

### Problem 6: Service Worker (PWA) powoduje problemy

**Objaw:** Stara wersja aplikacji się ładuje

**Rozwiązanie:**
1. Wyczyść cache przeglądarki (Ctrl+Shift+Delete)
2. Wyrejestruj Service Worker:
   - Otwórz DevTools (F12)
   - Zakładka "Application" → "Service Workers"
   - Kliknij "Unregister"
3. Odśwież stronę (Ctrl+Shift+R)

---

## 📊 Monitoring i analityka (opcjonalnie)

### Vercel Analytics

Śledź ruch na stronie:

1. Przejdź do projektu na Vercel
2. Kliknij **"Analytics"**
3. Kliknij **"Enable Analytics"**
4. Zainstaluj pakiet:
   ```bash
   npm install @vercel/analytics
   ```
5. Dodaj do `app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';

   // W komponencie, przed </body>:
   <Analytics />
   ```

### Vercel Speed Insights

Monitoruj wydajność:

1. Kliknij **"Speed Insights"**
2. Kliknij **"Enable Speed Insights"**
3. Zainstaluj pakiet:
   ```bash
   npm install @vercel/speed-insights
   ```
4. Dodaj do `app/layout.tsx`:
   ```tsx
   import { SpeedInsights } from '@vercel/speed-insights/next';

   // W komponencie, przed </body>:
   <SpeedInsights />
   ```

---

## 🎯 Podsumowanie

### ✅ Checklist wdrożenia:

- [ ] Projekt działa lokalnie (`npm run build`)
- [ ] Kod jest na GitHubie
- [ ] Konto na Vercel utworzone
- [ ] Projekt zaimportowany na Vercel
- [ ] Pierwsze wdrożenie zakończone sukcesem
- [ ] Aplikacja działa pod URL Vercel
- [ ] Geolokalizacja działa (HTTPS automatyczne!)
- [ ] Mapa z hydrantami działa
- [ ] Skonfigurowano domenę własną (opcjonalnie)

### 🚀 Workflow aktualizacji (codzienne użycie):

```bash
# 1. Wprowadź zmiany w kodzie
# (edytuj pliki w VSCode lub innym edytorze)

# 2. Commituj zmiany
git add .
git commit -m "Opis zmian, np: Poprawiono wyświetlanie mapy"

# 3. Wypchnij na GitHub
git push

# 4. Vercel automatycznie wdroży! 🎉
# Sprawdź email lub dashboard Vercel
```

**Czas wdrożenia: 1-3 minuty** ⏱️

### 📱 Udostępnianie aplikacji:

Wyślij link do aplikacji strażakom:
```
https://osp-commander.vercel.app
```

Użytkownicy mogą:
- ✅ Otworzyć w przeglądarce (Chrome, Safari, Firefox)
- ✅ Dodać do ekranu głównego (PWA)
- ✅ Używać offline (po pierwszym załadowaniu)
- ✅ Używać geolokalizacji (HTTPS automatyczne!)

### 💰 Koszty:

**Vercel Hobby Plan (darmowy):**
- ✅ Nielimitowane projekty
- ✅ Nielimitowane deploye
- ✅ 100 GB bandwidth/miesiąc
- ✅ Automatyczne HTTPS
- ✅ Globalna sieć CDN
- ✅ Preview deployments

**Dla większości jednostek OSP to wystarczy!**

Jeśli przekroczysz limity (mało prawdopodobne), Vercel Pro kosztuje $20/miesiąc.

---

## 🆘 Pomoc i wsparcie

### Dokumentacja:
- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **React Leaflet**: https://react-leaflet.js.org/

### Wsparcie:
- **GitHub Issues**: Otwórz issue w swoim repozytorium
- **Vercel Support**: https://vercel.com/support
- **Discord Next.js**: https://nextjs.org/discord

### Przydatne komendy:

```bash
# Sprawdź status git
git status

# Zobacz historię commitów
git log --oneline

# Cofnij ostatni commit (zachowaj zmiany)
git reset --soft HEAD~1

# Wymuś push (OSTROŻNIE!)
git push --force

# Pobierz najnowsze zmiany
git pull

# Zobacz różnice
git diff
```

---

## 🎓 Dodatkowe zasoby

### Rozszerzenia funkcjonalności:

1. **Baza danych (Supabase)**
   - Darmowa baza PostgreSQL
   - Synchronizacja między urządzeniami
   - https://supabase.com

2. **Autentykacja (NextAuth.js)**
   - Logowanie strażaków
   - Role i uprawnienia
   - https://next-auth.js.org

3. **Powiadomienia (OneSignal)**
   - Push notifications
   - Alerty o nowych zdarzeniach
   - https://onesignal.com

4. **Mapy offline (Mapbox)**
   - Mapy offline
   - Routing
   - https://mapbox.com

---

**Gotowe! Twoja aplikacja jest teraz dostępna dla całego świata!** 🌍🚒

**Każda zmiana w kodzie = automatyczna aktualizacja w ciągu 1-3 minut!** ⚡

**Powodzenia w ratowaniu życia!** 🚒👨‍🚒👩‍🚒

---

### 2. Netlify (alternatywa)

Alternatywa dla Vercel, również z darmowym planem.

#### Kroki:

1. **Utwórz konto na Netlify**
   - Wejdź na https://netlify.com
   - Zarejestruj się

2. **Dodaj nową stronę**
   - "Add new site" → "Import an existing project"
   - Połącz z GitHub

3. **Konfiguracja**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Dodaj zmienną środowiskową:
     - `NODE_VERSION` = `18`

4. **Deploy**
   - Kliknij "Deploy site"
   - Aplikacja dostępna pod: `https://osp-commander.netlify.app`

---

### 3. Własny serwer (VPS)

Dla większej kontroli możesz wdrożyć na własnym serwerze.

#### Wymagania:
- Serwer z Ubuntu/Debian
- Node.js 18+
- Nginx (opcjonalnie)
- PM2 (do zarządzania procesem)

#### Kroki:

1. **Zainstaluj Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Sklonuj repozytorium**
```bash
git clone <your-repo-url>
cd osp-commander
```

3. **Zainstaluj zależności i zbuduj**
```bash
npm install
npm run build
```

4. **Zainstaluj PM2**
```bash
sudo npm install -g pm2
```

5. **Uruchom aplikację**
```bash
pm2 start npm --name "osp-commander" -- start
pm2 save
pm2 startup
```

6. **Konfiguracja Nginx (opcjonalnie)**
```nginx
server {
    listen 80;
    server_name twoja-domena.pl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **SSL z Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d twoja-domena.pl
```

---

### 4. Docker

Dla konteneryzacji aplikacji.

#### Dockerfile (już w projekcie):

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Uruchomienie:

```bash
# Zbuduj obraz
docker build -t osp-commander .

# Uruchom kontener
docker run -p 3000:3000 osp-commander
```

#### Docker Compose:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

```bash
docker-compose up -d
```

---

## Konfiguracja PWA

### Generowanie ikon

Potrzebujesz ikon w rozmiarach 192x192 i 512x512.

#### Opcja 1: Online
- Użyj https://realfavicongenerator.net/
- Wgraj logo OSP
- Pobierz wygenerowane ikony

#### Opcja 2: ImageMagick
```bash
# Zainstaluj ImageMagick
sudo apt install imagemagick

# Wygeneruj ikony z logo
convert logo.png -resize 192x192 public/icon-192.png
convert logo.png -resize 512x512 public/icon-512.png
```

### Testowanie PWA

1. Otwórz aplikację w Chrome
2. Otwórz DevTools (F12)
3. Zakładka "Application"
4. Sprawdź:
   - Manifest
   - Service Workers
   - Lighthouse → PWA audit

---

## Zmienne środowiskowe

Jeśli w przyszłości dodasz backend/API:

### `.env.local` (development)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### `.env.production` (production)
```env
NEXT_PUBLIC_API_URL=https://api.twoja-domena.pl
```

**UWAGA:** Zmienne z prefiksem `NEXT_PUBLIC_` są widoczne w przeglądarce!

---

## Monitoring i Analytics

### 1. Vercel Analytics (jeśli używasz Vercel)

```bash
npm install @vercel/analytics
```

W `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Google Analytics

```bash
npm install @next/third-parties
```

W `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

---

## Aktualizacje

### Automatyczne (Vercel/Netlify)
- Każdy push do `main` automatycznie wdraża nową wersję

### Ręczne (VPS)
```bash
cd osp-commander
git pull
npm install
npm run build
pm2 restart osp-commander
```

---

## Backup danych użytkowników

Dane są przechowywane lokalnie w przeglądarce (localStorage).

### Eksport danych (funkcja do dodania):

```typescript
// Dodaj przycisk "Eksportuj dane"
const exportData = () => {
  const data = localStorage.getItem('incident-store');
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `osp-backup-${new Date().toISOString()}.json`;
  a.click();
};
```

---

## Bezpieczeństwo

### Nagłówki bezpieczeństwa

W `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## Wsparcie

### Problemy z wdrożeniem?

1. Sprawdź logi:
   - Vercel: Dashboard → Deployments → View Function Logs
   - VPS: `pm2 logs osp-commander`
   - Docker: `docker logs <container-id>`

2. Typowe problemy:
   - **Build fails**: Sprawdź wersję Node.js (min. 18)
   - **404 na podstronach**: Upewnij się że serwer obsługuje SPA routing
   - **PWA nie działa**: Sprawdź czy manifest.json jest dostępny

3. Otwórz Issue na GitHubie

---

**Powodzenia z wdrożeniem! 🚀**

