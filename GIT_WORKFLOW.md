# 🔀 Git Workflow - OSP Commander

## Strategia branchy

```
main (produkcja)
  ↑
  └── dev (development)
       ↑
       └── feature/* (nowe funkcje)
       └── fix/* (poprawki)
       └── hotfix/* (pilne poprawki)
```

---

## 📋 **Branch Strategy**

### **`main` - Produkcja**
- ✅ Zawsze stabilny, gotowy do wdrożenia
- ✅ Tylko merge z `dev` przez Pull Request
- ✅ Każdy merge = nowa wersja (tag)
- ✅ Automatyczne wdrożenie na Vercel
- ❌ Nigdy nie commituj bezpośrednio do `main`

### **`dev` - Development**
- ✅ Główny branch rozwojowy
- ✅ Merge feature branches tutaj
- ✅ Testowanie przed merge do `main`
- ✅ Może być niestabilny
- ✅ Commituj tutaj podczas rozwoju

### **`feature/*` - Nowe funkcje**
- ✅ Branch dla każdej nowej funkcji
- ✅ Nazwa: `feature/nazwa-funkcji`
- ✅ Merge do `dev` przez PR
- ✅ Usuń po merge

### **`fix/*` - Poprawki**
- ✅ Branch dla bugfixów
- ✅ Nazwa: `fix/opis-problemu`
- ✅ Merge do `dev` przez PR
- ✅ Usuń po merge

### **`hotfix/*` - Pilne poprawki**
- ✅ Branch z `main` dla krytycznych bugów
- ✅ Nazwa: `hotfix/opis-problemu`
- ✅ Merge do `main` i `dev`
- ✅ Usuń po merge

---

## 🚀 **Workflow - Nowa funkcja**

### **1. Stwórz feature branch z `dev`:**
```bash
git checkout dev
git pull origin dev
git checkout -b feature/nazwa-funkcji
```

### **2. Pracuj nad funkcją:**
```bash
# Edytuj pliki
git add .
git commit -m "feat: opis zmian"
```

### **3. Push do remote:**
```bash
git push -u origin feature/nazwa-funkcji
```

### **4. Stwórz Pull Request:**
- Otwórz GitHub
- `feature/nazwa-funkcji` → `dev`
- Opisz zmiany
- Request review (opcjonalnie)

### **5. Merge do `dev`:**
```bash
# Po zatwierdzeniu PR
git checkout dev
git pull origin dev
git branch -d feature/nazwa-funkcji  # Usuń lokalny branch
git push origin --delete feature/nazwa-funkcji  # Usuń remote branch
```

---

## 🔧 **Workflow - Bugfix**

### **1. Stwórz fix branch z `dev`:**
```bash
git checkout dev
git pull origin dev
git checkout -b fix/opis-problemu
```

### **2. Napraw bug:**
```bash
# Edytuj pliki
git add .
git commit -m "fix: opis poprawki"
```

### **3. Push i PR:**
```bash
git push -u origin fix/opis-problemu
# Stwórz PR: fix/opis-problemu → dev
```

### **4. Merge i cleanup:**
```bash
git checkout dev
git pull origin dev
git branch -d fix/opis-problemu
```

---

## 🚨 **Workflow - Hotfix (produkcja)**

### **1. Stwórz hotfix branch z `main`:**
```bash
git checkout main
git pull origin main
git checkout -b hotfix/krytyczny-bug
```

### **2. Napraw bug:**
```bash
# Edytuj pliki
git add .
git commit -m "hotfix: opis pilnej poprawki"
```

### **3. Merge do `main`:**
```bash
git checkout main
git merge hotfix/krytyczny-bug
git tag -a v1.0.1 -m "Hotfix: opis"
git push origin main --tags
```

### **4. Merge do `dev` (sync):**
```bash
git checkout dev
git merge hotfix/krytyczny-bug
git push origin dev
```

### **5. Cleanup:**
```bash
git branch -d hotfix/krytyczny-bug
```

---

## 📦 **Workflow - Release (dev → main)**

### **1. Upewnij się że `dev` jest stabilny:**
```bash
git checkout dev
git pull origin dev
npm run build  # Test build
npm run test   # Run tests (jeśli są)
```

### **2. Stwórz Pull Request:**
- GitHub: `dev` → `main`
- Tytuł: `Release v1.x.x`
- Opisz wszystkie zmiany od ostatniego release

### **3. Review i merge:**
```bash
# Po zatwierdzeniu PR
git checkout main
git pull origin main
```

