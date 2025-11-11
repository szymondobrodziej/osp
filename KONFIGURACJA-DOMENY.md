# 🌐 Konfiguracja własnej domeny dla OSP Commander

## 📋 Wymagania

- ✅ Kupiona domena (np. `osp-commander.pl`)
- ✅ Dostęp do panelu dostawcy domeny
- ✅ Projekt wdrożony na Vercel

---

## 🚀 Krok po kroku

### **Krok 1: Dodaj domenę na Vercel**

1. Otwórz: https://vercel.com/dashboard
2. Kliknij na projekt **"osp"**
3. Kliknij zakładkę **"Settings"** (na górze)
4. W menu po lewej kliknij **"Domains"**
5. W polu **"Enter domain"** wpisz swoją domenę (np. `osp-commander.pl`)
6. Kliknij **"Add"**

**Zalecam dodać obie wersje:**
- `osp-commander.pl` (główna)
- `www.osp-commander.pl` (www)

---

### **Krok 2: Skopiuj instrukcje DNS z Vercel**

Po dodaniu domeny, Vercel pokaże instrukcje konfiguracji DNS.

**Dla domeny głównej (`osp-commander.pl`):**
```
Type: A
Name: @ (lub puste)
Value: 76.76.21.21
```

**Dla subdomeny www (`www.osp-commander.pl`):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Skopiuj te wartości** - będą potrzebne w następnym kroku!

---

### **Krok 3: Skonfiguruj DNS u dostawcy domeny**

Wybierz swojego dostawcę domeny i postępuj zgodnie z instrukcjami:

---

## 🏢 Instrukcje dla konkretnych dostawców

### **OVH**

1. Zaloguj się: https://www.ovh.com/manager/
2. Przejdź do **"Domeny"** → wybierz swoją domenę
3. Kliknij zakładkę **"Strefa DNS"**
4. Kliknij **"Dodaj wpis"**

**Dla domeny głównej:**
- Typ rekordu: **A**
- Subdomena: **@ (lub puste)**
- Cel: **76.76.21.21**
- TTL: **3600** (lub domyślne)
- Kliknij **"Dalej"** → **"Zatwierdź"**

**Dla www:**
- Typ rekordu: **CNAME**
- Subdomena: **www**
- Cel: **cname.vercel-dns.com**
- TTL: **3600**
- Kliknij **"Dalej"** → **"Zatwierdź"**

---

### **home.pl**

1. Zaloguj się: https://panel.home.pl
2. Przejdź do **"Domeny"** → **"Moje domeny"**
3. Kliknij na swoją domenę
4. Kliknij **"Zarządzaj strefą DNS"**
5. Kliknij **"Dodaj rekord"**

**Dla domeny głównej:**
- Typ: **A**
- Nazwa: **@ (lub puste)**
- Wartość: **76.76.21.21**
- TTL: **3600**
- Kliknij **"Zapisz"**

**Dla www:**
- Typ: **CNAME**
- Nazwa: **www**
- Wartość: **cname.vercel-dns.com**
- TTL: **3600**
- Kliknij **"Zapisz"**

---

### **nazwa.pl**

1. Zaloguj się: https://panel.nazwa.pl
2. Przejdź do **"Domeny"** → **"Moje domeny"**
3. Kliknij na swoją domenę
4. Kliknij **"Zarządzaj strefą DNS"**
5. Kliknij **"Dodaj rekord DNS"**

**Dla domeny głównej:**
- Typ: **A**
- Nazwa: **@ (lub puste)**
- Adres IPv4: **76.76.21.21**
- TTL: **3600**
- Kliknij **"Zapisz zmiany"**

**Dla www:**
- Typ: **CNAME**
- Nazwa: **www**
- Alias: **cname.vercel-dns.com**
- TTL: **3600**
- Kliknij **"Zapisz zmiany"**

---

### **Cloudflare**

1. Zaloguj się: https://dash.cloudflare.com
2. Wybierz swoją domenę
3. Kliknij **"DNS"** w menu
4. Kliknij **"Add record"**

