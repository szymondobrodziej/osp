# 🚒 OSP Commander

**Profesjonalny system wsparcia dla Kierujących Działaniem Ratowniczym OSP**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/szymondobrodziej/osp)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 📋 Opis

OSP Commander to nowoczesna aplikacja webowa stworzona specjalnie dla dowódców Ochotniczych Straży Pożarnych. Aplikacja wspiera proces zarządzania działaniami ratowniczymi poprzez:

- ✅ **Inteligentne checklisty** - dostosowane do typu zdarzenia (pożary, wypadki, zagrożenia chemiczne)
- ⏱️ **Śledzenie czasu** - automatyczne mierzenie czasu kluczowych etapów akcji
- 📊 **Monitoring postępu** - wizualizacja wykonanych i pozostałych zadań
- 💾 **Działanie offline** - pełna funkcjonalność bez dostępu do internetu (PWA)
- 📱 **Responsywność** - działa na telefonach, tabletach i komputerach
- 🔒 **Lokalne przechowywanie** - dane zapisywane bezpiecznie w przeglądarce

## 🔀 Git Workflow

Projekt używa **Git Flow** z dwoma głównymi branchami:

- **`main`** - Produkcja (stabilny, wdrożony na Vercel)
- **`dev`** - Development (rozwój, testowanie)

📖 **[Pełna dokumentacja Git Workflow →](GIT_WORKFLOW.md)**

### Quick Start dla developerów:

```bash
# Nowa funkcja
git checkout dev
git pull origin dev
git checkout -b feature/nazwa-funkcji
# ... praca ...
git commit -m "feat: opis"
git push -u origin feature/nazwa-funkcji
# Stwórz PR: feature/nazwa-funkcji → dev

# Release do produkcji
# Stwórz PR: dev → main na GitHub
```

## 🎯 Główne funkcjonalności

### 1. Typy zdarzeń

Aplikacja obsługuje następujące typy zdarzeń:

- **Pożary**
  - Pożar budynku
  - Pożar lasu
  - Pożar pojazdu
  - Pożar na otwartej przestrzeni

- **Wypadki**
  - Wypadek drogowy
  - Wypadek przemysłowy

- **Zagrożenia**
  - Zagrożenie chemiczne
  - Zagrożenie ekologiczne

- **Ratownictwo**
  - Ratownictwo wodne
  - Ratownictwo wysokościowe
  - Ratownictwo techniczne

- **Klęski żywiołowe**
  - Powódź
  - Burza/Wichura

### 2. Checklisty proceduralne

Dla każdego typu zdarzenia dostępne są szczegółowe checklisty obejmujące:

#### Pożar budynku
- Przyjazd i rozpoznanie
- Ratownictwo
- Działania gaśnicze
- Bezpieczeństwo
- Zakończenie działań

#### Wypadek drogowy
- Przyjazd i zabezpieczenie
- Ratownictwo medyczne (Triage)
- Działania techniczne
- Ochrona środowiska
- Zakończenie

#### Zagrożenie chemiczne
- Przyjazd i rozpoznanie (z wiatru!)
- Izolacja i ewakuacja
- Wyznaczenie stref (czerwona, żółta, zielona)
- Działania interwencyjne
- Dekontaminacja
- Zakończenie

### 3. Zarządzanie zdarzeniem

- **Statusy akcji**: Zadysponowano → W drodze → Na miejscu → W trakcie → Opanowane → Zakończone
- **Priorytety**: Niski, Średni, Wysoki, Krytyczny
- **Czasy kluczowe**: Automatyczne zapisywanie czasów zgłoszenia, wyjazdu, przyjazdu, opanowania, zakończenia

### 4. Moduły dodatkowe (w budowie)

- 👥 **Poszkodowani** - segregacja medyczna, stan poszkodowanych
- 🚒 **Siły i środki** - zarządzanie pojazdami, sprzętem, personelem
- 📝 **Notatki** - obserwacje, decyzje, komunikacja
- 📸 **Zdjęcia** - dokumentacja fotograficzna zdarzenia

## 🚀 Instalacja i uruchomienie

### Wymagania

- Node.js 18+
- npm lub yarn

### Kroki instalacji (development lokalny)

1. **Sklonuj repozytorium**
```bash
git clone <repository-url>
cd osp-commander
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Uruchom serwer deweloperski**
```bash
# HTTP (bez geolokalizacji):
npm run dev

