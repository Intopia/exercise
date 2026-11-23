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

    // 2. Swap local exercise file paths for the public URL, as the other reports do
    r.url = r.url.replace(/^file:\/\/.*?\/exercise\//, 'https://intopia.github.io/exercise/');

    // 3. Build a file name from the page title and today's date
    const slug = (document.title || location.hostname || 'page')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'page';
    const d = new Date();
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const fileName = `axe-report-complete-${slug}-${date}.json`;

    // 4. Download the complete results as a file (left exactly as axe returns them)
    const json = JSON.stringify(r, null, 2);
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
