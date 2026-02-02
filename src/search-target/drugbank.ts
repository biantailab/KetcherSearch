import type { PubChemSection } from "../types/pubchem";
import type { DrugBankIdResult } from "../types/drugbank";

export function findDrugBankId(
  sections: PubChemSection[]
): DrugBankIdResult | null {
  for (const section of sections || []) {
    if (section.TOCHeading === "DrugBank ID") {
      const info = section.Information?.[0];
      if (info) {
        if (info.URL) {
          const id = info.Value?.StringWithMarkup?.[0]?.String;
          if (id) {
            return {
              id,
              url: info.URL,
            };
          }
        }
        if (info.Value?.StringWithMarkup?.[0]?.String) {
          const id = info.Value.StringWithMarkup[0].String;
          return { id, url: buildDrugBankExactUrlById(id) };
        }
      }
    }
    if (section.Section) {
      const result = findDrugBankId(section.Section);
      if (result) return result;
    }
  }
  return null;
}

export function buildDrugBankExactUrlById(id: string): string {
  return `https://go.drugbank.com/drugs/${id}`;
}

export function buildDrugBankExactUrlByCAS(cas: string): string {
  return `https://go.drugbank.com/unearth/q?searcher=drugs&query=${encodeURIComponent(
    cas
  )}`;
}

export function buildDrugBankFuzzyUrlBySmiles(smiles: string): string {
  return `https://go.drugbank.com/structures/search/small_molecule_drugs/structure?utf8=%E2%9C%93&searcher=structure&structure_search_type=substructure&structure=${encodeURIComponent(
    smiles
  )}#results`;
}