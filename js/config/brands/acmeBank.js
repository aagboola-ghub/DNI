export default {
  id: "acmeBank",
  name: "Acme Bank",
  tokens: { colorPrimary: "#111827", colorAccent:"#10B981", colorDark:"#111827", textOnPrimary:"#ffffff" },
  assets: { logo: "acme-logo.svg", hero: "acme-logo.svg", favicon: "acme-logo.svg" },
  content: {
    heroHeadline: "Modern Banking for Teams",
    heroSub: "See how call attribution actually works—pre-click to post-call.",
    ctaText: "Get Started",
    productLinks: [{title:"Payments",href:"#"}, {title:"Loans",href:"#"}]
  },
  phoneSurfaces: {
    primary: { label: "Sales",   default: "(800) 555-0300" },
    support: { label: "Support", default: "(800) 555-0400" }
  },
  rulesOverride: null
};
