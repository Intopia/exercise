document.querySelectorAll('.table-wrap').forEach((wrap, i) => {
  const caption = wrap.querySelector('caption');

  // Give the caption an ID if it doesn't already have one
  if (caption && !caption.id) {
    caption.id = 'table-caption-' + (i + 1);
  }

  const update = () => {
    const scrolls = wrap.scrollWidth > wrap.clientWidth;

    if (scrolls) {
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('role', 'region');
      if (caption) {
        wrap.setAttribute('aria-labelledby', caption.id);
      }
    } else {
      wrap.removeAttribute('tabindex');
      wrap.removeAttribute('role');
      wrap.removeAttribute('aria-labelledby');
    }
  };

  new ResizeObserver(update).observe(wrap);
});