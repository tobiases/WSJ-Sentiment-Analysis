// Scrape CNBC headlines
(function() {
  const headlines = [];
  document.querySelectorAll('.Card-title, .RiverHeadline-headline, h2').forEach(el => {
    const text = el.innerText.trim();
    if(text && text.length > 10) headlines.push(text);
  });
  window.postMessage({ type: 'CNBC_HEADLINES', headlines }, "*");
})();