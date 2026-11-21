(async () => {
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

  // 2. Make text safe to put inside HTML
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // 3. Build one section (fails or needs review)
  const section = (title, rules) => {
    const count = rules.reduce((n, rule) => n + rule.nodes.length, 0);
    let out = `<h2>${title} (${count})</h2>`;
    if (!rules.length) return out + '<p>None.</p>';
    for (const rule of rules) {
      out += `<h3>${esc(rule.id)}: ${esc(rule.help)} (${rule.nodes.length})</h3>
        <p>Impact: ${esc(rule.impact)}. <a href="${esc(rule.helpUrl)}">Rule details on Deque University</a></p>
        <table><thead><tr><th scope="col">#</th><th scope="col">Element</th><th scope="col">Selector</th><th scope="col">Problem</th></tr></thead><tbody>`;
      rule.nodes.forEach((n, i) => {
        const msgs = [...n.any, ...n.all, ...n.none].map((c) => esc(c.message)).join('<br>');
        out += `<tr><td>${i + 1}</td><td><code>${esc(n.html)}</code></td><td><code>${esc(n.target.join(' '))}</code></td><td>${msgs}</td></tr>`;
      });
      out += '</tbody></table>';
    }
    return out;
  };

  // 4. Put the whole page together
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>axe report: ${esc(document.title)}</title>
<style>
  body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 2rem; color: #1d1d1f; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
  th, td { border: 1px solid #ccc; padding: .4rem .6rem; text-align: left; vertical-align: top; }
  th { background: #f2f2f2; }
  code { font-size: .85rem; word-break: break-word; }
  h2 { border-top: 3px solid #1d1d1f; padding-top: 1rem; margin-top: 2.5rem; }
</style></head><body>
<h1>axe report</h1>
<ul>
  <li>Page: <a href="${esc(r.url)}">${esc(document.title)}</a></li>
  <li>Run: ${new Date(r.timestamp).toLocaleString()}</li>
  <li>axe-core ${esc(r.testEngine.version)}</li>
  <li>Rules passed: ${r.passes.length}. Rules not applicable: ${r.inapplicable.length}.</li>
</ul>
${section('Fails', r.violations)}
${section('Needs review', r.incomplete)}
</body></html>`;

  // 5. Download it as a file
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  a.download = 'axe-report.html';
  a.click();
})();