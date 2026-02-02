import type { CASNumber } from "@/types/shop";

export function buildChemicalBookUrlByCAS(cas: CASNumber): string {
  return `https://www.chemicalbook.com/ProductList.aspx?kwd=${encodeURIComponent(
    cas.trim()
  )}`;
}

export function openChemicalBookByCAS(cas: CASNumber): string {
  const url = buildChemicalBookUrlByCAS(cas);
  window.open(url, '_blank');
  return url;
}

export function buildTansooleUrlByCAS(cas: CASNumber): string {
  const trimmed = cas.trim();
  const t = Math.random();
  return `https://www.tansoole.com/search/search.htm?gloabSearchVo.queryString=${encodeURIComponent(
    trimmed
  )}&gloabSearchVo.nav=undefined&t=${t}`;
}

export function openTansooleByCAS(cas: CASNumber): string {
  const url = buildTansooleUrlByCAS(cas);
  window.open(url, '_blank');
  return url;
}

export function buildTciUrlByCAS(cas: CASNumber): string {
  return `https://www.tcichemicals.com/US/en/search/?text=${encodeURIComponent(
    cas.trim()
  )}`;
}

export function openTciByCAS(cas: CASNumber): string {
  const url = buildTciUrlByCAS(cas);
  window.open(url, '_blank');
  return url;
}

export function buildMacklinUrlByCAS(cas: CASNumber): string {
  return `https://www.macklin.cn/search/${encodeURIComponent(cas.trim())}`;
}

export function openMacklinByCAS(cas: CASNumber): string {
  const url = buildMacklinUrlByCAS(cas);
  window.open(url, '_blank');
  return url;
}

export function buildLeyanUrlByCAS(cas: CASNumber): string {
  return `https://www.leyan.com/search-result?search=${encodeURIComponent(
    cas.trim()
  )}`;
}

export function openLeyanByCAS(cas: CASNumber): string {
  const url = buildLeyanUrlByCAS(cas);
  window.open(url, '_blank');
  return url;
}

export function buildSigmaUrlByCAS(cas: CASNumber): string {
  const trimmed = cas.trim();
  const encoded = encodeURIComponent(trimmed);
  return `https://www.sigmaaldrich.com/search/${encoded}?focus=products&page=1&perpage=30&sort=relevance&term=${encoded}&type=cas_number`;
}

export function openSigmaByCAS(cas: CASNumber): string {
  const url = buildSigmaUrlByCAS(cas);
  window.open(url, '_blank');
  return url;
}
