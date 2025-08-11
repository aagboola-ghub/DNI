import { SETTINGS } from "../config/index.js";
import { getState, patch, merge } from "../store.js";
import { assignNumbers } from "../core/dni-engine.js";
import { replaceDOM } from "../core/replacer.js";
import LandingView from "../ui/LandingView.js";
import SerpView from "../ui/SerpView.js";

const viewRoot = () => document.getElementById("view-root");

function randSuffix(){ return Math.random().toString(36).slice(2,10); }

function computeUtmAndClickId(selection, utm){
  // Implements the Field Rules by Traffic Source
  const res = { source:"", medium:"", clickId:"" };
  switch(selection.source){
    case "google":
      res.source = "google";
      if (selection.flavor === "paid"){ res.medium = "cpc"; res.clickId = "gclid-"+randSuffix(); }
      else { res.medium = "organic"; res.clickId = ""; }
      break;
    case "bing": // Microsoft/Bing label should be 'bing'
      res.source = "bing";
      if (selection.flavor === "paid"){ res.medium = "cpc"; res.clickId = "msclkid-"+randSuffix(); }
      else { res.medium = "organic"; res.clickId = ""; }
      break;
    case "facebook":
      res.source = "facebook";
      if (selection.flavor === "paid"){ res.medium = "paid_social"; res.clickId = "fbclid-"+randSuffix(); }
      else { res.medium = "social"; res.clickId = SETTINGS.fbclidOnOrganic ? "fbclid-"+randSuffix() : ""; }
      break;
    case "direct":
    default:
      res.source = "direct"; res.medium = "none"; res.clickId = "";
  }
  return {
    utm: {
      source: res.source,
      medium: res.medium,
      campaign: utm.campaign || "",
      term: utm.term || "",
      content: utm.content || ""
    },
    clickId: res.clickId
  };
}

function buildLandingUrl(utm, clickId){
  const base = "/business/checking"; // simple demo path
  const params = new URLSearchParams();
  if (utm.source)  params.set("utm_source", utm.source);
  if (utm.medium)  params.set("utm_medium", utm.medium);
  if (utm.campaign)params.set("utm_campaign", utm.campaign);
  if (utm.term)    params.set("utm_term", utm.term);
  if (utm.content) params.set("utm_content", utm.content);
  if (clickId){
    if (clickId.startsWith("gclid")) params.set("gclid", clickId);
    if (clickId.startsWith("msclkid")) params.set("msclkid", clickId);
    if (clickId.startsWith("fbclid")) params.set("fbclid", clickId);
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function visitFromSerp(){
  const s = getState();
  // Compute UTMs and clickId
  const { utm, clickId } = computeUtmAndClickId(s.selection, s.utm);
  const url = buildLandingUrl(utm, clickId);
  patch({ stage:"landing", utm, clickId, landingUrl:url });
  assignNumbers(); replaceDOM();
  LandingView(viewRoot());
}

export function applyChannelChange(){
  const s = getState();
  if (s.stage !== "landing") return;
  if (s.trackingType !== "channel") return; // no-op in session mode
  const { utm, clickId } = computeUtmAndClickId(s.selection, s.utm);
  const url = buildLandingUrl(utm, clickId);
  patch({ utm, clickId, landingUrl:url });
  assignNumbers(); replaceDOM();
  LandingView(viewRoot());
}

export function renderStage(){
  const s = getState();
  if (s.stage === "serp") SerpView(viewRoot()); else LandingView(viewRoot());
}
