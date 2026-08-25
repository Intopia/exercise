# Project handoff: Intopia accessibility testing exercise site

## Who this is for
Russ Weakley, accessibility specialist/educator at Intopia (~30 years in the field, also runs maxdesign.com.au, teaches devs/testers/QA). This document is a handoff summary for a new conversation continuing work on his public GitHub testing-exercise repo (github.com/Intopia/exercise or similar). Read this in full before responding to the first message in the new conversation.


## What this repo is
A large (120+ file), single-file-per-concept library of standalone HTML test pages, used to teach and test specific accessibility concepts (ARIA attributes, HTML elements, patterns). Public repo, never actively advertised, but findable, so **no client-identifying info, no sensitive project names** belongs anywhere in it (a past cleanup already removed Salesforce-related files; commit messages use "SF" not "Salesforce" for exactly this reason).

The whole site is entered via `testing.html`, a landing page structured as topic categories (not course-based), linking out to every page. It sits behind a "dummy exercise page" (mammal-themed content with headings/lists/tables/forms/landmarks) that's the actual first thing students see, the huge testing library is deliberately one click deeper, not the front door.

Git repository: https://github.com/Intopia/exercise
Repostitory public page: https://intopia.github.io/exercise/
Actual landing page for all tests: https://intopia.github.io/exercise/testing.html

---

## Page template (corrected)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TITLE</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" href="favicon.ico">
  <link href="assets/css/testing.css" rel="stylesheet">
</head>
<body>
<main>

<a class="intopia-home-link" href="https://intopia.digital/" aria-label="Intopia home">
  <img src="assets/img/intopia.png" alt="Intopia logo" class="intopia-logo">
</a>

<p class="header-link"><span aria-hidden="true" class="arrow">&laquo;</span> <a href="testing.html">Back to home</a></p>

<h1>TITLE</h1>

[content]

