import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Search, Copy, Check, FileCode, Terminal, Cpu, FileJson, Hash, Braces, 
  Info, AlertTriangle, AlertCircle, CheckCircle2,
  Book, Palette, FileText, Component, Zap,
  ChevronLeft, ChevronRight, ChevronDown, Edit3, Eye, MoreHorizontal,
  Command, Clock
} from 'lucide-react';
import { docsMetadata } from './data/docs';
import { config } from './config';
import './App.css';

const getLanguageIcon = (lang: string) => {
  const language = lang.toLowerCase();
  if (['bash', 'sh', 'shell', 'zsh'].includes(language)) return <Terminal size={14} />;
  if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(language)) return <FileCode size={14} />;
  if (['json'].includes(language)) return <FileJson size={14} />;
  if (['css', 'scss', 'less'].includes(language)) return <Braces size={14} />;
  if (['html', 'xml', 'svg'].includes(language)) return <FileCode size={14} />;
  if (['python', 'py'].includes(language)) return <Hash size={14} />;
  if (['c', 'cpp', 'rust', 'go', 'java'].includes(language)) return <Cpu size={14} />;
  return <FileCode size={14} />;
};

const getTabIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Book': return <Book size={18} />;
    case 'Palette': return <Palette size={18} />;
    case 'FileText': return <FileText size={18} />;
    case 'Component': return <Component size={18} />;
    case 'Zap': return <Zap size={18} />;
    default: return <Book size={18} />;
  }
};

