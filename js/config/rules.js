// Ordered list; first match wins. null number => use brand default.
export default [
  { when:{ source:["google","bing"], medium:"cpc", campaignContains:"business" }, assign:{ surface:"primary", number:"(800) 777-1001" } },
  { when:{ source:"google", medium:"cpc" }, assign:{ surface:"primary", number:"(800) 777-1002" } },
  { when:{ source:"bing",   medium:"cpc" }, assign:{ surface:"primary", number:"(800) 777-1003" } },
  { when:{ medium:"organic" },            assign:{ surface:"primary", number:"(800) 777-2001" } },
  { when:{ source:"facebook", medium:["paid_social","social"] }, assign:{ surface:"primary", number:"(800) 777-3001" } },
  { when:{ any:true }, assign:{ surface:"primary", number:null } }
];
