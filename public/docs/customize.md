# Customize Styling & Configuration

Learn how to customize the branding, visual appearance, and settings of your documentation portal.

## Simple Brand Customization (`/src/config.ts`)

For fast, powerful customization without rewriting layouts, modify fields in `/src/config.ts`:

```typescript
export const config = {
  // Customize the title/branding of your documentation portal
  docsTitle: 'FlyPage',

  // Custom brand Logo/Icon. Can be an emoji (e.g. '⚡', '🚀', '📖') or a URL path to an image file (e.g. '/logo.svg').
  // This value is automatically set as both the header logo and the browser tab favicon (emojis auto-convert to SVG)!
  logoUrl: '⚡',

  // Custom brand accent color (Hex prefix or any HTML/CSS color, e.g. '#6366f1', '#10b981')
  brandAccent: '#ffffff',

  // The GitHub repository containing your documentation
  gitHubRepo: 'https://github.com/FlyLabs-Dev/FlyPage',

  // The branch name used for direct GitHub editing
  branch: 'main',

  // Toggle to enable/disable the "Edit Page" button
  enableEditPage: true,
};
```

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

## Organizing with Categories

You can group your sidebar links into logical categories by adding a `category` string to your document items in `/src/data/docs.ts`:

```typescript
export const docsMetadata: DocItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    path: '/docs/getting-started.md',
    icon: 'Book',
    category: 'Introduction'
  },
  {
    id: 'adding-pages',
    title: 'Adding Pages',
    path: '/docs/adding-pages.md',
    icon: 'FileText',
    category: 'Guides'
  }
];
```

FlyPage will automatically group items by these labels and render stylish headers in the sidebar to keep your navigation organized as your documentation grows.

## Typography Pairings

We use clean, legible typographic pairings to maximize readability. If you want to configure different web fonts, import them via `@import url(...)` at the top of `/src/index.css` and map them to the system font variables:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono&display=swap');

@theme {
  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```
