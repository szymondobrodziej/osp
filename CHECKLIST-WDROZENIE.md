# ✅ Checklist wdrożenia OSP Commander na Vercel

Wydrukuj tę stronę i odznaczaj kolejne kroki! 📋

---

## 📦 Przygotowanie (jednorazowo)

- [ ] **Zainstalowano Node.js** (https://nodejs.org)
- [ ] **Zainstalowano Git** (https://git-scm.com)
- [ ] **Utworzono konto GitHub** (https://github.com/signup)
- [ ] **Utworzono konto Vercel** (https://vercel.com/signup)
- [ ] **Połączono Vercel z GitHubem** (podczas rejestracji)

---

## 🚀 Pierwsze wdrożenie (jednorazowo)

### Krok 1: Przygotuj projekt

- [ ] Otwórz terminal w folderze `osp-commander`
- [ ] Uruchom: `npm install`
- [ ] Uruchom: `npm run build`
- [ ] ✅ Build zakończony sukcesem (brak błędów)

### Krok 2: Wypchnij na GitHub

- [ ] Uruchom: `git init`
- [ ] Uruchom: `git add .`
- [ ] Uruchom: `git commit -m "Initial commit"`
- [ ] Utwórz repozytorium na GitHub: https://github.com/new
- [ ] Skopiuj URL repozytorium (np. `https://github.com/TWOJA-NAZWA/osp-commander.git`)
- [ ] Uruchom: `git remote add origin URL-REPOZYTORIUM`
- [ ] Uruchom: `git push -u origin main`
- [ ] ✅ Kod jest na GitHubie

### Krok 3: Wdróż na Vercel

- [ ] Otwórz: https://vercel.com/dashboard
- [ ] Kliknij: **"Add New..."** → **"Project"**
- [ ] Znajdź repozytorium `osp-commander`
- [ ] Kliknij: **"Import"**
- [ ] Sprawdź ustawienia:
  - [ ] Framework: **Next.js** (auto-detect)
  - [ ] Root Directory: puste lub `osp-commander`
  - [ ] Build Command: `npm run build`
- [ ] Kliknij: **"Deploy"**
- [ ] Poczekaj 1-3 minuty
- [ ] ✅ Wdrożenie zakończone sukcesem!

### Krok 4: Przetestuj aplikację

- [ ] Otwórz URL Vercel (np. `https://osp-commander.vercel.app`)
- [ ] Sprawdź czy strona się ładuje
- [ ] Kliknij "Pożar budynku"
- [ ] Sprawdź czy geolokalizacja działa (zaakceptuj uprawnienia)
- [ ] Sprawdź czy mapa się wyświetla
- [ ] Sprawdź czy hydranty są widoczne
- [ ] ✅ Wszystko działa!

---

## 🔄 Aktualizacje (codzienne użycie)

### Za każdym razem gdy wprowadzasz zmiany:

- [ ] Wprowadź zmiany w kodzie (edytuj pliki)
- [ ] Zapisz pliki
- [ ] Otwórz terminal w folderze `osp-commander`
- [ ] Uruchom: `git add .`
- [ ] Uruchom: `git commit -m "Opis zmian"`
- [ ] Uruchom: `git push`
- [ ] Poczekaj 1-3 minuty
- [ ] Odśwież stronę na Vercel
- [ ] ✅ Zmiany wdrożone!

---

## 📱 Udostępnianie strażakom

- [ ] Skopiuj URL aplikacji (np. `https://osp-commander.vercel.app`)
- [ ] Wyślij link strażakom (SMS, email, WhatsApp)
- [ ] Poinformuj że mogą:
  - [ ] Otworzyć w przeglądarce
  - [ ] Dodać do ekranu głównego (PWA)
  - [ ] Używać offline
  - [ ] Używać geolokalizacji (zaakceptować uprawnienia)

---

## 🆘 Rozwiązywanie problemów

### Build Failed na Vercel?

- [ ] Sprawdź logi na Vercel (kliknij "View Build Logs")
- [ ] Uruchom lokalnie: `npm run build`
- [ ] Napraw błędy
- [ ] Commituj i push ponownie

### Geolokalizacja nie działa?

- [ ] Sprawdź czy użytkownik zaakceptował uprawnienia
- [ ] Sprawdź czy strona używa HTTPS (Vercel automatycznie)
- [ ] Sprawdź logi w konsoli przeglądarki (F12)

### Stara wersja się ładuje?

- [ ] Wyczyść cache przeglądarki (Ctrl+Shift+Delete)
- [ ] Odśwież stronę (Ctrl+Shift+R)
- [ ] Sprawdź czy wdrożenie na Vercel się zakończyło

---

## 📊 Monitoring (opcjonalnie)

- [ ] Włącz Vercel Analytics (zakładka "Analytics")
- [ ] Włącz Speed Insights (zakładka "Speed Insights")
- [ ] Sprawdzaj statystyki użycia

---

## 🎯 Podsumowanie

### ✅ Gotowe gdy:

- [ ] Aplikacja działa na Vercel
- [ ] Geolokalizacja działa
- [ ] Mapa z hydrantami działa
- [ ] Strażacy mają link
- [ ] Wiesz jak robić aktualizacje (`git push`)

---

## 📚 Przydatne linki

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/TWOJA-NAZWA/osp-commander
- **Quick Start**: [VERCEL-QUICKSTART.md](./VERCEL-QUICKSTART.md)
- **Pełna dokumentacja**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Komendy Git**: [GIT-COMMANDS.md](./GIT-COMMANDS.md)

---

## 💡 Wskazówki

1. **Commituj często** - małe zmiany są łatwiejsze do zarządzania
2. **Testuj lokalnie** - przed pushem uruchom `npm run build`
3. **Pisz jasne opisy** - w commitach opisuj co zmieniłeś
4. **Sprawdzaj logi** - jeśli coś nie działa, sprawdź logi na Vercel
5. **Pytaj o pomoc** - otwórz Issue na GitHubie jeśli masz problem

---

**Data pierwszego wdrożenia:** _______________

**URL aplikacji:** _______________

**Osoba odpowiedzialna:** _______________

**Kontakt:** _______________

---

**Powodzenia! 🚒🚀**

