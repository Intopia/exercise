# Results of `:focus` and `:focus-visible` browser review

Browsers decide for themselves when to show a focus indicator. Tab to a button and you usually see a ring. Click the same button and you usually don't. That decision is what `:focus-visible` is built on, but it isn't written down anywhere as a simple list, and most explanations stop at "buttons don't show a ring, text fields do".

These tests set out to find what actually happens, control by control, rather than relying on that shorthand. Every HTML form control was tested three ways: with no CSS at all, to see what the browser does on its own; with a `:focus-visible` rule, to see whether an author's rule fires in the same places as the browser's own indicator; and with a `:focus` rule, to work out whether a control that shows no ring is one the browser chose not to indicate, or one that never received focus in the first place.

Each control was checked twice per variation: once by tabbing to it, and once by clicking it. The results are below.

---

## Browsers and operating systems tested

Tested in September 2026 across 24 form controls, three CSS variations and five browser and operating system combinations. 360 results in total.

macOS 26.7:

- Chrome 153.0
- Firefox 156.0
- Safari 27.0

Windows 11, version 25H2:

- Chrome 153.0
- Firefox 156.0

Safari was tested with "Press Tab to highlight each item on a webpage" turned on, since it is off by default and without it Tab skips most form controls.

The three CSS variations were:

- Browser default, with no CSS at all
- `:focus-visible { outline: 3px solid red; outline-offset: 2px; }` only
- `:focus { outline: 3px solid purple; outline-offset: 2px; }` only

Test page: [add link]

---

## Default browser behaviour

Tabbing: every control shows a focus ring, with three exceptions, all in Safari on macOS. `range` shows no ring at all, `color` can't be reached by Tab, and the date fields move focus through their individual segments rather than the whole control. The ring's colour also varies by platform. Chrome on Windows draws a dark ring rather than the blue one used on macOS.

Clicking: text fields and the date family show a ring. These don't:

- Buttons: `<button>`, `<input type="button">`, `<input type="reset">`, `<input type="submit">`, `<input type="image">`
- Toggles: `<input type="checkbox">`, `<input type="radio">`
- Others: `<input type="color">`, `<input type="file">`, `<input type="range">`

`<select>` varies by browser and is covered separately.

---

## `:focus-visible` styling only

Tabbing: every control that can be reached by Tab shows the red outline, in every browser. This includes Safari's `range`, which gets an outline where Safari draws none of its own. Safari's `color` still can't be reached by Tab, so the rule never gets a chance to apply there.

Clicking: the results match the default pass almost exactly. The same controls show an outline, the same ones don't. This is the main finding: when you write a `:focus-visible` rule, you get the same behaviour the browser already uses for its own focus styles.

The one exception is `<select>` in Chrome on Windows, where the browser shows no default ring but the `:focus-visible` rule does paint. That's the only case where the click results differ, out of 120 comparisons. Together with Safari's `range` on Tab, it shows that a browser's own focus ring and `:focus-visible` matching are two separate decisions, and they can come apart.

---

## `:focus` styling only

Tabbing: every control shows the purple outline, in every browser, including Safari's `range`.

Clicking: this is where the browsers separate.

In Chrome and Firefox, on both platforms, every control shows an outline on click. So those controls did receive focus in the earlier passes, the browser simply chose not to show an indicator.

In Safari on macOS, buttons, checkboxes, radios, submit, reset and image show nothing at all. That's not a hidden indicator, it's no focus. macOS convention is that clicking these controls doesn't focus them.

`<input type="file">` shows no outline in any browser, because the file dialog takes focus and the indicator isn't redrawn when focus returns.

---

## Key findings

1. There's a difference between tabbing and clicking in most cases, as expected.

2. The controls that don't show a ring on click vary a little between browsers, but generally include buttons (`<button>`, `<input type="button">`, `<input type="reset">`, `<input type="submit">`, `<input type="image">`), toggles (`<input type="checkbox">`, `<input type="radio">`) and some others (`<input type="color">`, `<input type="file">`, `<input type="range">`). `<select>` differs across browsers. The list is the same whether you rely on browser defaults or write your own `:focus-visible` rule, with the one exception covered above.

3. If you want the same behaviour for tabbing and clicking, `:focus` is the better choice. It showed an indicator on every control in every browser, on both Tab and click, with two exceptions: `<input type="file">`, where the indicator isn't redrawn after the file dialog, and Safari, where clicking buttons, checkboxes and radios doesn't set focus at all, so there's nothing to style.

4. The missing ring matters most on controls you keep using after clicking. `<input type="checkbox">`, `<input type="radio">`, `<input type="range">` and `<select>` all respond to the keyboard straight after a click, with nothing on screen to show which control you're driving.

5. `<input type="file">` is the outlier. Clicking it opens a system dialog, which takes focus away from the page. When you return, focus is back on the input, but the indicator isn't redrawn. This happens in Chrome, Firefox and Safari, whether you rely on defaults, `:focus-visible` or `:focus`, and whether you choose a file or cancel. It's the one control where no CSS approach gives you a visible indicator after a click.

---

## What this means in practice

Test focus with the keyboard, not the mouse. A missing ring after a click is usually expected behaviour rather than a fault, and the same missing ring can have several different causes. In Chrome and Firefox it means the browser hid the indicator. In Safari it means the control never received focus. With `<input type="file">` it means the indicator wasn't redrawn even though focus was there and the CSS matched.

You can't tell those apart by looking, so when a ring doesn't appear, the useful question isn't "which selector did they use", it's "does this element have focus at all".
