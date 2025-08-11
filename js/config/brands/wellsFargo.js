export default {
  id: "wellsFargo",
  name: "Wells Fargo Business Banking",
  tokens: {
    colorPrimary: "#D71E28",
    colorAccent:  "#FFBC38",
    colorDark:    "#003366",
    textOnPrimary:"#ffffff"
  },
  assets: { logo: "wf-logo.svg", hero: "wf-logo.svg", favicon: "wf-logo.svg" },
  content: {
    heroHeadline: "Business Banking, Simplified",
    heroSub: "Track every call back to its source with Marchex DNI.",
    ctaText: "Talk to Sales",
    productLinks: [{title:"Checking",href:"#"}, {title:"Savings",href:"#"}, {title:"Credit",href:"#"}]
  },
  phoneSurfaces: {
    primary: { label: "Sales",   default: "(800) 555-0100" },
    support: { label: "Support", default: "(800) 555-0200" }
  },
  rulesOverride: null
};
