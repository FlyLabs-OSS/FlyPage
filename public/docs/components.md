# Built-in Components

Learn about the interactive and responsive design components included in this documentation site to display guides in an attractive and interactive format.

## Code Blocks

Show your code with our built in code blocks.

```tbl
// Example config object
export const config = {
  theme: 'cosmic',
  navigation: 'sidebar',
  responsive: true,
};
```

## Callout Cards

You can design responsive notifications, tips, or warning alerts directly in your Markdown using standard Markdown alert blockquotes:

> [!warning] Crucial Configuration Alert
> Always run compilation tests after adding any structural page properties to ensure state maps resolve correctly.

> [!info] Pro Tip
> You can pair SVG elements inside lists to quickly denote status levels or feature milestones.

---

## Data Tables

Display structured technical information, configuration parameters, or service catalogs clearly using standard Markdown tables.
| Key Parameter | Target Environment | Default Value | Status Accent |
| :--- | :--- | :--- | :--- |
| `theme_color` | Client-Side / Styling | `indigo-600` | Active |
| `max_tabs` | Layout Sidebar | `12` | Restricted |
| `enable_search` | Global Hook | `true` | Deprecated |
| `timeout_ms` | Network Agent | `5000` | Optimal |

---

## Multi-level Task Checklists

Structure your roadmap, setup instructions, or build steps with interactive checklists and bullet listings:

- [x] Initial boot configurations loaded
- [x] Create layout entry points successfully
- [ ] Incorporate customized styling values (`/src/index.css`)
- [ ] Establish cloud hosting pipeline triggers

---

## Inline Typography & Accents

Format your text with diverse inline weights to clarify hierarchies and critical terms:
- Make text stand out with **strong emphasis** or *subtle italic accents*
- Outline file locations and inline commands using `monospace code highlights`
- Mark deprecated procedures using ~~strikethrough styling~~
- Link out with integrated, interactive external badges (e.g., [FlyPage GitHub](https://github.com))