const generateId = (content: string) => {
  return content
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Supported translation languages
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const uiTranslations: Record<string, Record<string, string>> = {
  en: {
    onThisPage: "On this page",
    copyPage: "Copy Page",
    editPage: "Edit Page",
    viewMarkdown: "View Markdown",
    searchDocs: "Search Documentation",
    searchPlaceholder: "Search",
    typeToSearch: "Type to search case-insensitive text matches across all documentation chapters.",
    noResults: "No matching sentences or text found for",
    snippetMatch: "Snippet Match",
    copied: "Copied!",
    translating: "Translating content on the fly...",
    selectLang: "Select Language",
    backToTop: "Back to top",
    next: "Next",
    prev: "Previous",
    githubRepo: "View GitHub"
  },
  es: {
    onThisPage: "En esta página",
    copyPage: "Copiar página",
    editPage: "Editar página",
    viewMarkdown: "Ver Markdown",
    searchDocs: "Buscar documentación",
    searchPlaceholder: "Buscar",
    typeToSearch: "Escribe para buscar coincidencias de texto en todos los capítulos de la documentación.",
    noResults: "No se encontraron frases o textos que coincidan con",
    snippetMatch: "Fila coincidente",
    copied: "¡Copiado!",
    translating: "Traduciendo contenido al vuelo...",
    selectLang: "Seleccionar idioma",
    backToTop: "Volver arriba",
    next: "Siguiente",
    prev: "Anterior",
    githubRepo: "Ver GitHub"
  },
  fr: {
    onThisPage: "Sur cette page",
    copyPage: "Copier la page",
    editPage: "Modifier la page",
    viewMarkdown: "Voir le Markdown",
    searchDocs: "Rechercher dans la doc",
    searchPlaceholder: "Rechercher",
    typeToSearch: "Tapez pour rechercher des correspondances de texte dans tous les chapitres.",
    noResults: "Aucun résultat trouvé pour",
    snippetMatch: "Extrait correspondant",
    copied: "Copié !",
    translating: "Traduction du contenu à la volée...",
    selectLang: "Choisir la langue",
    backToTop: "Retour en haut",
    next: "Suivant",
    prev: "Précédent",
    githubRepo: "Voir GitHub"
  },
  de: {
    onThisPage: "Auf dieser Seite",
    copyPage: "Seite kopieren",
    editPage: "Seite bearbeiten",
    viewMarkdown: "Markdown anzeigen",
    searchDocs: "Dokumentation durchsuchen",
    searchPlaceholder: "Suchen",
    typeToSearch: "Tippen Sie, um textuelle Übereinstimmungen in allen Kapiteln zu suchen.",
    noResults: "Keine Übereinstimmungen gefunden für",
    snippetMatch: "Ausschnitt-Treffer",
    copied: "Kopiert!",
    translating: "Inhalte werden übersetzt...",
    selectLang: "Sprache wählen",
    backToTop: "Nach oben",
    next: "Weiter",
    prev: "Zurück",
    githubRepo: "GitHub anzeigen"
  },
  ja: {
    onThisPage: "このページ内",
    copyPage: "ページをコピー",
    editPage: "ページを編集",
    viewMarkdown: "Markdownを表示",
    searchDocs: "ドキュメントを検索",
    searchPlaceholder: "検索",
    typeToSearch: "入力して、すべてのドキュメントからテキストを検索します。",
    noResults: "一致するテキストが見つかりません:",
    snippetMatch: "一致したスニペット",
    copied: "コピーしました！",
    translating: "翻訳中...",
    selectLang: "言語を選択",
    backToTop: "トップへ戻る",
    next: "次へ",
    prev: "前へ",
    githubRepo: "GitHubで見る"
  },
  pt: {
    onThisPage: "Nesta página",
    copyPage: "Copiar página",
    editPage: "Editar página",
    viewMarkdown: "Ver Markdown",
    searchDocs: "Buscar documentação",
    searchPlaceholder: "Buscar",
    typeToSearch: "Digite para buscar correspondências de texto em todos os capítulos.",
    noResults: "Nenhum resultado encontrado para",
    snippetMatch: "Trecho correspondente",
    copied: "Copiado!",
    translating: "Traduzindo conteúdo dinamicamente...",
    selectLang: "Selecionar idioma",
    backToTop: "Voltar ao topo",
    next: "Próximo",
    prev: "Anterior",
    githubRepo: "Ver GitHub"
  },
  zh: {
    onThisPage: "本页目录",
    copyPage: "复制页面",
    editPage: "编辑页面",
    viewMarkdown: "查看 Markdown",
    searchDocs: "搜索文档",
    searchPlaceholder: "搜索",
    typeToSearch: "输入文字以在所有文档章节中进行不区分大小写的搜索。",
    noResults: "找不到匹配的内容：",
    snippetMatch: "片段匹配",
    copied: "已复制！",
    translating: "正在实时翻译网页...",
    selectLang: "选择语言",
    backToTop: "回到顶部",
    next: "下一页",
    prev: "上一页",
    githubRepo: "在 GitHub 查看"
  },
  hi: {
    onThisPage: "इस पृष्ठ पर",
    copyPage: "पृष्ठ कॉपी करें",
    editPage: "पृष्ठ संपादित करें",
    viewMarkdown: "मार्काडाउन देखें",
    searchDocs: "दस्तावेज़ खोजें",
    searchPlaceholder: "खोजें",
    typeToSearch: "सभी दस्तावेज़ अध्यायों में पाठ खोजने के लिए लिखना शुरू करें।",
    noResults: "इसके लिए कोई परिणाम नहीं मिला:",
    snippetMatch: "मैच स्निपेट",
    copied: "कॉपी किया गया!",
    translating: "तुरंत अनुवाद किया जा रहा है...",
    selectLang: "भाषा चुनें",
    backToTop: "ऊपर जाएं",
    next: "अगला",
    prev: "पिछला",
    githubRepo: "GitHub देखें"
  }
};

// Global translation caching store
const translationCache: Record<string, string> = {};

const callTranslationAPI = async (text: string, targetLang: string): Promise<string> => {
  if (!text || !text.trim()) return text;
  
  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  // Format for Goole API compatibility
  const apiLang = targetLang === 'zh' ? 'zh-CN' : targetLang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${apiLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Translation failed');
  }
  
  const data = await response.json();
  if (data && data[0]) {
    const parts = data[0].map((item: any) => item[0]).filter((val: any) => typeof val === 'string');
    const resultText = parts.join('');
    translationCache[cacheKey] = resultText;
    return resultText;
  }
  
  return text;
};

const translateMarkdown = async (mdText: string, targetLang: string): Promise<string> => {
  if (targetLang === 'en' || !mdText.trim()) return mdText;

  const cacheKey = `md:${targetLang}:${mdText.slice(0, 100)}:${mdText.length}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  const lines = mdText.split('\n');
  const processedLines: string[] = [];
  
  let inCodeBlock = false;
  let textBuffer: string[] = [];
  
  const flushTextBuffer = async () => {
    if (textBuffer.length === 0) return;
    const combinedText = textBuffer.join('\n');
    try {
      const translated = await callTranslationAPI(combinedText, targetLang);
      processedLines.push(translated);
    } catch (e) {
      processedLines.push(combinedText);
    }
    textBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith('```')) {
      await flushTextBuffer();
      inCodeBlock = !inCodeBlock;
      processedLines.push(line);
      continue;
    }
    
    if (inCodeBlock) {
      processedLines.push(line);
      continue;
    }

    if (line.trim() === '') {
      await flushTextBuffer();
      processedLines.push(line);
      continue;
    }

    // Header matches
    if (line.startsWith('#')) {
      await flushTextBuffer();
      const hashMatch = line.match(/^(#+)\s*(.*)/);
      if (hashMatch) {
        const hashes = hashMatch[1];
        const headerText = hashMatch[2];
        try {
          const translatedHeader = await callTranslationAPI(headerText, targetLang);
          processedLines.push(`${hashes} ${translatedHeader}`);
        } catch (e) {
          processedLines.push(line);
        }
      } else {
        processedLines.push(line);
      }
      continue;
    }

    // Markdown tables
    if (line.startsWith('|') && line.includes('---')) {
      await flushTextBuffer();
      processedLines.push(line);
      continue;
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      await flushTextBuffer();
      const cells = line.split('|');
      const translatedCells = await Promise.all(cells.map(async (cell, idx) => {
        if (idx === 0 || idx === cells.length - 1) return '';
        const trimmed = cell.trim();
        if (!trimmed || (trimmed.startsWith('`') && trimmed.endsWith('`')) || trimmed.includes('---')) {
          return cell;
        }
        
        try {
          const translated = await callTranslationAPI(trimmed, targetLang);
          return ` ${translated} `;
        } catch {
          return cell;
        }
      }));
      processedLines.push(translatedCells.join('|'));
      continue;
    }

    textBuffer.push(line);
  }
  
  await flushTextBuffer();
  const fullTranslatedOutput = processedLines.join('\n');
  translationCache[cacheKey] = fullTranslatedOutput;
  return fullTranslatedOutput;
};

const CodeBlock = ({ children, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    const code = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const isInline = !className?.includes('language-');
  const language = className ? className.replace('language-', '') : '';
  if (isInline) return <code>{children}</code>;
  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <div className="code-block-info">
          {getLanguageIcon(language)}
          <span className="language-label">{language}</span>
        </div>
        <button className={`copy-button ${copied ? 'success' : ''}`} onClick={copyToClipboard} title="Copy to clipboard">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre className={className}><code>{children}</code></pre>
    </div>
  );
};

const CustomBlockquote = ({ children }: any) => {
  const childrenArray = React.Children.toArray(children);
  let firstParagraph: any = childrenArray.find((child: any) => child.type === 'p');
  if (!firstParagraph) return <blockquote>{children}</blockquote>;
  const pChildren = React.Children.toArray(firstParagraph.props.children);
  const firstLine = pChildren[0];
  if (typeof firstLine === 'string' && firstLine.trim().startsWith('[!')) {
    const fullMatch = firstLine.match(/\[!(\w+)\](.*)/);
    if (fullMatch) {
      const type = fullMatch[1].toLowerCase();
      let resolvedType = type;
      if (type === 'note' || type === 'tip' || type === 'info') {
        resolvedType = 'info';
      } else if (type === 'warning' || type === 'danger' || type === 'error' || type === 'important') {
        resolvedType = 'warning';
      } else {
        return <blockquote>{children}</blockquote>;
      }

      const customDescription = fullMatch[2].trim();
      const icons: Record<string, any> = {
        info: <Info className="callout-icon" size={20} />,
        warning: <AlertTriangle className="callout-icon" size={20} />
      };

      const defaultDescriptions: Record<string, string> = {
        info: 'Information',
        note: 'Note',
        tip: 'Tip',
        warning: 'Warning',
        danger: 'Danger',
        error: 'Error',
        important: 'Important'
      };

      const lines = firstLine.split('\n');
      const remainingTextFromFirstLine = lines.slice(1).join('\n');

      let newPChildren: any[] = [];
      if (remainingTextFromFirstLine.trim() !== '') {
        newPChildren.push(remainingTextFromFirstLine);
      }
      newPChildren = [...newPChildren, ...pChildren.slice(1)];

      const modifiedParagraph = React.cloneElement(firstParagraph, { children: newPChildren });
      const otherChildren = childrenArray.filter(child => child !== firstParagraph);
      
      const showBody = newPChildren.length > 0 || otherChildren.length > 0;

      return (
        <div className={`callout ${resolvedType}`}>
          {icons[resolvedType] || icons.info}
          <div className="callout-content">
            <div className="callout-header">
              <span className="callout-description">
                {customDescription || defaultDescriptions[type] || defaultDescriptions[resolvedType] || 'Note'}
              </span>
            </div>
            {showBody && (
              <div className="callout-body">
                {newPChildren.length > 0 ? modifiedParagraph : null}
                {otherChildren}
              </div>
            )}
          </div>
        </div>
      );
    }
  }
  return <blockquote>{children}</blockquote>;
};

const HighlightText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="search-highlight-mark">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(docsMetadata[0].id);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPageCopied, setIsPageCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // On-the-fly client translation states
  const [selectedLang, setSelectedLang] = useState('en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [translatedTitles, setTranslatedTitles] = useState<Record<string, string>>({});
  
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Translation UI label lookup helper
  const t = (key: string): string => {
    return uiTranslations[selectedLang]?.[key] || uiTranslations.en[key] || '';
  };

  // Search Page Content State
  const [pagesContent, setPagesContent] = useState<Record<string, string>>({});
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => docsMetadata.findIndex(doc => doc.id === activeTab), [activeTab]);
  const activeMeta = docsMetadata[activeIndex] || docsMetadata[0];
  const prevDoc = activeIndex > 0 ? docsMetadata[activeIndex - 1] : null;
  const nextDoc = activeIndex < docsMetadata.length - 1 ? docsMetadata[activeIndex + 1] : null;

  // Dynamic reading time counter
  const readTime = useMemo(() => {
    const rawText = displayedContent || content;
    if (!rawText) return 0;
    const words = rawText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content, displayedContent]);

  useEffect(() => {
    setLoading(true);
    fetch(activeMeta.path)
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      });
  }, [activeMeta]);

  // Dynamic branding initialization (Document Title, Favicon, Accent Color)
  useEffect(() => {
    if (config.brandAccent) {
      document.documentElement.style.setProperty('--accent-color', config.brandAccent);
    }

    if (config.logoUrl) {
      let fvUrl = config.logoUrl;
      const emojiRegex = /\p{Emoji}/u;
      if (config.logoUrl.length <= 4 && emojiRegex.test(config.logoUrl)) {
        fvUrl = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%220.9em%22 font-size=%2290%22>${config.logoUrl}</text></svg>`;
      }
      
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = fvUrl;
    }
  }, []);

  // Sync document title with current page and site configuration
  useEffect(() => {
    if (config.docsTitle) {
      if (activeMeta && activeMeta.title) {
        document.title = `${activeMeta.title} | ${config.docsTitle}`;
      } else {
        document.title = config.docsTitle;
      }
    }
  }, [activeMeta]);

  // Handle on-the-fly Markdown document translating
  useEffect(() => {
    let active = true;
    
    if (selectedLang === 'en') {
      setDisplayedContent(content);
      setTranslating(false);
      return;
    }
    
    setTranslating(true);
    translateMarkdown(content, selectedLang)
      .then(translated => {
        if (active) {
          setDisplayedContent(translated);
          setTranslating(false);
        }
      })
      .catch(err => {
        console.error("Markdown translation error:", err);
        if (active) {
          setDisplayedContent(content);
          setTranslating(false);
        }
      });
      
    return () => {
      active = false;
    };
  }, [content, selectedLang]);

  // Synchronously translate navigation titles in the sidebar
  useEffect(() => {
    if (selectedLang === 'en') {
      setTranslatedTitles({});
      return;
    }
    
    let active = true;
    docsMetadata.forEach(async (doc) => {
      try {
        const trans = await callTranslationAPI(doc.title, selectedLang);
        if (active) {
          setTranslatedTitles(prev => ({ ...prev, [doc.id]: trans }));
        }
      } catch (e) {
        console.error("Sidebar title translation error:", e);
      }
    });
    
    return () => {
      active = false;
    };
  }, [selectedLang]);

  const filteredDocs = useMemo(() => 
    docsMetadata.filter(doc => {
      const parentTitle = translatedTitles[doc.id] || doc.title;
      return parentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    }),
  [searchQuery, translatedTitles]);

  const toc = useMemo(() => {
    const sourceText = displayedContent || content;
    const headings = sourceText.match(/^#{2,3} .+/gm) || [];
    return headings.map(heading => {
      const level = heading.startsWith('###') ? 3 : 2;
      const rawTitle = heading.replace(/^#{2,3} /, '');
      const cleanTitle = rawTitle.replace(/[*_~`]/g, '');
      const id = generateId(cleanTitle);
      return { id, title: cleanTitle, level };
    });
  }, [content, displayedContent]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentSection = null;
      for (const item of toc) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = item.id;
        } else if (element && element.offsetTop > scrollPosition) {
          break;
        }
      }
      if (currentSection !== activeSection) setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc, activeSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setIsLangDropdownOpen(false);
      }
      if (searchModalRef.current && !searchModalRef.current.contains(target)) {
        setIsSearchModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pre-fetch all documents on start for local client full-text search indexing
  useEffect(() => {
    docsMetadata.forEach(doc => {
      fetch(doc.path)
        .then(res => res.text())
        .then(text => {
          setPagesContent(prev => ({ ...prev, [doc.id]: text }));
        })
        .catch(err => console.error("Error pre-fetching page indices:", err));
    });
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleCopyPage = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsPageCopied(true);
      setTimeout(() => setIsPageCopied(false), 2000);
      setIsDropdownOpen(false);
    });
  };

  // Keyboard listening for Page Content Search Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setIsSearchModalOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus input on content search modal open
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSelectedSearchIndex(0);
    }
  }, [isSearchModalOpen]);

  // Full-text page search results generator
  const pageSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const results: Array<{
      id: string;
      docId: string;
      docTitle: string;
      docIcon: string;
      heading?: string;
      snippet: string;
    }> = [];
    
    const query = searchQuery.toLowerCase();
    
    Object.entries(pagesContent).forEach(([docId, text]) => {
      const doc = docsMetadata.find(d => d.id === docId);
      if (!doc) return;
      
      const lines = text.split('\n');
      let currentSection = '';
      
      lines.forEach((line, index) => {
        // Search and track section header levels
        if (line.startsWith('## ') || line.startsWith('### ')) {
          currentSection = line.replace(/^#{2,3}/, '').replace(/[*_`~]/g, '').trim();
        }
        
        // Skip root document level headers or pure code blocks to keep results extremely polished
        if (line.startsWith('#') || line.trim().startsWith('```') || line.trim() === '') return;
        
        const lineLower = line.toLowerCase();
        if (lineLower.includes(query)) {
          // Clean up styling highlights from within this snippet match
          const cleanLine = line
            .replace(/[*_`~#\[\]()>\-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanLine.length > 3) {
            results.push({
              id: `${docId}-${index}-${results.length}`,
              docId,
              docTitle: doc.title,
              docIcon: doc.icon,
              heading: currentSection || undefined,
              snippet: cleanLine
            });
          }
        }
      });
    });
    
    return results;
  }, [pagesContent, searchQuery]);

  // Clean index resets on page query change
  useEffect(() => {
    setSelectedSearchIndex(0);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev + 1) % pageSearchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev - 1 + pageSearchResults.length) % pageSearchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const match = pageSearchResults[selectedSearchIndex];
      if (match) {
        handleNavToSearchMatch(match);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchModalOpen(false);
    }
  };

  const handleNavToSearchMatch = (match: { docId: string; heading?: string }) => {
    setActiveTab(match.docId);
    setIsSearchModalOpen(false);
    
    // Smooth scroll navigation with minor render delay to secure focus states
    if (match.heading) {
      setTimeout(() => {
        const headingId = generateId(match.heading!);
        scrollToHeading(headingId);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {config.logoUrl && (
              (() => {
                const emojiRegex = /\p{Emoji}/u;
                const isEmoji = config.logoUrl.length <= 4 && emojiRegex.test(config.logoUrl);
                if (isEmoji) {
                  return <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{config.logoUrl}</span>;
                }
                return (
                  <img 
                    src={config.logoUrl} 
                    alt={`${config.docsTitle} logo`} 
                    style={{ height: '1.5rem', width: 'auto', objectFit: 'contain' }}
                    referrerPolicy="no-referrer"
                  />
                );
              })()
            )}
            <span>{config.docsTitle}</span>
          </a>
          
          {/* Elegant Dynamic Language Selector */}
          <div className="lang-selector-container" ref={langDropdownRef}>
            <button 
              className="lang-selector-trigger"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              title={t('selectLang')}
            >
              <span>{LANGUAGES.find(l => l.code === selectedLang)?.flag} {LANGUAGES.find(l => l.code === selectedLang)?.name}</span>
              <ChevronDown size={14} />
            </button>
            
            {isLangDropdownOpen && (
              <div className="lang-dropdown">
                {LANGUAGES.map(l => (
                  <button 
                    key={l.code} 
                    className={`lang-item ${selectedLang === l.code ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedLang(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="header-right" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Made with <a href={config.gitHubRepo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} className="hover:text-white">{config.docsTitle}</a>
        </div>
      </header>

      <main className="main-layout">
        <aside className="sidebar">
          {/* Quick full-text page content search input */}
          <div className="sidebar-search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="search-input" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchModalOpen(true);
              }}
              onFocus={() => setIsSearchModalOpen(true)}
            />
            <div className="search-kbd">/</div>
          </div>
          
          <nav>
            <ul className="sidebar-nav">
              {filteredDocs.map(doc => (
                <li key={doc.id} className="nav-item">
                  <a 
                    href={`#${doc.id}`}
                    className={`nav-link ${activeTab === doc.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(doc.id);
                    }}
                  >
                    {getTabIcon(doc.icon)}
                    <span>{translatedTitles[doc.id] || doc.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <section className="content-area">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
          ) : (
            <>
              <div className="page-actions" ref={dropdownRef}>
                <div className="read-time-badge-container" title="Estimated reading time">
                  <Clock size={14} />
                  <span>{readTime} min read</span>
                </div>
                <button className="copy-page-btn" onClick={handleCopyPage}>
                  {isPageCopied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{isPageCopied ? t('copied') : t('copyPage')}</span>
                </button>
                <div className="dropdown-container">
                  <button className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item" onClick={handleCopyPage}>
                        <Copy size={14} />
                        <span>{t('copyPage')}</span>
                      </button>
                      {config.enableEditPage && (
                        <button 
                          className="dropdown-item" 
                          onClick={() => { 
                            const repo = config.gitHubRepo.replace(/\/$/, '');
                            const branch = config.branch || 'main';
                            // activeMeta.path starts with /docs/getting-started.md
                            const editUrl = `${repo}/edit/${branch}/public${activeMeta.path}`;
                            window.open(editUrl, '_blank'); 
                            setIsDropdownOpen(false); 
                          }}
                        >
                          <Edit3 size={14} />
                          <span>{t('editPage')}</span>
                        </button>
                      )}
                      <button className="dropdown-item" onClick={() => { window.open(activeMeta.path, '_blank'); setIsDropdownOpen(false); }}>
                        <FileCode size={14} />
                        <span>{t('viewMarkdown')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* On-the-fly Dynamic Translating Overlay Indicator */}
              {translating && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span className="translation-indicator">
                    <Clock size={13} style={{ animation: 'pulse-trans 1.5s ease-in-out infinite' }} />
                    <span>{t('translating')}</span>
                  </span>
                </div>
              )}

              <article className="markdown-body">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({node, ...props}) => {
                      const text = String(props.children).replace(/[*_~`]/g, '');
                      const id = generateId(text);
                      return <h2 id={id} {...props} />;
                    },
                    h3: ({node, ...props}) => {
                      const text = String(props.children).replace(/[*_~`]/g, '');
                      const id = generateId(text);
                      return <h3 id={id} {...props} />;
                    },
                    code: CodeBlock,
                    blockquote: CustomBlockquote
                  }}
                >
                  {displayedContent || content}
                </ReactMarkdown>
              </article>

              <footer className="pagination">
                {prevDoc ? (
                  <a href={`#${prevDoc.id}`} className="pagination-btn prev" onClick={(e) => { e.preventDefault(); setActiveTab(prevDoc.id); }}>
                    <ChevronLeft size={20} />
                    <div className="pagination-info">
                      <span className="pagination-title">{translatedTitles[prevDoc.id] || prevDoc.title}</span>
                    </div>
                  </a>
                ) : <div />}

                {nextDoc ? (
                  <a href={`#${nextDoc.id}`} className="pagination-btn next" onClick={(e) => { e.preventDefault(); setActiveTab(nextDoc.id); }}>
                    <div className="pagination-info">
                      <span className="pagination-title">{translatedTitles[nextDoc.id] || nextDoc.title}</span>
                    </div>
                    <ChevronRight size={20} />
                  </a>
                ) : <div />}
              </footer>
            </>
          )}
        </section>

        <aside className="toc-area">
          <div className="toc-title">{t('onThisPage')}</div>
          <ul className="toc-list">
            {toc.map((item, index) => (
              <li 
                key={index} 
                className="toc-item"
                style={{ marginLeft: item.level === 3 ? '1rem' : '0' }}
              >
                <a 
                  href={`#${item.id}`} 
                  className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(item.id);
                  }}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      {/* Interactive Page Content Search Modal overlay */}
      {isSearchModalOpen && (
        <div className="command-palette-backdrop" onClick={() => setIsSearchModalOpen(false)}>
          <div className="command-palette-modal" ref={searchModalRef} onClick={e => e.stopPropagation()}>
            <div className="command-palette-input-wrapper">
              <Search size={18} className="command-palette-input-icon" />
              <input 
                ref={searchInputRef}
                type="text"
                className="command-palette-input"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <span className="command-palette-esc">ESC</span>
            </div>

            <div className="command-palette-content">
              {searchQuery.trim() === '' ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('searchDocs')}</div>
                  <div style={{ fontSize: '0.8125rem', opacity: 0.7 }}>
                    {t('typeToSearch')}
                  </div>
                </div>
              ) : pageSearchResults.length === 0 ? (
                <div className="command-palette-empty">
                  {t('noResults')} "{searchQuery}"
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {pageSearchResults.map((match, idx) => {
                    const isSelected = idx === selectedSearchIndex;
                    return (
                      <div
                        key={match.id}
                        className={`command-palette-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleNavToSearchMatch(match)}
                        onMouseEnter={() => setSelectedSearchIndex(idx)}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'stretch', 
                          gap: '0.25rem',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: isSelected ? '#ffffff' : 'var(--text-muted)' }}>
                              {getTabIcon(match.docIcon)}
                            </span>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                              {match.docTitle}
                            </span>
                            {match.heading && (
                              <>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--accent-color)' }}>
                                  {match.heading}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div 
                          style={{ 
                            fontSize: '0.75rem', 
                            lineHeight: '1.4', 
                            color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            marginLeft: '1.75rem'
                          }}
                        >
                          <HighlightText text={match.snippet} highlight={searchQuery} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="command-palette-footer">
              <div className="command-palette-hint">
                <span className="command-palette-hint-key">↑↓</span>
                <span>to navigate</span>
              </div>
              <div className="command-palette-hint">
                <span className="command-palette-hint-key">Enter</span>
                <span>to select</span>
              </div>
              <div className="command-palette-hint">
                <span className="command-palette-hint-key">Esc</span>
                <span>to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
