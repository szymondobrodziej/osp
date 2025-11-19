# 🔧 Instrukcja konfiguracji Supabase

## Krok 1: Utworzenie projektu Supabase

1. Wejdź na https://supabase.com
2. Zaloguj się (możesz przez GitHub)
3. Kliknij **"New Project"**
4. Wypełnij dane:
   - **Name**: `osp-commander`
   - **Database Password**: ustaw silne hasło (zapisz je!)
   - **Region**: `Frankfurt` (najbliżej Polski)
5. Kliknij **"Create new project"**
6. Poczekaj ~2 minuty na setup

---

## Krok 2: Uruchomienie SQL schema

1. W Supabase Dashboard → **SQL Editor** (lewa strona)
2. Kliknij **"New query"**
3. Skopiuj całą zawartość pliku `supabase/schema.sql`
4. Wklej do edytora SQL
5. Kliknij **"Run"** (lub Ctrl+Enter)
6. Sprawdź czy wszystko się wykonało bez błędów

---

## Krok 3: Pobranie kluczy API

1. W Supabase Dashboard → **Settings** → **API**
2. Znajdź sekcję **"Project API keys"**
3. Skopiuj:
   - **Project URL** (np. `https://xxxxx.supabase.co`)
   - **anon public** key (długi string)

---

## Krok 4: Konfiguracja lokalnego projektu

1. Stwórz plik `.env.local` w głównym katalogu projektu:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edytuj `.env.local` i wklej swoje klucze:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=twój_anon_key
   ```

3. Zapisz plik

---

## Krok 5: Konfiguracja Vercel (produkcja)

1. Wejdź na https://vercel.com/dashboard
2. Wybierz swój projekt **osp-commander**
3. Przejdź do **Settings** → **Environment Variables**
4. Dodaj zmienne:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: twój Project URL
   - Kliknij **"Add"**
   
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: twój anon key
   - Kliknij **"Add"**

5. Zapisz zmiany

---

## Krok 6: Utworzenie pierwszego Super Admina (TY)

1. W Supabase Dashboard → **Authentication** → **Users**
2. Kliknij **"Add user"** → **"Create new user"**
3. Wypełnij:
   - **Email**: twój email
   - **Password**: ustaw hasło
   - **Auto Confirm User**: ✅ zaznacz
4. Kliknij **"Create user"**
5. Skopiuj **User UID** (np. `123e4567-e89b-12d3-a456-426614174000`)

6. Przejdź do **SQL Editor** i wykonaj:
   ```sql
   UPDATE user_profiles 
   SET role = 'super_admin' 
   WHERE id = 'WKLEJ_TUTAJ_USER_UID';
   ```

7. Teraz możesz się zalogować jako Super Admin!

---

## Krok 7: Test lokalny

1. Uruchom dev server:
   ```bash
   npm run dev
   ```

2. Otwórz http://localhost:3000/login

3. Sprawdź czy:
   - ✅ Strona się ładuje
   - ✅ Formularz "Dołącz do nas" działa
   - ✅ Możesz się zalogować jako Super Admin

---

## Krok 8: Deploy na Vercel

1. Commit i push zmian:
   ```bash
   git add -A
   git commit -m "feat: integracja Supabase + system logowania"
   git push origin dev
   ```

2. Vercel automatycznie zbuduje nową wersję

3. Sprawdź czy działa na produkcji!

---

## ✅ Gotowe!

Teraz masz:
- ✅ Bazę danych Supabase
- ✅ System logowania
- ✅ Formularz "Dołącz do nas"
- ✅ Konto Super Admina

**Następne kroki:**
- Panel Super Admina do akceptacji wniosków
- Panel Prezesa do zarządzania ratownikami
- Migracja zdarzeń z localStorage do Supabase

