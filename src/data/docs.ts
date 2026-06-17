export interface DocItem {
  id: string;
  title: string;
  path: string;
  icon: 'Book' | 'Palette' | 'FileText' | 'Component' | 'Zap';
}

export const docsMetadata: DocItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    path: '/docs/getting-started.md',
    icon: 'Book'
  },
  {
    id: 'adding-pages',
    title: 'Adding Pages',
    path: '/docs/adding-pages.md',
    icon: 'FileText'
  },
  {
    id: 'customize',
    title: 'Customize',
    path: '/docs/customize.md',
    icon: 'Palette'
  },
  {
    id: 'components',
    title: 'Components',
    path: '/docs/components.md',
    icon: 'Component'
  }
];
