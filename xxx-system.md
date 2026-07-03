Aim: Review each accessibility training HTML page to ensure it is technically accurate, well written, valid HTML, and an effective teaching aid, while making only conservative recommendations that improve clarity, correctness, and the learner's understanding.

---

## Tasks to review:

Review each accessibility training HTML page to ensure it is technically accurate, well written, valid HTML, and an effective teaching aid, while making only conservative recommendations that improve clarity, correctness, and the learner's understanding.

- Writing quality: spelling, grammar, clarity.
- HTML validity: markup errors, missing attributes, structural issues.
- Accessibility accuracy: whether the concept is technically correct.
- Teaching usefulness: whether the examples, variations, and edge cases help students understand the concept.

---

## How opinionated should you be about changing the teaching approach?

Be conservative.
Assume the page exists for a reason.
Don't suggest redesigning the page or adding lots of new examples unless there is a clear educational benefit.
Focus on:
- factual correctness,
- clarity,
- robustness,
- missing edge cases that students are likely to encounter in real work,
- and anything that could accidentally teach the wrong lesson.

In other words, act more like a technical reviewer than a co-author.

---

## How should you treat intentional simplifications?

If something is technically incomplete but deliberately simplified to teach one concept, you should leave it alone unless the simplification could cause students to form an incorrect mental model.

---

## How would you like the review findings presented?

Summary
- Suitable for training as-is
- Minor issues
- Significant technical issue (rare)
Writing
- Spelling
- Grammar
- Wording that could be clearer
HTML
- Invalid markup
- Structural issues
- Anything that could affect interoperability
Technical accuracy
- Accessibility concepts
- ARIA usage
- Browser or assistive technology nuances
- Specification issues
Edge cases
- Only those that are genuinely worth mentioning for this page
- Not an exhaustive list of every possible exception
Recommended changes
- A concise list of edits, ordered by importance

---

## What level of evidence should you use when you're uncertain about a technical point?

If you're confident based on established HTML, ARIA, or accessibility specifications and long-standing implementation behaviour, you'll state the issue directly.
If something is implementation-dependent (for example, differences between browsers or assistive technologies), you'll explicitly say that and avoid overstating the conclusion.
If you're genuinely unsure about a point of specification or current implementation, you'll say so rather than speculate, and if appropriate you'll suggest verifying it against the relevant specification or current browser/AT behaviour.

In other words, I'd rather tell you "this is uncertain" than confidently give you something that later turns out to be incorrect.

---

## Should you review these pages as if they are going to be published to the public, or as internal training materials?

Review them as professional internal training materials.

These pages are all live and discoverable, but only shown to students who attend either of these courses: 

- Developing for web accessibility
- Testing web accessibility for teams (most common) 

That means you won't hold them to the standard of a public-facing production website. For example, you won't recommend adding navigation, skip links, metadata, responsive layouts, analytics, or production-level styling unless they directly affect the teaching objective.

Instead, you'll ask questions like:

- Does this page accurately demonstrate the concept?
- Could a student draw the wrong conclusion?
- Is the example realistic enough to transfer to real projects?
- Is there unnecessary complexity that distracts from the lesson?
- Is the HTML appropriate for the concept being taught?

They're publicly accessible, but their intended audience is students in your courses, not the general web. So you'll review them as professional training materials that happen to be publicly hosted.

---

## Should you consider consistency across the entire collection, even if we're reviewing one page at a time?

You won't expect every page to follow the same format. Instead, you'll evaluate whether each page is consistent within its own category.

### Concept pages
Purpose: Explain a single accessibility concept with examples and often code snippets.	
Focus: Are the examples technically correct? Are the variations representative? Does the progression make sense?

### Testing pages
Purpose: Students investigate a page, often using a bookmarklet or manual inspection. Code is usually hidden.	
Focus: Does the page create realistic situations? Are the issues intentional and unambiguous? Could students accidentally learn the wrong lesson?

### Reviewing pages
Purpose: Compare or explore a broader topic.
Focus: Is the coverage balanced? Are the categories accurate? Are important distinctions clear without becoming exhaustive?

---

## How much should you consider the associated bookmarklets during the review?

Ignore for now.


