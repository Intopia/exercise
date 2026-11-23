(async () => {
  try {
    // 0. Load axe-core if it isn't already on the page
    if (!window.axe) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/axe-core@4.14.0/axe.min.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('Could not load axe-core. The site may block outside scripts.'));
        document.head.appendChild(s);
      });
    }

    // 1. Run axe on the page
    const r = await axe.run();

    // 2. Small helpers
    // Make text safe to put inside HTML
    const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    // "1 rule", "2 rules"
    const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
    // Impact order, most severe first
    const order = ['critical', 'serious', 'moderate', 'minor'];
    const rank = (impact) => (order.includes(impact) ? order.indexOf(impact) : order.length);
    const sortByImpact = (rules) => [...rules].sort((a, b) => rank(a.impact) - rank(b.impact));
    // Total number of elements across a set of rules
    const nodeCount = (rules) => rules.reduce((n, rule) => n + rule.nodes.length, 0);
    // "2 critical, 7 serious, 3 moderate"
    const breakdown = (rules) => {
      const counts = {};
      rules.forEach((rule) => rule.nodes.forEach((n) => {
        const key = n.impact || rule.impact || 'not set';
        counts[key] = (counts[key] || 0) + 1;
      }));
      return [...order, 'not set'].filter((k) => counts[k]).map((k) => `${counts[k]} ${k}`).join(', ');
    };

    // 3. Sort both lists so the most severe rules come first
    const fails = sortByImpact(r.violations);
    const review = sortByImpact(r.incomplete);

    // 4. Headline summary lines
    const failsLine = nodeCount(fails)
      ? `${nodeCount(fails)} across ${plural(fails.length, 'rule')} (${breakdown(fails)})`
      : 'none';
    const reviewLine = nodeCount(review)
      ? `${nodeCount(review)} across ${plural(review.length, 'rule')}`
      : 'none';

    // 5. Turn a node's problems into readable HTML.
    //    Heading lines ("Fix any of the following:") are bold; the indented
    //    lines under them are the individual checks.
    //    "Fix any" means fixing one of the checks is enough.
    //    "Fix all" means every check listed must be fixed.
    const problems = (n) => {
      let lines;
      if (n.failureSummary) {
        lines = n.failureSummary.split('\n');
      } else {
        // Fallback if axe gave no summary for this element
        lines = [];
        if (n.any.length) lines.push('Fix any of the following:', ...n.any.map((c) => '  ' + c.message));
        const all = [...n.all, ...n.none];
        if (all.length) lines.push('Fix all of the following:', ...all.map((c) => '  ' + c.message));
      }
      return lines.filter((line) => line.trim()).map((line) =>
        /^\s/.test(line)
          ? `<span class="check">${esc(line.trim())}</span>`
          : `<strong>${esc(line.trim())}</strong>`
      ).join('<br>');
    };

    // 6. Build one section (fails or needs review)
    const section = (title, rules) => {
      let out = `<h2>${title} (${nodeCount(rules)})</h2>`;
      if (!rules.length) return out + '<p>None.</p>';
      for (const rule of rules) {
        out += `<h3>${esc(rule.id)}: ${esc(rule.help)} (${rule.nodes.length})</h3>
          <p>${esc(rule.description)}</p>
          <p>Impact: ${esc(rule.impact || 'not set')}. <a href="${esc(rule.helpUrl)}">Rule details on Deque University</a></p>
          <p>Tags: ${rule.tags.map((t) => `<code>${esc(t)}</code>`).join(', ')}</p>
          <table><thead><tr><th scope="col">#</th><th scope="col">Element</th><th scope="col">Selector</th><th scope="col">Problem</th></tr></thead><tbody>`;
        rule.nodes.forEach((n, i) => {
          out += `<tr><td>${i + 1}</td><td><code>${esc(n.html)}</code></td><td><code>${esc(n.target.join(' '))}</code></td><td>${problems(n)}</td></tr>`;
        });
        out += '</tbody></table>';
      }
      return out;
    };

    // 7. Build a file name from the page title and today's date
    const slug = (document.title || location.hostname || 'page')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'page';
    const d = new Date();
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const fileName = `axe-report-detailed-${slug}-${date}.html`;

    // 8. Put the whole page together
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>axe report: ${esc(document.title)}</title>
<style>
  body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 2rem; color: #1d1d1f; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
  th, td { border: 1px solid #ccc; padding: .4rem .6rem; text-align: left; vertical-align: top; }
  th { background: #f2f2f2; }
  code { font-size: .85rem; word-break: break-word; }
  h2 { border-top: 3px solid #1d1d1f; padding-top: 1rem; margin-top: 2.5rem; }
  .check { display: inline-block; padding-left: 1.25rem; }
</style></head><body>
<main>
<h1>axe report</h1>
<ul>
  <li>Page: <a href="${esc(r.url.replace(/^file:\/\/.*?\/exercise\//, 'https://intopia.github.io/exercise/'))}">${esc(document.title)}</a></li>
  <li><strong>Fails: ${failsLine}</strong></li>
  <li>Needs review: ${reviewLine}</li>
  <li>Run: ${new Date(r.timestamp).toLocaleString()}</li>
  <li>axe-core ${esc(r.testEngine.version)}</li>
  <li>Rules passed: ${r.passes.length}. Rules not applicable: ${r.inapplicable.length}.</li>
</ul>
${section('Fails', fails)}
${section('Needs review', review)}
</main>
</body></html>`;

    // 9. Download it as a file
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    console.log(`axe report saved as ${fileName}`);
  } catch (e) {
    console.error(`axe report failed: ${e.message}`);
  }
})();
