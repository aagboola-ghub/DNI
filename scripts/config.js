
export async function loadConfig(url){ const res = await fetch(url); return await res.json(); }
