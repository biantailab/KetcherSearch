import type { PubChemSection } from "../types/pubchem";

const cidCache = new Map<string, number | null>();
const smilesCache = new Map<string, string | null>();

async function fetchSynonymsByCID(cid: number): Promise<string[]> {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/synonyms/JSON`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Synonyms query failed: ${response.status}`);
  }
  const data = await response.json();
  const synonyms: string[] = data.InformationList?.Information?.[0]?.Synonym || [];
  return Array.from(new Set((synonyms || []).map((s: string) => s?.trim()).filter(Boolean)));
}

export async function getPubChemCID(smiles: string): Promise<number | null> {
  if (cidCache.has(smiles)) {
    return cidCache.get(smiles)!;
  }
  const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(
    smiles
  )}/cids/JSON`;
  try {
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`PubChem search failed: ${searchResponse.status}`);
    }
    const searchData = await searchResponse.json();
    if (!searchData.IdentifierList?.CID?.[0]) {
      return null;
    }
    const cid = searchData.IdentifierList.CID[0];
    cidCache.set(smiles, cid);
    return cid;
  } catch (e) {
    cidCache.set(smiles, null);
    return null;
  }
}

export function buildPubChemCompoundUrl(cid: number): string {
  return `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
}

export async function getPubChemUrlByCID(cid: number): Promise<string> {
  return buildPubChemCompoundUrl(cid);
}

export async function getWikipediaUrlByCID(cid: number): Promise<string | null> {
  const data = await getPubChemData(cid);
  const synonyms = await getSynonymsByCID(cid);
  return (
    findWikipediaLink(
      data.Record?.Section,
      data.Record?.RecordTitle,
      synonyms
    ) || null
  );
}

export async function getCASByCID(cid: number): Promise<string | null> {
  try {
    const synonyms = await fetchSynonymsByCID(cid);
    const casNumber = synonyms.find(
      (syn: string) => /^\d+-\d{2}-\d$/.test(syn) && !syn.startsWith("EC")
    );
    return casNumber || null;
  } catch (e) {
    return null;
  }
}

export async function getSynonymsByCID(cid: number): Promise<string[]> {
  try {
    return await fetchSynonymsByCID(cid);
  } catch (e) {
    return [];
  }
}

export async function getPubChemData(cid: number): Promise<any> {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON/`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PubChem data: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    throw e; // Re-throw for this function as it's used internally
  }
}

export async function getIUPACNameByCID(cid: number): Promise<string | null> {
  const nameUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IUPACName/JSON`;
  try {
    const nameResponse = await fetch(nameUrl);
    if (!nameResponse.ok) {
      throw new Error(`Failed to fetch IUPACName: ${nameResponse.status}`);
    }
    const nameData = await nameResponse.json();
    return nameData.PropertyTable?.Properties?.[0]?.IUPACName || null;
  } catch (e) {
    return null;
  }
}

export async function getMolecularFormulaByCID(cid: number): Promise<string | null> {
  const formulaUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula/JSON`;
  try {
    const formulaResponse = await fetch(formulaUrl);
    if (!formulaResponse.ok) {
      throw new Error(`Failed to fetch MolecularFormula: ${formulaResponse.status}`);
    }
    const formulaData = await formulaResponse.json();
    return formulaData.PropertyTable?.Properties?.[0]?.MolecularFormula || null;
  } catch (e) {
    return null;
  }
}

export function findWikipediaLink(
  sections: PubChemSection[],
  recordTitle: string,
  synonyms: string[] = []
): string | null {
  for (const section of sections || []) {
    if (section.TOCHeading === "Wikipedia") {
      const information = section.Information || [];
      if (information.length > 0) {
        const normalize = (s?: string) => (s || "").trim().toLowerCase();
        const titlesToMatch = [recordTitle, ...synonyms]
          .filter(Boolean)
          .map((t) => normalize(t));

        let bestUrl: string | null = null;
        let bestScore = -1;

        information.forEach((info) => {
          const rawTitle = info.Value?.StringWithMarkup?.[0]?.String;
          const wikiTitle = normalize(rawTitle);
          const url = info.URL || null;
          if (!url) return;

          let score = 0;
          if (url.includes("en.wikipedia.org")) score += 20;
          const nameHint = normalize(info.Name);
          if (nameHint.includes("wikipedia") && nameHint.includes("en")) score += 10;

          if (wikiTitle && titlesToMatch.includes(wikiTitle)) {
            score += 100;
          } else if (wikiTitle) {
            for (const title of titlesToMatch) {
              if (title && (title.includes(wikiTitle) || wikiTitle.includes(title))) {
                score += 60;
                break;
              }
            }
          }

          if (score > bestScore) {
            bestScore = score;
            bestUrl = url;
          }
        });

        if (bestUrl) return bestUrl;
      }
    }
    if (section.Section) {
      const result = findWikipediaLink(section.Section, recordTitle, synonyms);
      if (result) return result;
    }
  }
  return null;
}

export async function getSMILESByCAS(casNumber: string): Promise<string | null> {
  const normalizedCAS = casNumber.trim();
  const cacheKey = `cas:${normalizedCAS}`;
  
  if (smilesCache.has(cacheKey)) {
    return smilesCache.get(cacheKey)!;
  }

  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(normalizedCAS)}/property/ConnectivitySMILES/JSON?name_type=word`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const smiles = data.PropertyTable?.Properties?.[0]?.ConnectivitySMILES || null;
    if (smiles) {
      smilesCache.set(cacheKey, smiles);
    }
    return smiles;
  } catch (e) {
    console.error('Error in getSMILESByCAS:', e);
    return null;
  }
}