**Dla domeny głównej:**
- Type: **A**
- Name: **@**
- IPv4 address: **76.76.21.21**
- Proxy status: **DNS only** (szara chmurka, NIE pomarańczowa!)
- TTL: **Auto**
- Kliknij **"Save"**

**Dla www:**
- Type: **CNAME**
- Name: **www**
- Target: **cname.vercel-dns.com**
- Proxy status: **DNS only** (szara chmurka!)
- TTL: **Auto**
- Kliknij **"Save"**

**⚠️ WAŻNE:** Wyłącz proxy Cloudflare (kliknij pomarańczową chmurę aby była szara)!

---

### **GoDaddy**

1. Zaloguj się: https://account.godaddy.com
2. Przejdź do **"My Products"** → **"Domains"**
3. Kliknij na swoją domenę
4. Kliknij **"Manage DNS"**
5. Przewiń do sekcji **"Records"**
6. Kliknij **"Add"**

**Dla domeny głównej:**
- Type: **A**
- Name: **@**
- Value: **76.76.21.21**
- TTL: **1 Hour** (lub domyślne)
- Kliknij **"Save"**

**Dla www:**
- Type: **CNAME**
- Name: **www**
- Value: **cname.vercel-dns.com**
- TTL: **1 Hour**
- Kliknij **"Save"**

---

### **Inny dostawca**

Jeśli Twój dostawca nie jest na liście:

1. Zaloguj się do panelu dostawcy domeny
2. Znajdź sekcję **"DNS"**, **"Strefa DNS"** lub **"DNS Management"**
3. Dodaj rekordy zgodnie z instrukcjami Vercel:
   - Rekord **A** dla domeny głównej
   - Rekord **CNAME** dla www

**Jeśli masz problem, skontaktuj się z supportem dostawcy domeny.**

---

## ⏱️ Czas propagacji DNS

Po dodaniu rekordów DNS:

- **Minimalna propagacja:** 5-15 minut
- **Typowa propagacja:** 1-4 godziny
- **Maksymalna propagacja:** 24-48 godzin

**Sprawdź status propagacji:**
- Otwórz: https://dnschecker.org
- Wpisz swoją domenę (np. `osp-commander.pl`)
- Sprawdź czy rekordy są widoczne na różnych serwerach DNS

**Zielone checkmarki = propagacja zakończona!** ✅

---

## 🔐 Certyfikat SSL (HTTPS)

**Vercel automatycznie wygeneruje certyfikat SSL!** 🎉

- ✅ Darmowy certyfikat Let's Encrypt
- ✅ Automatyczne odnawianie co 90 dni
- ✅ HTTPS działa od razu po propagacji DNS
- ✅ Geolokalizacja będzie działać!

**Czas generowania certyfikatu:** 1-5 minut po propagacji DNS

**Sprawdź czy HTTPS działa:**
- Otwórz: `https://osp-commander.pl` (Twoja domena)
- Powinieneś zobaczyć kłódkę w pasku adresu 🔒

---

## ✅ Weryfikacja konfiguracji

### **Krok 1: Sprawdź DNS**

Otwórz terminal i uruchom:

```bash
# Sprawdź rekord A
nslookup osp-commander.pl

# Sprawdź rekord CNAME
nslookup www.osp-commander.pl
```

**Poprawny wynik:**
```
osp-commander.pl
Address: 76.76.21.21

www.osp-commander.pl
canonical name = cname.vercel-dns.com
```

### **Krok 2: Sprawdź HTTPS**

Otwórz w przeglądarce:
- `https://osp-commander.pl`
- `https://www.osp-commander.pl`

**Powinieneś zobaczyć:**
- ✅ Aplikację OSP Commander
- ✅ Kłódkę w pasku adresu (HTTPS)
- ✅ Brak ostrzeżeń o certyfikacie

### **Krok 3: Sprawdź geolokalizację**

