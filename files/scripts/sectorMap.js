// Map companies/words to sectors
const sectorKeywords = {
  Technology: ["apple", "microsoft", "google", "amazon", "meta", "ai", "chip", "semiconductor", "tech"],
  Finance: ["bank", "goldman", "jpmorgan", "finance", "investment", "credit", "fed", "nasdaq", "s&p", "dow", "loan"],
  Energy: ["oil", "gas", "chevron", "exxon", "energy", "bp", "shell", "petroleum"],
  Healthcare: ["pharma", "health", "vaccine", "medical", "pfizer", "moderna", "biotech"],
  Consumer: ["retail", "walmart", "costco", "consumer", "target", "shop", "sales"],
  Industrials: ["boeing", "caterpillar", "industrial", "manufacturing"],
  Utilities: ["utility", "utilities", "electric", "power"],
  Materials: ["gold", "mining", "metals", "materials"],
  RealEstate: ["real estate", "realtor", "property", "housing"]
};
function getSector(headline) {
  let text = headline.toLowerCase();
  for(const [sector, words] of Object.entries(sectorKeywords)) {
    if(words.some(w => text.includes(w))) return sector;
  }
  return "Other";
}