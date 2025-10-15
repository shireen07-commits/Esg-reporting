# ESG Copilot MVP - Design Guidelines

## Design Approach

**Selected Approach:** Design System-Based (Carbon Design + Linear influences)

**Justification:** ESG Copilot is a data-intensive enterprise productivity tool requiring clarity, efficiency, and trust. Carbon Design System excels at information-dense applications while maintaining accessibility. Linear's typography and spatial design principles will enhance readability and modern appeal.

**Key Design Principles:**
- **Data Clarity First:** Information hierarchy prioritizes quick comprehension of ESG metrics
- **Conversational Trust:** Chat interface feels knowledgeable yet approachable
- **Professional Authority:** Visual design conveys expertise in sustainability reporting
- **Efficient Interactions:** Minimal clicks to access insights, clear action paths

---

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (default):
- Background Base: `222 12% 9%` (deep charcoal with subtle green undertone)
- Surface Elevated: `222 10% 13%` (card/panel backgrounds)
- Surface Interactive: `222 8% 17%` (hover states, chat bubbles)
- Border Subtle: `222 8% 22%` (dividers, input borders)
- Text Primary: `220 9% 98%` (high contrast text)
- Text Secondary: `220 5% 72%` (labels, metadata)
- Text Muted: `220 5% 52%` (placeholders, disabled)

**Brand & Accent Colors:**
- Primary (ESG Green): `152 65% 48%` (sustainability theme, CTAs, success states)
- Primary Hover: `152 65% 42%` (interactive states)
- Secondary Blue: `215 70% 58%` (informational elements, links)
- Warning Amber: `38 92% 50%` (data anomalies, flags)
- Error Red: `0 72% 58%` (critical alerts, validation errors)
- AI Purple: `265 65% 62%` (AI responses, copilot branding)

**Light Mode** (complementary):
- Background Base: `220 20% 98%`
- Surface: `220 15% 100%`
- Text Primary: `222 12% 12%`
- Borders: `220 10% 88%`
(Same accent colors with adjusted opacity for contrast)

### B. Typography

**Font Families:**
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- Monospace: `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` (code snippets, data values)

**Type Scale:**
- Heading 1: `text-4xl font-semibold` (32px, Dashboard titles)
- Heading 2: `text-2xl font-semibold` (24px, Section headers)
- Heading 3: `text-xl font-medium` (20px, Card titles)
- Body Large: `text-base font-normal` (16px, Chat messages)
- Body: `text-sm font-normal` (14px, UI labels)
- Caption: `text-xs font-normal` (12px, Metadata, timestamps)
- Code: `text-sm font-mono` (14px, Technical data)

**Line Height:** Use `leading-relaxed` (1.625) for body text, `leading-tight` (1.25) for headings

### C. Layout System

**Spacing Primitives:** Use Tailwind units **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: `p-4` to `p-6` (mobile), `p-6` to `p-8` (desktop)
- Section spacing: `gap-8` to `gap-12` (vertical stack)
- Inline spacing: `gap-2` to `gap-4` (buttons, chips)
- Page margins: `px-4` (mobile), `px-8` (tablet), `px-12` (desktop)

**Container Widths:**
- Dashboard max-width: `max-w-7xl mx-auto` (1280px)
- Chat widget: `w-96` (384px) when expanded
- Content columns: `max-w-4xl` for text-heavy sections

**Grid System:**
- Dashboard: `grid-cols-1 lg:grid-cols-12` (12-column for flexible layouts)
- Data cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (responsive cards)
- Chat layout: Flexbox column with `flex-1` for message area

### D. Component Library

#### 1. Chat Widget (Collapsible)
- **Closed State:** Floating button bottom-right, `w-14 h-14`, rounded-full with AI Purple glow
- **Expanded State:** Fixed panel `w-96 h-[600px]`, shadow-2xl, backdrop-blur-sm
- **Header:** Gradient from AI Purple to Primary Green, ESG Copilot branding, minimize/close buttons
- **Message Area:** Scrollable flex column, `gap-4`, auto-scroll to bottom
- **User Messages:** Right-aligned, Primary Green background, rounded-2xl, max-width 80%
- **AI Messages:** Left-aligned, Surface Interactive background, markdown rendering, typing indicator (three dots pulse animation)
- **Input Field:** Sticky bottom, Surface Elevated background, border-t with Border Subtle, auto-resize textarea, send button with Primary Green

