# Adding Pages

Learn how to expand your FlyPage documentation by adding new tabs and Markdown files.

## Create a Markdown File

Create a new `.md` file inside the `/public/docs/` directory.

For example, let's create a file named `/public/docs/my-new-page.md`:

```markdown
# My New Page

Welcome to my new page content!

You can write anything here using clean Markdown syntax.
```

## Register the Page

Open the data catalog file located at `/src/data/docs.ts` and append your new page configuration to the `docsMetadata` array:

```typescript
export const docsMetadata: DocItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    path: '/docs/getting-started.md',
    icon: 'Book'
  },
  {
    id: 'my-new-page',
    title: 'My New Page',
    path: '/docs/my-new-page.md',
    icon: 'FileText' // Choose from: 'Book', 'Palette', 'FileText', 'Component', 'Zap'
  }
];
```

## Verify Your Setup

Once saved, FlyPage automatically detects the database registration, fetches your file asynchronously from `/public/docs/my-new-page.md`, and compiles it seamlessly into your sidebar navigation.