<p class="footer-link"><span aria-hidden="true" class="arrow">&laquo;</span> <a href="testing.html">Back to home</a></p>
</main>
</body>
</html>
```

## Site-wide conventions

**Naming:**
- `testing-*.html` — hands-on interactive testing/demo pages
- `reviewing-*.html` — fuller audit-style reference pages, often with real filled-in cross-browser/AT results tables - rarely used now
- `x-*.html` — deliberately temporary/scratch files, never meant to be promoted (e.g. `x-svg-test.html`)
- An unstyled page with no link from `testing.html` signals "provisional, dropped in for a specific quick test, not yet judged for permanence." Once promoted: gets `testing.css`, gets a landing-page entry, gets full site chrome.

**Structural patterns used throughout:**
- `<div class="example">` wraps each live, interactive demo
- `<details><summary>HTML markup</summary><pre><code>...</code></pre></details>` for code samples, always placed directly after the live example it documents, and always kept in sync with it (a common bug caught repeatedly: code sample drifts from live markup after edits)
- `<span class="highlight">` inside code samples wraps the specific attribute/element being taught
- `<p><b>Expected result:</b> ...</p>` states what should happen, explicitly, rather than leaving outcomes implicit. When something is genuinely untested/uncertain, say so directly ("worth confirming directly") rather than asserting a confident outcome.
- `<!-- section -->` HTML comments separate major sections/examples with two line breaks above and below the section comment. 
- Examples are always given `<h2>Example: [short summary]</h2>`
- `.note` box (not in shared `testing.css`, defined locally per page): `background: #fff3cd; border: 1px solid #ffe69c; padding: 0.75em 1em; border-radius: 4px; margin: 1.5em 0;` — used for caveats, testing notes, spec quotes
- `type="text"` on inputs and `type="button"` on buttons are deliberately omitted (they're HTML defaults) to reduce visual clutter in code samples. This is a deliberate style choice, not an inconsistency, don't "fix" it.
- JS lives in a real `<script>` block near the bottom of the file, never inline `onclick` attributes
- Real, working interactivity is strongly preferred over static/inert demos, if something looks like a working pattern, it should actually work (arrow keys, hover, click, etc., as appropriate to the pattern)
- Real wotking examples must be fully accessible.

**"Broken example" pages:** several pages deliberately include invalid/broken markup to test what a bookmarklet or AT actually catches (e.g. empty/invalid attribute values). Convention: keep the *visible interaction* working correctly (reference the real element directly in JS) while the *specific attribute under test* stays broken. This isolates the one variable being tested and avoids the JS/interaction layer becoming a confounding excuse. State this explicitly on the page ("every example including the broken ones behaves correctly when clicked, that's deliberate").

**Git commit conventions (adopted partway through this project, not retroactively applied):**
- `type: subject` style, e.g. `fix: aria-checked example duplicate ID`, `add: aria-pressed testing page`
- One clear, scoped change per commit
- Never include client/sensitive names, even abbreviated references are preferred (`SF` not `Salesforce`)

---

## Real, tested findings worth remembering
These came from Russ's own AT testing, not assumption, treat as more reliable than general knowledge:

- **`aria-invalid="grammar"`/`"spelling"`**: JAWS conveys presence + boundaries but not which type; NVDA conveys which type but not boundaries; VoiceOver/TalkBack results conflict between sources (a11ysupport.io says unsupported, DAISY Consortium 2023 testing found it worked). Genuinely unsettled, verify fresh each time.
- **Placeholder leaking**: when `aria-labelledby`, `aria-label`, or `<label>` correctly supplies the accessible name, the `placeholder` text often still gets announced *in addition* (confirmed via Russ's own multi-browser test pages), except when `title` is the correct name source, where this only occurred in Safari/VoiceOver.
- **`aria-valuetext`**: spec says it should *replace* the numeric announcement; real testing found some browser/AT combos announce both together ("75%, Loud"), not text-only. Don't assume replacement behaviour without testing.
- **`scope` on simple tables**: genuinely redundant per Steve Faulkner/Adrian Roselli's testing (native `<th>` association already works without it). On *complex* tables (spanning headers), `scope` can actively produce wrong results, not just "no benefit."
- **VoiceOver defaults to High verbosity** (confirmed via Apple's own docs, "to help new users"). NVDA defaults to Medium. JAWS/TalkBack defaults not independently confirmed. This is a real, opposite design choice between VoiceOver and NVDA, worth knowing before assuming any screen reader's "default" behaviour.
- **`role="grid"` (or other composite widget roles) without correct required-owned-elements structure can badly break AT navigation**: a real bug was found where a static calendar used `role="grid"` without `role="row"` wrapping and no keyboard interactivity, VoiceOver couldn't navigate into it at all, treated it as one unstructured blob. Lesson: never apply an interactive composite role (`grid`, `listbox`, `tree`, `menu`) to genuinely static, non-interactive content. Fixed by using a plain native `<table>` instead.
- **`aria-details` supports multiple space-separated IDs** (confirmed current per ARIA 1.3 spec text), with a documented SHOULD-fallback: if AT can't expose multiple relations, it should fall back to the *first* referenced element only.
- **Fragment navigation + `tabindex="-1"` alone does not reliably move real keyboard focus** to a non-natively-focusable target (per Manuel Matuzović's research, 2026). Native fragment navigation scrolls but doesn't call `.focus()`. An explicit `.focus()` call (via `hashchange` listener or similar) is required for real focus movement. This does NOT apply to natively focusable elements (inputs, buttons), which focus correctly via fragment navigation without extra JS.
- **`command`/`commandfor` (Invoker Commands API)** reached Baseline support across Chrome 135+/Firefox 144+/Safari 26.2+ recently, check current versions before assuming universal support in older browsers.

---

## Pedagogy principles established

**Four-pillar framework for a good concept-teaching page** (emerged from the `testing-states.html` work):
1. **Variety** — show genuinely different states/patterns, not repetitive variations of one idea
2. **Native vs. custom/non-native** — explicitly distinguish what the browser gives for free vs. what has to be hand-built with ARIA/JS, and label examples accordingly ("(native checkbox)" vs "(custom checkbox using aria-checked)")
3. **Static vs. active** — prefer examples with a real, visible before/after state change over inert ones; watching a value change live in DevTools' Accessibility tree is a stronger teaching moment than reading about it
4. **Guided** — state explicit Action/Answer exercises ("What is its state in the Computed Properties panel? Answer: Checked: true") rather than leaving the correct outcome for the student to guess; this is retrieval practice, proven more effective for retention than passive reading

**Tiered widget complexity model** (emerged from the character-counter discussion):
- **Tier 1 — native elements**: `<output>`, `<progress>`, zero ARIA authoring needed
- **Tier 2 — mini widgets**: one interactive surface, real author-built logic (debouncing, live-region choreography), e.g. timers, character counter. These stay in this repo.
- **Tier 3 — full composite widgets**: manage relationships *between* multiple interactive elements (roving focus, virtual focus, activedescendant), e.g. tabs, comboboxes, sortable tables, menus, accordions. A genuinely production-hardened Tier 3 widget probably belongs in its **own separate repo** with full documentation, not this testing-exercise repo, which exists for isolated concept demos, not shippable widgets. (Decided directly: this repo is not the place for polished, reusable complex widgets going forward.)

**Testing methodology repeatedly reinforced:**
- Spec text and real AT behaviour frequently diverge; state both, don't assume spec compliance
- When something is genuinely uncertain, say so explicitly rather than picking a confident-sounding answer
- Real, dated, sourced evidence (a11ysupport.io, DAISY Consortium, MDN, direct testing) beats general impression every time
- When Russ's own direct testing contradicts a prior claim (mine or a spec's), his tested result wins, and the page should say so

---

## Open threads / not yet actioned

- **"Understanding aria-current" article** — Russ said he'd bring this over to map 1:1 against the `testing-aria-current.html` examples (including the `location` value's "spec-vague" acknowledgment, which should carry through to the article, not be smoothed over)
- **Escalating dropdown series** (native select → CSS-styled native via `appearance: base-select` → closed-by-default custom single-select → closed-by-default custom multi-select w/ summary → autocomplete → complex menu) — discussed in depth, genuine gaps identified (closed-by-default single/multi-select specifically), not yet built
- **Tier 3 widgets not yet built as standalone pages**: Tabs, Accordion, Toolbar (though a full accessible tabs pattern now exists embedded inside `testing-aria-controls.html` Example 3, worth knowing it's there)
- **Lower-priority attributes not yet built**: `aria-errormessage` (flagged as worth doing given adjacent form-error pages already exist), `aria-orientation` (suggested folding into existing slider pages rather than a new page), `aria-sort` standalone (low priority, already covered in context via the sortable table), `aria-keyshortcuts` (lowest priority, genuinely rare in real code), the table-index cluster (`aria-colcount`/`rowindex`/etc., niche, likely skip)
- **Heading-hierarchy flattening on `testing.html`** — discussed at length (self-sufficiency test for promoted headings), deliberately left as-is for now, not actioned
- **Site-wide "visible label vs. `aria-label`" consistency question** — raised once, deliberately deferred as its own separate decision, not actioned

---

## Full current file list (for reference/cross-checking)

reviewing-accessible-names.html, reviewing-all-form-elements.html, reviewing-all-input-types.html, reviewing-aria-atomic-false.html, reviewing-aria-atomic-true.html, reviewing-aria-busy.html, reviewing-aria-label.html, reviewing-aria-labelledby.html, reviewing-aria-live-assertive.html, reviewing-aria-live-nothing.html, reviewing-aria-live-off.html, reviewing-aria-live-polite.html, reviewing-aria-owns.html, reviewing-aria-relevant-additions.html, reviewing-aria-relevant-all.html, reviewing-aria-relevant-removals.html, reviewing-aria-role-alert.html, reviewing-aria-role-log.html, reviewing-aria-role-status.html, reviewing-clickable-cards.html, reviewing-concatenated-accessible-name.html, reviewing-example-form-bad.html, reviewing-example-form-good.html, reviewing-form-controls-labels.html, reviewing-image-types.html, reviewing-landmarks.html, reviewing-links.html, reviewing-lists.html, reviewing-tabindex.html, testing-accessible-names.html, testing-allybites2026.html (external: AllyCamp presentation resource), testing-aria-activedescendant.html, testing-aria-autocomplete.html, testing-aria-checked.html, testing-aria-controls.html, testing-aria-current.html, testing-aria-describedby.html, testing-aria-details.html, testing-aria-expanded.html, testing-aria-haspopup.html, testing-aria-invalid.html, testing-aria-label.html, testing-aria-level.html, testing-aria-notify.html, testing-aria-pressed.html, testing-aria-readonly.html, testing-aria-roledescription.html, testing-aria-selected.html, testing-aria-setsize-posinset.html, testing-aria-valuemin-valuemax.html, testing-aria-valuenow.html, testing-aria-valuetext.html, testing-autocomplete.html, testing-back-arrow-options.html, testing-bookmarklets-intopia.html, testing-bookmarklets.html, testing-browser-extensions.html, testing-buttons.html, testing-canvas.html, testing-capitalisation.html, testing-character-counter.html, testing-console.html (external: maxdesign article resource), testing-contact-form.html, testing-css-color-methods.html, testing-disabled-button.html, testing-fieldsets.html, testing-focus-indication.html, testing-focus-management.html, testing-focus-order.html, testing-form-colour-contrast.html, testing-form-error-messaging.html, testing-form-errors.html, testing-form-instructions.html, testing-form-labels.html, testing-headings.html, testing-images.html, testing-input-name.html, testing-lang-good.html, testing-lang-invalid.html, testing-lang-missing.html, testing-links.html, testing-menu.html, testing-modal-enhanced.html, testing-modal-minimal.html, testing-modal-traditional.html, testing-movement.html, testing-name-mismatches.html, testing-name-prohibited-roles.html, testing-non-text-contrast.html, testing-onsubmit-complex.html, testing-onsubmit-simple.html, testing-output.html, testing-phrasing-content.html, testing-placeholder.html, testing-progress.html, testing-required-fields.html, testing-required.html, testing-roles.html, testing-shadow-dom.html, testing-slider-native-vs-custom.html, testing-slot.html, testing-states.html, testing-sticky-header.html, testing-svg-inside-links.html, testing-svg.html, testing-tables-aria.html, testing-tables-complex.html, testing-tables-scope.html, testing-tables.html, testing-target.html, testing-text-contrast.html, testing-timer1.html, testing-timer2.html, testing-tools.html, testing-tooltip-css.html, testing-use-of-color.html, testing.html

Note: `testing-contact-form.html` was deliberately removed at one point but reappears in this list as it was used in several presentations and workshops related to "Creating accessible acceptance criteria".

---

## How to work with Russ
- Direct, technically precise, appreciates being told when something is genuinely uncertain rather than confidently guessed
- Runs real AT/browser testing himself and reports results back, treat his tested findings as authoritative over spec text or general knowledge when they conflict
- Values concise, scoped git commits and clean, minimal, unstyled-by-default HTML (resists "pretty" default styling, prefers matching the existing site's plain conventions)
- Long-time accessibility educator (30 years), so technical explanations can assume real expertise, but he explicitly still asks for the "why," not just the "what," even on things he already knows well
- Uses dry, sometimes dark humour; appreciates directness over hedging

---

## Code sample (`<pre><code>`) philosophy

### Goals

1. Samples should be as simple, readable, and understandable as possible.
2. No horizontal scrolling inside the `<pre>` element.
3. Key concepts should be highlighted, at a glance, not buried in a wall of attributes.

### Techniques

- **One attribute per line** for any element with enough attributes that they'd otherwise cause horizontal scroll or bury the important one.
- **Indentation tells the story.** Nesting should reflect structure, attributes indented one level deeper than their tag, closing `</tag>` aligned with the opening tag, not with the attributes.
- **Closing bracket (`>`) on its own line**, out-dented to match the start of the opening tag. This helps newbies see clearly where the opening tag ends, e.g.:

  ```html
  <button
    aria-controls="panel-1"
    aria-expanded="false"
  >
    Show details
  </button>
  ```

- **Strip non-essential IDs and classes.** Only keep an `id`, `class`, or attribute if it's part of the story being told (e.g. the `id` a highlighted `aria-controls` value resolves to stays; an unrelated `id` on the same button doesn't).
- **Section comments** (`<!-- Button -->`, `<!-- Panel -->`, `<!-- Select -->`, etc.) break up bigger, multi-element samples into readable chunks.
- **Shorten content text** to a representative fragment rather than full sentences (e.g. `Wombats are sturdy...` rather than a full paragraph), keeps the sample scannable.

### Not a rigid rule

Simple examples (few attributes, one or two elements) don't need vertical attribute formatting or section comments, that's overkill for something already clear at a glance. This is applied by feel: whenever a sample risks being unclear at a glance, add the structuring steps above until it isn't.

### CSS classes used inside `<pre><code>`

```css
.codeHighlight,
.highlight {
  background: rgba(255, 255, 0, .3);
  padding: .1em .3em;
  border-radius: .2em;
}
.comment {
  color: #999;
}
```

- `.highlight` / `.codeHighlight`: makes the relevant attribute/value stand out clearly (the thing the example is actually demonstrating).
- `.comment`: dims section comments so they're still readable but visibly less important than the highlighted content.

### Common pitfall to watch for

When copy-pasting one formatted sample to build another, check the opening tag itself isn't left indented relative to its own attributes and closing tag. The bug looks like this:

```html
<!-- wrong: <button is indented further right than its own attributes/closing tag -->
  <button
  aria-controls="panel-1"
  aria-expanded="false"
>
  Show details
</button>
```

Also worth a general habit: whenever the live example markup changes, re-check the matching `<pre><code>` sample against it. Drift between the two is a recurring, easy-to-miss bug.
