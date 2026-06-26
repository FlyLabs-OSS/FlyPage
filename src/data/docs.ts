export interface DocItem {
  id: string;
  title: string;
  path: string;
  icon: 'Book' | 'Palette' | 'FileText' | 'Component' | 'Zap';
  category?: string;
}

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
  },
  {
    id: 'customize',
    title: 'Customize',
    path: '/docs/customize.md',
    icon: 'Palette',
    category: 'Guides'
  },
  {
    id: 'components',
    title: 'Components',
    path: '/docs/components.md',
    icon: 'Component',
    category: 'Reference'
  }
];
