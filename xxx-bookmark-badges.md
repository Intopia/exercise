# Project brief: Intopia accessibility bookmarklet set

## Context

Russ Weakley, accessibility specialist at Intopia Digital, maintains a set of accessibility testing bookmarklets at https://intopia.github.io/exercise/testing-bookmarklets.html used in his "Testing web accessibility for teams" course. 

Test pages live at https://intopia.github.io/exercise/testing.html.

## The current bookmarklets

- Highlight headings
- Highlight image alternatives
- Highlight lists
- Highlight captions and headers
- Highlight ARIA table roles
- Highlight landmarks
- Highlight aria-label
- Highlight aria-labelledby
- Highlight aria-describedby
- Highlight name mismatches
- Highlight name-prohibited roles
- Highlight form field names
- Highlight buttons
- Highlight fieldsets
- Highlight required fields
- Highlight aria-invalid
- Highlight autocomplete
- Highlight shadow DOM
- Track focus order

## What was the scope of work

A set of 19+ bookmarklets was substantially rebuilt, debugged and expanded across a long session. Starting point was adding Escape key support; ended with a comprehensive toolkit with consistent design language.

Key bookmarklets built or rebuilt from scratch:

- headings
- form field names (replaced the weak for/ID one)
- aria-label (restored for a client)
- shadow DOM detection, fieldsets
- focus order tracker
- ARIA table roles
- image alternatives (three-state alt detection).

Key bugs fixed: aria-labelledby and aria-describedby multi-ID handling, hidden element badge positioning, off-screen CSS detection, self-reference overlap, duplicate overlay stacking.

## Design system

A consistent badge system emerged — detailed in the uploaded markdown reference file. Short version:

- Colour palette: dark green (valid), dark blue (informational), amber (caution), red (broken/missing)
- Informational badges — sentence case, source first: aria-label: Close
- Diagnostic verdict badges — all caps, verdict first: NO ACCESSIBLE NAME, MISMATCH: Hello

Key architectural decisions

- All bookmarklets use an overlay div, not direct DOM badge injection
- All have Esc to clear, re-running removes previous overlay
- Dense bookmarklets (tables, ARIA tables) use keyboard number filters (1–3 or 1–6) with a fixed legend panel — "progressive enhancement" approach, all on by default
- Lists use position-by-type: containers badge above, items badge inside at bottom
- Badge wrapping: image alt bookmarklet uses max-width: 400px and white-space: normal for long alt text

## Tooling

All minification done with terser via Node in the bash environment. Source files saved to /tmp/script_*.js. Encoded bookmarklets output as complete <a> tags ready to paste.

## What was retired

aria-controls (too niche, inconsistent AT support), standalone aria-label (initially), focus styles bookmarklet (fundamentally unreliable on modern CSS), testing links (done by another party).

## Test pages reviewed

Every test page in the set was critically reviewed for technical accuracy, spelling, tag mismatches, and bookmarklet coverage. Several were rebuilt or substantially updated.

# Bookmarklet badge reference

Colour palette used across the set:
- Dark green `#1b5e20` — valid, present, correctly implemented
- Dark blue `#0a558c` — informational, secondary reference, generic
- Amber `#e65100` — caution, unreliable, unconfirmed, redundant
- Red `#b00020` — missing, broken, prohibited, invalid
- Deep purple `#4a148c` — used in specific bookmarklets (landmarks, ARIA tables)
- Teal `#006064` — used in specific bookmarklets (landmarks, ARIA tables)
- Deep pink `#880e4f` — used in landmarks
- Blue-grey `#37474f` — used in specific bookmarklets (landmarks, ARIA tables)
- Dark `#111111` — used in focus order tracker

Badge text system:
- **Informational** — sentence case, source/element first: `aria-label: Close`
- **Diagnostic verdict** — all caps, verdict first: `NO ACCESSIBLE NAME`, `MISMATCH: Hello`

---

## Highlight headings

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark blue | `#0a558c` | H1: [text] |
| Dark green | `#1b5e20` | H2: [text] |
| Amber | `#e65100` | H3: [text] |
| Teal | `#006064` | H4: [text] |
| Deep purple | `#4a148c` | H5: [text] |
| Blue-grey | `#37474f` | H6: [text] |
| Red | `#b00020` | H1: [text] (avoid more than one H1) |
| Red | `#b00020` | H[N]: (empty heading) |

---

## Highlight image alternatives

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | Alt: [text] |
| Dark blue | `#0a558c` | Empty alt |
| Red | `#b00020` | Missing alt |

---

## Highlight lists

Containers (ul, ol, dl, role="list") — badge above element.
Items (li, dt, dd, role="listitem") — badge inside at bottom of element.

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | `<ul>` |
| Dark green | `#1b5e20` | `<ol>` |
| Dark green | `#1b5e20` | `<li>` |
| Dark blue | `#0a558c` | `<dl>` |
| Dark blue | `#0a558c` | `<dt>` |
| Dark blue | `#0a558c` | `<dd>` |
| Amber | `#e65100` | role="list" |
| Amber | `#e65100` | role="listitem" |

---

## Highlight captions and headers

Keyboard filter: [1] Table  [2] Caption  [3] TH  [Esc] Clear

| Colour | Hex | Badge text | Key |
|--------|-----|------------|-----|
| Dark blue | `#0a558c` | Table [N] | 1 |
| Dark green | `#1b5e20` | Caption: [text] | 2 |
| Amber | `#e65100` | TH: [text] (scope=[value]) | 3 |
| Red | `#b00020` | TH: [text] (no scope) | 3 |

