let allHeadlines = [];
let allSentiments = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'WSJ_HEADLINES') {
    allHeadlines = message.headlines;
    analyzeAndDisplay();
  }
});

document.getElementById('scrape').onclick = async function() {
  document.getElementById('status').textContent = "Analyzing headlines...";
  allHeadlines = [];
  allSentiments = [];
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab) {
    document.getElementById('status').textContent = "No active tab found.";
    return;
  }
  if (!tab.url.includes('wsj.com')) {
    document.getElementById('status').textContent = "Not a supported news site.";
    return;
  }
  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['scripts/content_wsjscript.js']
  });
  setTimeout(() => {
    if (allHeadlines.length === 0) {
      document.getElementById('status').textContent = "No headlines found. Try refreshing the page.";
    }
  }, 1500);
};

document.getElementById('copy').onclick = function() {
  if (!allHeadlines.length) {
    document.getElementById('status').textContent = "Nothing to copy.";
    return;
  }
  const rows = allHeadlines.map((h, i) => {
    const sentiment = allSentiments[i] || getSentiment(h);
    return `${sentiment}\t${h}`;
  });
  const text = rows.join('\n');
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('status').textContent = "Copied to clipboard!";
  });
};

function analyzeAndDisplay() {
  if (!allHeadlines.length) return;

  let bullish = 0, bearish = 0, neutral = 0;
  allSentiments = allHeadlines.map(h => getSentiment(h));
  let details = "";
  allHeadlines.forEach((h, idx) => {
    const sentiment = allSentiments[idx];
    if (sentiment === "Bullish") bullish++;
    else if (sentiment === "Bearish") bearish++;
    else neutral++;
    details += `<li class="${sentiment.toLowerCase()}">[${sentiment}] ${h}</li>`;
  });

  // Calculate percentages
  let total = allHeadlines.length;
  let perc_bullish = Math.round(100 * bullish / total);
  let perc_bearish = Math.round(100 * bearish / total);
  let perc_neutral = 100 - perc_bullish - perc_bearish;

  // Find dominant sentiment
  let dominant = "Neutral", color = "#a8a8a8", perc = perc_neutral;
  if (bullish >= bearish && bullish >= neutral) {
    dominant = "Bullish"; color = "#24cc7b"; perc = perc_bullish;
  } else if (bearish >= bullish && bearish >= neutral) {
    dominant = "Bearish"; color = "#f14d5d"; perc = perc_bearish;
  }

  // Large dominant percentage
  document.getElementById('sentiment-percentage').innerHTML =
    `<span style="color:${color}">${perc}% ${dominant}</span>`;

  // Small per-sentiment percentages
  document.getElementById('sentiment-percentages').innerHTML = `
    <span class="percent-bullish">${perc_bullish}% Bullish</span>
    <span class="percent-neutral">${perc_neutral}% Neutral</span>
    <span class="percent-bearish">${perc_bearish}% Bearish</span>
  `;

  // Sentiment bar as flex segments
  document.getElementById('bar-bullish').style.width = perc_bullish + "%";
  document.getElementById('bar-bearish').style.width = perc_bearish + "%";
  document.getElementById('bar-neutral').style.width = perc_neutral + "%";

  // Headline list
  document.getElementById('headline-list').innerHTML = details;

  document.getElementById('status').textContent = "Done!";
}