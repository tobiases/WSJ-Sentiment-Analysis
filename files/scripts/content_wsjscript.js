// content_wsjscript.js
(function() {
  const headlines = [];
  document.querySelectorAll('[class*="HeadlineTextBlock"]').forEach(el => {
    const text = el.innerText.trim();
    if (text && text.length > 10 && !headlines.includes(text)) headlines.push(text);
  });
  chrome.runtime.sendMessage({ type: 'WSJ_HEADLINES', headlines });
})();