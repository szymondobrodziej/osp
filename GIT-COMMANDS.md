# 📝 Przydatne komendy Git - OSP Commander

## 🚀 Codzienne użycie (aktualizacje)

### Standardowy workflow:

```bash
# 1. Sprawdź status (jakie pliki zostały zmienione)
git status

# 2. Dodaj wszystkie zmienione pliki
git add .

# 3. Commituj z opisem zmian
git commit -m "Opis zmian, np: Poprawiono wyświetlanie mapy"

# 4. Wypchnij na GitHub (automatyczne wdrożenie na Vercel!)
git push
```

**To wszystko! Vercel automatycznie wdroży w 1-3 minuty!** 🎉

---

## 📋 Podstawowe komendy

### Sprawdzanie statusu:

```bash
# Zobacz jakie pliki zostały zmienione
git status

# Zobacz różnice w plikach
git diff

# Zobacz historię commitów
git log --oneline

# Zobacz ostatnie 5 commitów
git log --oneline -5
```

### Commitowanie zmian:

```bash
# Dodaj wszystkie pliki
git add .

# Dodaj konkretny plik
git add components/hydrant-map.tsx

# Commituj z wiadomością
git commit -m "Dodano mapę z hydrantami"

# Commituj z dłuższym opisem
git commit -m "Dodano mapę z hydrantami" -m "- 25 hydrantów w promieniu 2 km
- Automatyczna geolokalizacja
- Lista 4 najbliższych hydrantów"
```

### Wysyłanie zmian:

```bash
# Wypchnij na GitHub
git push

# Wypchnij konkretną gałąź
git push origin main

# Wymuś push (OSTROŻNIE! Nadpisuje historię)
git push --force
```

---

## 🔄 Pobieranie zmian

### Jeśli pracujesz z zespołem:

```bash
# Pobierz najnowsze zmiany z GitHub
git pull

# Pobierz zmiany bez mergowania
git fetch

# Zobacz co się zmieniło
git log origin/main..main
```

---

## 🌿 Praca z gałęziami (branches)

### Tworzenie i przełączanie:

```bash
# Utwórz nową gałąź
git branch feature/nowa-funkcja

# Przełącz się na gałąź
git checkout feature/nowa-funkcja

# Utwórz i przełącz się (skrót)
git checkout -b feature/nowa-funkcja

# Zobacz wszystkie gałęzie
git branch -a

# Usuń gałąź lokalnie
git branch -d feature/nowa-funkcja
```

### Mergowanie:

```bash
# Przełącz się na main
git checkout main

# Zmerguj gałąź
git merge feature/nowa-funkcja

# Wypchnij zmergowane zmiany
git push
```

---

## ⏪ Cofanie zmian

### Cofnij ostatni commit (zachowaj zmiany):

```bash
# Cofnij commit, ale zostaw pliki zmienione
git reset --soft HEAD~1

# Teraz możesz poprawić i commitować ponownie
git add .
git commit -m "Poprawiony commit"
```

### Cofnij ostatni commit (usuń zmiany):

```bash
# OSTROŻNIE! To usunie zmiany!
git reset --hard HEAD~1
```

### Cofnij zmiany w konkretnym pliku:

```bash
# Przywróć plik do ostatniego commita
git checkout -- components/hydrant-map.tsx

# Lub w nowszych wersjach Git:
git restore components/hydrant-map.tsx
```

### Cofnij zmiany we wszystkich plikach:

```bash
# OSTROŻNIE! To usunie wszystkie niezacommitowane zmiany!
git reset --hard HEAD
```

---

## 🏷️ Tagowanie wersji

### Tworzenie tagów (wersji):

```bash
# Utwórz tag dla wersji
git tag v1.0.0

# Utwórz tag z opisem
git tag -a v1.0.0 -m "Pierwsza wersja produkcyjna"

# Wypchnij tag na GitHub
git push origin v1.0.0

# Wypchnij wszystkie tagi
git push --tags

# Zobacz wszystkie tagi
git tag -l
```