# HTTPS (z geolokalizacją):
npm run dev:https
```

4. **Otwórz w przeglądarce**
```
http://localhost:3000
# lub
https://localhost:3000
```

### 🌐 Wdrożenie na Vercel (ZALECANE)

**Najłatwiejszy sposób na udostępnienie aplikacji strażakom!**

#### Quick Start (5 minut):
```bash
# 1. Wypchnij kod na GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TWOJA-NAZWA/osp-commander.git
git push -u origin main

# 2. Wejdź na https://vercel.com/signup
# 3. Zaloguj się przez GitHub
# 4. Kliknij "Add New..." → "Project"
# 5. Wybierz repozytorium i kliknij "Deploy"
# 6. Gotowe! 🎉
```

**Szczegółowa instrukcja:** [VERCEL-QUICKSTART.md](./VERCEL-QUICKSTART.md)

**Pełna dokumentacja wdrożenia:** [DEPLOYMENT.md](./DEPLOYMENT.md)

### Budowanie wersji produkcyjnej (lokalnie)

```bash
npm run build
npm start
```

## 📱 Instalacja jako PWA

Aplikacja może być zainstalowana na urządzeniu mobilnym jako aplikacja natywna:

1. Otwórz aplikację w przeglądarce mobilnej (Chrome, Safari)
2. Kliknij "Dodaj do ekranu głównego"
3. Aplikacja będzie dostępna offline!

## 🛠️ Technologie

- **Next.js 16** - Framework React
- **TypeScript** - Bezpieczeństwo typów
- **Tailwind CSS** - Stylowanie
- **Zustand** - Zarządzanie stanem
- **Lucide React** - Ikony
- **date-fns** - Obsługa dat
- **PWA** - Działanie offline

## 📖 Jak używać

### 1. Rozpoczęcie nowej akcji

1. Wybierz typ zdarzenia z ekranu głównego
2. Wypełnij podstawowe informacje:
   - Tytuł zdarzenia
   - Lokalizacja
   - Dowódca akcji
3. Kliknij "Rozpocznij akcję"

### 2. Praca z checklistą

- **Rozpocznij** - oznacz krok jako "W trakcie"
- **Zakończ** - oznacz krok jako wykonany (opcjonalnie dodaj notatkę)
- **Pomiń** - pomiń krok z podaniem powodu

### 3. Zmiana statusu akcji

Użyj przycisków w nagłówku aby zmienić status:
- **Wyjazd** - zmiana statusu na "W drodze"
- **Przyjazd na miejsce** - automatyczne zapisanie czasu przyjazdu
- **Opanowano** - zmiana statusu na "Opanowane"
- **Zakończ działania** - zakończenie akcji

### 4. Monitorowanie postępu

- Pasek postępu pokazuje procent wykonanych zadań
- Liczniki przy kategoriach pokazują wykonane/wszystkie kroki
- Czasy kluczowe widoczne w stopce nagłówka

## 🎨 Kolory priorytetów

- 🔴 **Krytyczny** - czerwony (zadania wymagające natychmiastowej uwagi)
- 🟠 **Wysoki** - pomarańczowy (ważne zadania)
- 🟡 **Średni** - żółty (standardowe zadania)
- 🔵 **Niski** - niebieski (zadania o niskim priorytecie)

## 🔐 Bezpieczeństwo danych

- Wszystkie dane przechowywane lokalnie w przeglądarce
- Brak wysyłania danych do zewnętrznych serwerów
- Dane zachowane nawet po zamknięciu przeglądarki
- Możliwość eksportu danych (funkcja w przygotowaniu)

## 🚧 Roadmapa

- [ ] Moduł poszkodowanych z segregacją medyczną
- [ ] Moduł sił i środków
- [ ] Moduł notatek z kategoryzacją
- [ ] Moduł zdjęć z możliwością robienia zdjęć
- [ ] Eksport raportów do PDF
- [ ] Synchronizacja między urządzeniami
- [ ] Szablony własne checklisty
- [ ] Baza wiedzy (procedury, parametry)
- [ ] Kalkulator sił i środków
- [ ] Wizualizacja stref zagrożenia
- [ ] Integracja z mapami
- [ ] Historia zdarzeń i statystyki

## 📄 Licencja

MIT License - możesz swobodnie używać, modyfikować i dystrybuować

## 👥 Autorzy

Stworzone z myślą o strażakach OSP w Polsce 🇵🇱

## 🤝 Wkład

Sugestie i pull requesty są mile widziane!

## 📞 Kontakt

W razie pytań lub sugestii, otwórz Issue na GitHubie.

---

**Pamiętaj: Ta aplikacja jest narzędziem wspomagającym. Zawsze kieruj się obowiązującymi procedurami i swoim doświadczeniem!**

🚒 **Bądź bezpieczny!** 🚒
