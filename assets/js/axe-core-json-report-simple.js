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
    // Impact order, most severe first
    const order = ['critical', 'serious', 'moderate', 'minor'];
    const rank = (impact) => (order.includes(impact) ? order.indexOf(impact) : order.length);
    const sortByImpact = (rules) => [...rules].sort((a, b) => rank(a.impact) - rank(b.impact));
    // { critical: 2, serious: 7, moderate: 3 }
    const byImpact = (rules) => {
      const counts = {};
      rules.forEach((rule) => rule.nodes.forEach((n) => {
        const key = n.impact || rule.impact || 'not set';
        counts[key] = (counts[key] || 0) + 1;
      }));
      const sorted = {};
      [...order, 'not set'].filter((k) => counts[k]).forEach((k) => { sorted[k] = counts[k]; });
      return sorted;
    };

    // 3. Build one section (fails or needs review), most severe rules first.
    //    fixAny: fixing one of these is enough.
    //    fixAll: every one of these must be fixed.
    const section = (rules) => {
      const sorted = sortByImpact(rules);
      return {
        count: sorted.reduce((n, rule) => n + rule.nodes.length, 0),
        ruleCount: sorted.length,
        byImpact: byImpact(sorted),
        rules: sorted.map((rule) => ({
          id: rule.id,
          help: rule.help,
          description: rule.description,
          impact: rule.impact || null,
          tags: rule.tags,
          helpUrl: rule.helpUrl,
          count: rule.nodes.length,
          nodes: rule.nodes.map((n, i) => ({
            number: i + 1,
            html: n.html,
            selector: n.target.join(' '),
            impact: n.impact || null,
            fixAny: n.any.map((c) => c.message),
            fixAll: [...n.all, ...n.none].map((c) => c.message),
          })),
        })),
      };
    };

    // 4. Put the whole report together
    const report = {
      page: {
        title: document.title,
        url: r.url.replace(/^file:\/\/.*?\/exercise\//, 'https://intopia.github.io/exercise/'),
      },
      run: r.timestamp,
      runLocal: new Date(r.timestamp).toLocaleString(),
      axeVersion: r.testEngine.version,
      rulesPassed: r.passes.length,
      rulesNotApplicable: r.inapplicable.length,
      fails: section(r.violations),
      needsReview: section(r.incomplete),
    };

    // 5. Build a file name from the page title and today's date
    const slug = (document.title || location.hostname || 'page')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'page';
    const d = new Date();
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const fileName = `axe-report-simple-${slug}-${date}.json`;

    // 6. Download it as a file
    const json = JSON.stringify(report, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    console.log(`axe report saved as ${fileName}`);
  } catch (e) {
    console.error(`axe report failed: ${e.message}`);
  }
})();
