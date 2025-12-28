import type { Ketcher } from 'ketcher-core';

export interface ConversionResult {
  success: boolean;
  error?: string;
  data?: string;
}

export type MolfileVersion = 'v2000' | 'v3000';

export declare function applySmiles(ketcher: Ketcher | null, smiles: string): Promise<ConversionResult>;

export declare function clearMolecule(ketcher: Ketcher | null): Promise<void>;

export declare function readSmiles(ketcher: Ketcher | null): Promise<ConversionResult>;

export declare function readMolfile(
  ketcher: Ketcher | null,
  version?: MolfileVersion
): Promise<string>;

export declare function applyMolfile(ketcher: Ketcher | null, molfile: string): Promise<ConversionResult>;

export declare function batchConvertSmilesToStructures(
  ketcher: Ketcher | null, 
  smilesList: string[]
): Promise<ConversionResult[]>;