### **4. Tag wersji:**
```bash
git tag -a v1.1.0 -m "Release 1.1.0: opis zmian"
git push origin main --tags
```

### **5. Sync `dev` z `main`:**
```bash
git checkout dev
git merge main
git push origin dev
```

---

## 📝 **Commit Message Convention**

### **Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Types:**
- `feat:` - nowa funkcja
- `fix:` - poprawka buga
- `docs:` - dokumentacja
- `style:` - formatowanie, brak zmian w kodzie
- `refactor:` - refaktoryzacja kodu
- `perf:` - optymalizacja wydajności
- `test:` - testy
- `chore:` - maintenance, dependencies
- `ci:` - CI/CD
- `build:` - build system

### **Przykłady:**
```bash
feat(landing): dodano hero section z CTA
fix(navbar): naprawiono mobile menu overflow
docs(readme): zaktualizowano instrukcję instalacji
refactor(components): wydzielono ModuleCard do osobnego pliku
perf(images): zoptymalizowano lazy loading
```

---

## 🔍 **Przydatne komendy**

### **Sprawdź status:**
```bash
git status
git branch -a  # Wszystkie branche
git log --oneline --graph --all  # Historia
```

### **Przełącz branch:**
```bash
git checkout dev
git checkout main
git checkout -b feature/nowa-funkcja  # Stwórz i przełącz
```

### **Aktualizuj branch:**
```bash
git pull origin dev
git fetch --all  # Pobierz wszystkie zmiany
```

### **Cofnij zmiany:**
```bash
git reset --hard HEAD  # Cofnij wszystkie uncommitted changes
git reset --soft HEAD~1  # Cofnij ostatni commit (zachowaj zmiany)
git revert <commit-hash>  # Cofnij konkretny commit
```

### **Stash (schowaj zmiany):**
```bash
git stash  # Schowaj zmiany
git stash pop  # Przywróć zmiany
git stash list  # Lista schowanych zmian
```

### **Cleanup:**
```bash
git branch -d feature/nazwa  # Usuń lokalny branch
git push origin --delete feature/nazwa  # Usuń remote branch
git fetch --prune  # Usuń nieistniejące remote branches
```

---

## 🎯 **Best Practices**

### **DO:**
- ✅ Commituj często, małe zmiany
- ✅ Pisz opisowe commit messages
- ✅ Pull przed push (zawsze aktualizuj)
- ✅ Testuj przed merge do `main`
- ✅ Używaj Pull Requests
- ✅ Review kodu przed merge
- ✅ Taguj wersje (semantic versioning)
- ✅ Usuń zmergowane branche

### **DON'T:**
- ❌ Nie commituj bezpośrednio do `main`
- ❌ Nie push force do `main` lub `dev`
- ❌ Nie commituj node_modules, .env
- ❌ Nie merge bez testów
- ❌ Nie używaj `git add .` bez sprawdzenia
- ❌ Nie commituj broken code do `dev`
- ❌ Nie zostawiaj nieużywanych branchy

---

## 🏷️ **Semantic Versioning**

### **Format:** `MAJOR.MINOR.PATCH`

```
v1.2.3
│ │ │
│ │ └─ PATCH: bugfixy, małe poprawki
│ └─── MINOR: nowe funkcje (backward compatible)
└───── MAJOR: breaking changes
```

### **Przykłady:**
- `v1.0.0` - Initial release
- `v1.1.0` - Dodano landing page
- `v1.1.1` - Poprawiono navbar bug
- `v2.0.0` - Przepisano na TypeScript (breaking)

---

## 📊 **Current Branch Status**

```
main (produkcja)
├── v1.0.0 - Initial release
├── Roadmap
├── Landing page
└── Design system

dev (development)
└── (sync z main)
```

---

## 🔄 **Quick Reference**

### **Codzienne workflow:**
```bash
# Rano
git checkout dev
git pull origin dev

# Nowa funkcja
git checkout -b feature/nazwa
# ... praca ...
git add .
git commit -m "feat: opis"
git push -u origin feature/nazwa
# Stwórz PR na GitHub

# Po merge
git checkout dev
git pull origin dev
git branch -d feature/nazwa
```

### **Release do produkcji:**
```bash
# Stwórz PR: dev → main na GitHub
# Po merge:
git checkout main
git pull origin main
git tag -a v1.x.x -m "Release notes"
git push origin main --tags
git checkout dev
git merge main
git push origin dev
```

---

**Ostatnia aktualizacja:** 2025-01-13  
**Wersja:** 1.0.0  
**Status:** Active

