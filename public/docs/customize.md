# Customize Styling

Learn how to customize the visual appearance, styling, and color schemes of your documentation site.

## Customizing Colors & Theme

Since the site uses modern Tailwind CSS, you can customize the color theme directly in the CSS configuration. Open the global CSS entry point at `/src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary-50: hsl(210 100% 98%);
  --color-primary-500: hsl(217.2 91.2% 59.8%);
  --color-primary-900: hsl(222.2 47.4% 11.2%);
}
```

By adjusting the CSS variables inside the `@theme` block, you can quickly repaint the site with your own brand colors.

## Navigational Icons

Each documentation item in `/src/data/docs.ts` can use a custom icon. The site imports these dynamically from the modern `lucide-react` library. You can choose from standard icons like:

- `Book` (Default guidelines)
- `FileText` (General text documents)
- `Palette` (Styling & Design)
- `Component` (Components & UI)
- `Zap` (Quick start, deployment, energy)
- `Settings` (Configuration options)

To swap an icon, simply assign its String literal name to the `icon` property of your document entry.

## Typography Pairings

We use clean, legible typographic pairings to maximize readability. If you want to configure different web fonts, import them via `@import url(...)` at the top of `/src/index.css` and map them to the system font variables:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono&display=swap');

@theme
  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```