---

## 🔍 Przydatne aliasy

### Dodaj do `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --decorate --all
    undo = reset --soft HEAD~1
```

### Użycie:

```bash
# Zamiast: git status
git st

# Zamiast: git checkout main
git co main

# Zamiast: git commit -m "message"
git ci -m "message"

# Zobacz ładną historię
git visual
```

---

## 🆘 Ratowanie w sytuacjach awaryjnych

### Zepsułeś coś i chcesz wrócić do działającej wersji:

```bash
# 1. Zobacz ostatnie commity
git log --oneline

# 2. Znajdź hash działającego commita (np. abc1234)
# 3. Wróć do tego commita
git reset --hard abc1234

# 4. Wymuś push (OSTROŻNIE!)
git push --force
```

### Przypadkowo usunąłeś plik:

```bash
# Przywróć usunięty plik
git checkout HEAD -- nazwa-pliku.tsx
```

### Chcesz zobaczyć co było w pliku w poprzednim commicie:

```bash
# Zobacz plik z poprzedniego commita
git show HEAD~1:components/hydrant-map.tsx
```

---

## 📊 Przydatne komendy do analizy

### Statystyki:

```bash
# Zobacz kto co zmienił w pliku
git blame components/hydrant-map.tsx

# Zobacz zmiany w konkretnym pliku
git log -p components/hydrant-map.tsx

# Zobacz statystyki commitów
git shortlog -sn

# Zobacz rozmiar repozytorium
git count-objects -vH
```

---

## 🎯 Najczęstsze scenariusze

### Scenariusz 1: Dodałem nową funkcję

```bash
git add .
git commit -m "Dodano moduł poszkodowanych"
git push
```

### Scenariusz 2: Poprawiłem błąd

```bash
git add .
git commit -m "Naprawiono błąd w wyświetlaniu mapy"
git push
```

### Scenariusz 3: Zaktualizowałem checklistę

```bash
git add data/checklist-templates.ts
git commit -m "Zaktualizowano checklistę pożaru budynku"
git push
```

### Scenariusz 4: Zmieniłem wiele plików

```bash
git add .
git commit -m "Refaktoryzacja komponentów mapy" -m "- Wydzielono HydrantMarker
- Dodano HydrantList
- Poprawiono responsywność"
git push
```

### Scenariusz 5: Chcę przetestować zmianę przed wdrożeniem

```bash
# Utwórz gałąź testową
git checkout -b test/nowa-funkcja

# Wprowadź zmiany
git add .
git commit -m "Testowa funkcja"
git push -u origin test/nowa-funkcja

# Vercel utworzy preview deployment!
# Przetestuj na URL: https://osp-commander-git-test-nowa-funkcja.vercel.app

# Jeśli działa, zmerguj do main:
git checkout main
git merge test/nowa-funkcja
git push
```

---

## 💡 Wskazówki

1. **Commituj często** - małe commity są łatwiejsze do cofnięcia
2. **Pisz jasne opisy** - "Naprawiono błąd" to za mało, napisz "Naprawiono błąd w wyświetlaniu hydrantów na mapie"
3. **Testuj lokalnie** - przed pushem sprawdź czy `npm run build` działa
4. **Używaj gałęzi** - dla większych zmian utwórz osobną gałąź
5. **Nie commituj wrażliwych danych** - hasła, klucze API itp.

---

## 🔗 Przydatne linki

- **Git dokumentacja**: https://git-scm.com/doc
- **GitHub dokumentacja**: https://docs.github.com
- **Git cheat sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Interaktywny tutorial**: https://learngitbranching.js.org

---

**Pamiętaj: Git to Twój przyjaciel! Nie bój się eksperymentować!** 🚀

**W razie wątpliwości: `git status` pokaże Ci co się dzieje!** 📊

