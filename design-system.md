# 🎨 OSP Commander Design System

## 1. Color Palette

### Primary Colors (Strażackie)
```css
--fire-red-50:  #FEF2F2;   /* Backgrounds, hover states */
--fire-red-100: #FEE2E2;   /* Light backgrounds */
--fire-red-500: #EF4444;   /* Primary actions */
--fire-red-600: #DC2626;   /* Primary hover */
--fire-red-700: #B91C1C;   /* Active states */
```

### Neutral Colors (Minimalistyczne)
```css
--gray-50:  #F9FAFB;   /* Page background */
--gray-100: #F3F4F6;   /* Card backgrounds */
--gray-200: #E5E7EB;   /* Borders */
--gray-400: #9CA3AF;   /* Disabled text */
--gray-600: #4B5563;   /* Secondary text */
--gray-900: #111827;   /* Primary text */
```

### Semantic Colors
```css
--success: #10B981;    /* Green - completed */
--warning: #F59E0B;    /* Orange - in progress */
--error:   #EF4444;    /* Red - critical */
--info:    #3B82F6;    /* Blue - information */
```

---

## 2. Typography

### Font Family
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes (Type Scale - 1.25 ratio)
```css
--text-xs:   0.75rem;   /* 12px - labels, badges */
--text-sm:   0.875rem;  /* 14px - body small */
--text-base: 1rem;      /* 16px - body */
--text-lg:   1.125rem;  /* 18px - lead text */
--text-xl:   1.25rem;   /* 20px - h4 */
--text-2xl:  1.5rem;    /* 24px - h3 */
--text-3xl:  1.875rem;  /* 30px - h2 */
--text-4xl:  2.25rem;   /* 36px - h1 */
--text-5xl:  3rem;      /* 48px - hero */
```

### Font Weights
```css
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
```

### Line Heights
```css
--leading-tight:  1.25;   /* Headings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.75;  /* Long-form content */
```

---

## 3. Spacing (8px base unit)

```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

---

## 4. Border Radius

```css
--radius-sm:   0.25rem;  /* 4px - small elements */
--radius-md:   0.5rem;   /* 8px - buttons, inputs */
--radius-lg:   0.75rem;  /* 12px - cards */
--radius-xl:   1rem;     /* 16px - large cards */
--radius-full: 9999px;   /* Pills, avatars */
```

---

## 5. Shadows (Elevation)

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 6. Components

### Button Variants

#### Primary (Fire Red)
```
Background: --fire-red-600
Text: white
Hover: --fire-red-700
Active: --fire-red-800
Shadow: --shadow-sm
Padding: 12px 24px (md)
Border-radius: --radius-md
```

#### Secondary (Outline)
```
Background: transparent
Border: 1px solid --gray-200
Text: --gray-900
Hover: --gray-50
```

#### Ghost
```
Background: transparent
Text: --gray-600
Hover: --gray-100
```

### Card
```
Background: white
Border: 1px solid --gray-200
Border-radius: --radius-lg
Padding: 24px
Shadow: --shadow-sm
Hover: --shadow-md (transition)
```

### Input
```
Background: white
Border: 1px solid --gray-200
Border-radius: --radius-md
Padding: 10px 14px
Focus: border --fire-red-500, ring 3px --fire-red-50
```

---

## 7. Layout Grid

### Container
```
Max-width: 1280px (xl)
Padding: 16px (mobile), 24px (tablet), 32px (desktop)
Margin: 0 auto
```

### Breakpoints
```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (laptop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)
```

### Grid
```
Columns: 12
Gap: 24px (desktop), 16px (mobile)
```

---

## 8. Iconography

### Icon Sizes
```
xs: 16px
sm: 20px
md: 24px
lg: 32px
xl: 48px
```

### Icon Style
- Lucide React (consistent stroke width: 2px)
- Rounded corners
- Minimalist, clean lines

---

## 9. Animation & Transitions

### Duration
```
--duration-fast:   150ms;
--duration-normal: 250ms;
--duration-slow:   350ms;
```

### Easing
```
--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Transitions
```css
/* Hover states */
transition: all 150ms ease-out;

/* Color changes */
transition: color 150ms ease-out, background-color 150ms ease-out;

/* Transform */
transition: transform 250ms ease-out;
```

---

## 10. Accessibility

### Focus States
```
outline: 2px solid --fire-red-500;
outline-offset: 2px;
```

### Contrast Ratios (WCAG AA)
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Touch Targets
- Minimum: 44x44px (mobile)
- Recommended: 48x48px

---

## 11. Component Patterns

### Hero Section
```
Height: 60vh (min 400px, max 600px)
Alignment: center
Padding: 48px 24px
Background: gradient or solid
```

### Module Card
```
Width: 100% (mobile), 33.33% (desktop)
Aspect ratio: 1:1 or 4:3
Padding: 32px
Hover: lift effect (translateY -4px, shadow-lg)
```

### Navigation
```
Height: 64px
Background: white
Border-bottom: 1px solid --gray-200
Sticky: top 0
Z-index: 50
```

---

## 12. Content Guidelines

### Headings
- H1: 1 per page, describes main purpose
- H2: Section headings
- H3: Subsection headings
- H4+: Rare, only for deep hierarchy

### Body Text
- Max width: 65ch (optimal readability)
- Line height: 1.5-1.75
- Paragraph spacing: 1em

### Microcopy
- Action-oriented ("Rozpocznij akcję" not "Kliknij tutaj")
- Clear, concise
- Polish language, professional tone

---

## 13. Responsive Behavior

### Mobile First
1. Design for 375px first (iPhone SE)
2. Scale up to tablet (768px)
3. Optimize for desktop (1280px+)

### Breakpoint Strategy
```
Mobile:  Stack vertically, full width
Tablet:  2 columns, larger touch targets
Desktop: 3+ columns, hover states, keyboard shortcuts
```

---

## 14. Performance

### Image Optimization
- WebP format
- Lazy loading
- Responsive images (srcset)
- Max size: 200KB

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports for heavy components

### Loading States
- Skeleton screens (not spinners)
- Progressive enhancement
- Optimistic UI updates

---

## 15. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #DC2626;
  --color-primary-hover: #B91C1C;
  --color-text: #111827;
  --color-text-secondary: #4B5563;
  --color-background: #FFFFFF;
  --color-background-alt: #F9FAFB;
  --color-border: #E5E7EB;
  
  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  
  /* Spacing */
  --space-unit: 8px;
  --space-xs: calc(var(--space-unit) * 1);
  --space-sm: calc(var(--space-unit) * 2);
  --space-md: calc(var(--space-unit) * 3);
  --space-lg: calc(var(--space-unit) * 4);
  --space-xl: calc(var(--space-unit) * 6);
  
  /* Layout */
  --container-max: 1280px;
  --nav-height: 64px;
  
  /* Effects */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Animation */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
}
```

---

**Version:** 1.0.0  
**Last updated:** 2025-01-13  
**Status:** Active