1. Otwórz aplikację na telefonie
2. Kliknij "Pożar budynku"
3. Zaakceptuj uprawnienia do lokalizacji
4. Sprawdź czy mapa się wyświetla
5. Sprawdź czy Twoja pozycja jest widoczna

**Wszystko działa? Gratulacje!** 🎉

---

## 🔄 Przekierowania

Vercel automatycznie skonfiguruje przekierowania:

- `http://osp-commander.pl` → `https://osp-commander.pl` ✅
- `http://www.osp-commander.pl` → `https://www.osp-commander.pl` ✅
- `www.osp-commander.pl` → `osp-commander.pl` (opcjonalnie)

**Możesz skonfigurować przekierowania w:**
Vercel Dashboard → Settings → Domains → kliknij domenę → Redirect

---

## 📱 Aktualizacja linków dla użytkowników

Po skonfigurowaniu domeny, zaktualizuj linki:

**Stary link:**
```
https://osp.vercel.app
```

**Nowy link:**
```
https://osp-commander.pl
```

**Wyślij aktualizację strażakom:**
```
🚒 OSP Commander - Nowy adres!

Nowy link: https://osp-commander.pl

Stary link (https://osp.vercel.app) nadal działa,
ale zalecamy używać nowego adresu.

Jeśli dodałeś aplikację do ekranu głównego,
usuń starą i dodaj ponownie z nowego adresu.
```

---

## 🆘 Rozwiązywanie problemów

### Problem: Domena nie działa po 24 godzinach

**Rozwiązanie:**
1. Sprawdź czy rekordy DNS są poprawne (https://dnschecker.org)
2. Sprawdź czy TTL nie jest zbyt długie (zmień na 3600)
3. Sprawdź czy nie ma konfliktujących rekordów DNS
4. Skontaktuj się z supportem dostawcy domeny

### Problem: Certyfikat SSL się nie generuje

**Rozwiązanie:**
1. Poczekaj 5-10 minut po propagacji DNS
2. Sprawdź czy rekordy DNS są poprawne
3. Sprawdź czy domena jest zweryfikowana na Vercel
4. Kliknij "Refresh" w Vercel Dashboard → Domains

### Problem: Cloudflare - błąd "Too many redirects"

**Rozwiązanie:**
1. Wyłącz proxy Cloudflare (szara chmurka, nie pomarańczowa)
2. Lub zmień SSL mode w Cloudflare na "Full" (nie "Flexible")

### Problem: Stara wersja aplikacji się ładuje

**Rozwiązanie:**
1. Wyczyść cache przeglądarki
2. Odśwież stronę (Ctrl+Shift+R)
3. Sprawdź czy DNS wskazuje na Vercel (nslookup)

---

## 💡 Wskazówki

1. **Dodaj obie wersje domeny** (z www i bez www)
2. **Poczekaj na pełną propagację DNS** (może zająć kilka godzin)
3. **Sprawdź HTTPS** - powinno działać automatycznie
4. **Zaktualizuj linki** - wyślij nowy adres strażakom
5. **Wygeneruj nowy QR code** - z nowym adresem domeny

---

## 📊 Checklist konfiguracji

- [ ] Dodano domenę na Vercel
- [ ] Skopiowano instrukcje DNS
- [ ] Dodano rekord A dla domeny głównej
- [ ] Dodano rekord CNAME dla www
- [ ] Poczekano na propagację DNS (5-60 minut)
- [ ] Sprawdzono DNS (https://dnschecker.org)
- [ ] Sprawdzono HTTPS (kłódka w pasku adresu)
- [ ] Przetestowano aplikację na nowej domenie
- [ ] Przetestowano geolokalizację
- [ ] Zaktualizowano linki dla użytkowników
- [ ] Wygenerowano nowy QR code
- [ ] Gotowe! 🎉

---

**Powodzenia z konfiguracją domeny!** 🌐🚒

**Jeśli masz problemy, sprawdź dokumentację Vercel:**
https://vercel.com/docs/concepts/projects/domains

