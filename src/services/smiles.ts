import type { Ketcher } from 'ketcher-core';

export interface ConversionResult {
  success: boolean;
  error?: string;
  data?: string;
}

export async function applySmiles(ketcher: Ketcher | null, smiles: string): Promise<ConversionResult> {
  if (!ketcher) {
    return { success: false, error: 'Ketcher instance not available' };
  }
  
  const text = (smiles ?? '').trim();
  if (!text) {
    try {
      await ketcher.setMolecule('');
      return { success: true, data: '' };
    } catch (error) {
      return { success: false, error: `Failed to clear molecule: ${error}` };
    }
  }
  
  try {
    await ketcher.setMolecule(text, { format: 'smiles' } as any);
    return { success: true, data: text };
  } catch (error) {
    return { success: false, error: `Invalid SMILES: ${error}` };
  }
}

export async function clearMolecule(ketcher: Ketcher | null): Promise<void> {
  if (!ketcher) return;
  try {
    await ketcher.setMolecule('');
  } catch {}
}

export async function readSmiles(ketcher: Ketcher | null): Promise<ConversionResult> {
  if (!ketcher) {
    return { success: false, error: 'Ketcher instance not available' };
  }
  
  try {
    const fn: any = (ketcher as any).getSmiles;
    const smiles = (await fn?.call(ketcher)) || '';
    const result = typeof smiles === 'string' ? smiles : '';
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: `Failed to read SMILES: ${error}` };
  }
}

export type MolfileVersion = 'v2000' | 'v3000';

export async function readMolfile(
  ketcher: Ketcher | null,
  version: MolfileVersion = 'v2000'
): Promise<string> {
  if (!ketcher) return '';
  try {
    const fn: any = (ketcher as any).getMolfile;
    const mol = (await fn?.call(ketcher, version)) || '';
    return typeof mol === 'string' ? mol : '';
  } catch {
    return '';
  }
}

export async function applyMolfile(ketcher: Ketcher | null, molfile: string): Promise<ConversionResult> {
  if (!ketcher) {
    return { success: false, error: 'Ketcher instance not available' };
  }
  
  const text = (molfile ?? '').trim();
  if (!text) {
    return { success: false, error: 'Empty molfile' };
  }
  
  try {
    await ketcher.setMolecule(text, { format: 'mol' } as any);
    return { success: true, data: text };
  } catch (error) {
    return { success: false, error: `Invalid molfile: ${error}` };
  }
}

// 批量转换SMILES到结构式（需要Ketcher实例）
export async function batchConvertSmilesToStructures(
  ketcher: Ketcher | null, 
  smilesList: string[]
): Promise<ConversionResult[]> {
  if (!ketcher) {
    return smilesList.map(() => ({ success: false, error: 'Ketcher instance not available' }));
  }
  
  const results: ConversionResult[] = [];
  
  for (const smiles of smilesList) {
    const result = await applySmiles(ketcher, smiles);
    results.push(result);
    
    // 短暂延迟以避免过载
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}