#### 2. Dashboard Layout
- **Top Navigation:** Sticky header, glass morphism effect, breadcrumb navigation, user profile dropdown
- **Main Content:** 12-column grid, left sidebar (3 cols) for metrics/filters, main area (9 cols) for data visualization
- **Metric Cards:** Surface Elevated background, border with Border Subtle, `p-6`, icon + label + large value display
- **Data Tables:** Striped rows (alternating Surface base/Interactive), sortable headers, sticky header on scroll, monospace for numerical data
- **Charts/Graphs:** Carbon-inspired bar/line charts with Primary Green gradients, grid lines in Border Subtle

#### 3. Navigation & Actions
- **Primary Buttons:** Primary Green background, white text, `px-6 py-2.5`, `rounded-lg`, hover lift shadow
- **Secondary Buttons:** Border with Primary Green, transparent background, hover fill transition
- **Icon Buttons:** `w-10 h-10`, rounded-md, Surface Interactive hover
- **Breadcrumbs:** Text Secondary with chevron separators, current page in Text Primary
- **Tabs:** Underline indicator in Primary Green, Text Secondary inactive, smooth transition

#### 4. Data Display Components
- **Anomaly Flags:** Warning Amber background-opacity-10, border-l-4 with Warning Amber, icon + description
- **Compliance Badges:** Pill-shaped, Primary Green (compliant), Error Red (non-compliant), small caps text
- **Audit Trail Items:** Timeline layout with vertical line, timestamp + action + user avatar
- **Suggested Actions:** Card with Secondary Blue left border, clickable with hover scale-102 transform

#### 5. Feedback & States
- **Loading Skeleton:** Animated pulse in Surface Interactive, match content structure
- **Toast Notifications:** Fixed top-right, Surface Elevated with border-l-4 (color by type), auto-dismiss
- **Empty States:** Centered illustration + heading + description, suggested actions below
- **Error Messages:** Error Red text with background-opacity-10, icon + message + retry button

### E. Interactions & Animations

**Use Sparingly:**
- Chat message fade-in: `animate-in fade-in slide-in-from-bottom-2 duration-300`
- Button hover: `transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`
- Panel expand/collapse: `transition-all duration-300 ease-out`
- Typing indicator: Pulse animation on three dots
- Data refresh: Subtle rotate animation on refresh icon

**NO animations on:** Data tables, charts, form inputs (instant feedback only)

---

## Images & Visual Assets

**Icons:** Use Heroicons (outline for inactive, solid for active states) via CDN
- Dashboard: `ChartBarIcon`, `DocumentTextIcon`, `ExclamationTriangleIcon`
- Chat: `ChatBubbleLeftRightIcon`, `SparklesIcon` (AI indicator), `PaperAirplaneIcon` (send)
- Actions: `ArrowPathIcon` (refresh), `FunnelIcon` (filter), `MagnifyingGlassIcon` (search)

**No Hero Image:** This is a utility dashboard, not a marketing page. Focus on data clarity and chat functionality immediately visible.

**Illustrations:** Use subtle line-art illustrations in Empty States only (404, no data scenarios) - keep minimal and on-brand with sustainability theme (leaf motifs, globe outlines in Primary Green stroke).

---

## Specific Implementation Notes

**Chat Streaming:** Implement word-by-word streaming with 30ms delay between tokens, typing indicator shows during fetch
**Context Pills:** Display user role (Analyst/Auditor/Supplier) as small badge in chat header using Secondary Blue
**Suggested Prompts:** Show 3 contextual suggestions below input as clickable chips, Surface Interactive background, Text Secondary
**Session Indicator:** Small green dot with "Active Session" text in chat header, timestamp of last message in Caption text
**Responsive Behavior:** Chat widget becomes full-screen modal on mobile (< 768px), dashboard stacks columns vertically