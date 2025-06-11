// Scrape Bloomberg headlines
(function() {
  const headlines = [];
  document.querySelectorAll('.lede-text-v2__hed, h1, h2').forEach(el => {
    const text = el.innerText.trim();
    if(text && text.length > 10) headlines.push(text);
  });
  window.postMessage({ type: 'BLOOMBERG_HEADLINES', headlines }, "*");
})();