---

## Highlight ARIA table roles

Keyboard filter: [1] Table/Grid  [2] Rowgroup  [3] Row  [4] Column header  [5] Row header  [6] Cell  [Esc] Clear

Container roles (table, grid, treegrid, rowgroup) — badge above element.
Row and cell roles — badge inside at bottom of element.

| Colour | Hex | Badge text | Key |
|--------|-----|------------|-----|
| Dark blue | `#0a558c` | role="table" [: name] | 1 |
| Dark blue | `#0a558c` | role="grid" [: name] | 1 |
| Dark blue | `#0a558c` | role="treegrid" [: name] | 1 |
| Teal | `#006064` | role="rowgroup" | 2 |
| Amber | `#e65100` | role="row" | 3 |
| Red | `#b00020` | role="columnheader" | 4 |
| Deep purple | `#4a148c` | role="rowheader" | 5 |
| Dark green | `#1b5e20` | role="cell" | 6 |
| Dark green | `#1b5e20` | role="gridcell" | 6 |

---

## Highlight landmarks

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark blue | `#0a558c` | Banner [: name] |
| Amber | `#e65100` | Navigation [: name] |
| Dark green | `#1b5e20` | Main [: name] |
| Teal | `#006064` | Complementary [: name] |
| Deep purple | `#4a148c` | Contentinfo [: name] |
| Deep pink | `#880e4f` | Search [: name] |
| Blue-grey | `#37474f` | Region [: name] |
| Red | `#b00020` | Form [: name] |

---

## Highlight aria-label

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | aria-label: [value] |
| Amber | `#e65100` | aria-label: (empty) |
| Red | `#b00020` | aria-label on prohibited role: [role] |

---

## Highlight aria-labelledby

Source element badge always appears at element position.
Self, hidden and missing ID badges stack below source badge.

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark blue | `#0a558c` | aria-labelledby: [ids] |
| Dark green | `#1b5e20` | ID: [id] |
| Dark green | `#1b5e20` | ID: [id] (self) |
| Amber | `#e65100` | ID: [id] (hidden) |
| Red | `#b00020` | Missing ID: [id] |

---

## Highlight aria-describedby

Source element badge always appears at element position.
Hidden and missing ID badges stack below source badge.

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark blue | `#0a558c` | aria-describedby: [ids] |
| Dark green | `#1b5e20` | ID: [id] |
| Amber | `#e65100` | ID: [id] (hidden) |
| Red | `#b00020` | Missing ID: [id] |

---

## Highlight name mismatches

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | MATCH: [accessible name] |
| Dark blue | `#0a558c` | MODIFIED: [accessible name] |
| Red | `#b00020` | MISMATCH: [accessible name] |

---

## Highlight name-prohibited roles

| Colour | Hex | Badge text |
|--------|-----|------------|
| Red | `#b00020` | NAME PROHIBITED: [role] |

---

## Highlight form field names

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | aria-labelledby: [name] |
| Dark green | `#1b5e20` | aria-label: [name] |
| Dark green | `#1b5e20` | label: [name] |
| Dark green | `#1b5e20` | implicit label: [name] |
| Amber | `#e65100` | title: [name] |
| Amber | `#e65100` | placeholder: [name] |
| Red | `#b00020` | NO ACCESSIBLE NAME |

---

## Highlight buttons

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | aria-labelledby: [name] |
| Dark green | `#1b5e20` | aria-label: [name] |
| Dark green | `#1b5e20` | text content: [name] |
| Dark green | `#1b5e20` | value: [name] |
| Dark green | `#1b5e20` | title: [name] |
| Dark green | `#1b5e20` | default: Submit / default: Reset |
| Red | `#b00020` | NO ACCESSIBLE NAME |

---

## Highlight fieldsets

Legend badge positioned below legend element to avoid overlap with fieldset badge.

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | Fieldset |
| Red | `#b00020` | Fieldset (no legend) |
| Dark blue | `#0a558c` | Legend: [text] |
| Amber | `#e65100` | role="radiogroup" [: name] |

---

## Highlight required fields

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | required |
| Dark blue | `#0a558c` | aria-required="true" |
| Amber | `#e65100` | required + aria-required="true" (redundant) |
| Dark green | `#1b5e20` | aria-required="false" |

---

## Highlight aria-invalid

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | aria-invalid: true |
| Dark green | `#1b5e20` | aria-invalid: false |
| Dark green | `#1b5e20` | aria-invalid: grammar |
| Dark green | `#1b5e20` | aria-invalid: spelling |
| Red | `#b00020` | INVALID VALUE: aria-invalid="[value]" |

---

## Highlight autocomplete

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | autocomplete: [value] (valid) |
| Dark blue | `#0a558c` | autocomplete: [value] (generic) |
| Red | `#b00020` | autocomplete: [value] (invalid) |

---

## Highlight shadow DOM

Fixed summary banner at bottom of page shows element counts.

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark green | `#1b5e20` | Open shadow DOM: [tag][#id or .class] |
| Amber | `#e65100` | Custom element: [tag][#id or .class] |

---

## Track focus order

Active listener — click to start, Esc to stop. Badge follows current focused element.
Visited elements retain dark outline until Esc is pressed.

| Colour | Hex | Badge text |
|--------|-----|------------|
| Dark | `#111111` | [N]. [tag][#id][role="…"]["name"] |

