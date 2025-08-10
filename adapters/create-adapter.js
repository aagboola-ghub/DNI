export async function createAdapter(profile){
  const mod = await import('./marchex-mock.js');
  return mod.createMockAdapter(profile);
}
