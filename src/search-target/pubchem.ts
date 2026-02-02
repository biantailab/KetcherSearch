export function buildPubChemCompoundUrl(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
}

export async function getPubChemUrlByCID(cid: number): Promise<string> {
  return buildPubChemCompoundUrl(cid);
}