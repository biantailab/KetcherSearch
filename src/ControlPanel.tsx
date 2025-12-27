import React, { useState } from 'react';
import {
  getWikipediaUrlByCID,
  getMolecularFormulaByCID,
  getPubChemCID,
  getCASByCID,
  getIUPACNameByCID,
  getPubChemUrlByCID,
  getPubChemData,
  getSMILESByCAS,
} from '@/services/pubchem';
import {
  findDrugBankId,
  buildDrugBankExactUrlByCAS,
  buildDrugBankFuzzyUrlBySmiles
} from './services/drugbank';
import { validateSmiles } from './services/smiles';
import { submitToSwissTargetPrediction } from './services/swiss';

interface ControlPanelProps {
  smilesInput: string;
  selectedExample: string;
  onSmilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void | Promise<void>;
  onCopy: () => void | Promise<void>;
  onInputFocusChange?: (focused: boolean) => void;
  onExampleChange: (value: string) => void;
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ketcher-search__icon"
      aria-hidden="true"
    >
      <path
        d="M22.697 21.492l-5.68-5.68a6.503 6.503 0 001.358-4c0-1.754-.685-3.399-1.923-4.64a6.514 6.514 0 00-4.64-1.922 6.523 6.523 0 00-4.64 1.923 6.51 6.51 0 00-1.922 4.64c0 1.752.685 3.401 1.923 4.64a6.51 6.51 0 004.64 1.922 6.509 6.509 0 003.996-1.356l5.68 5.678a.18.18 0 00.255 0l.953-.951a.18.18 0 000-.254zm-7.42-6.215a4.874 4.874 0 01-3.464 1.435 4.874 4.874 0 01-3.466-1.434 4.874 4.874 0 01-1.435-3.466c0-1.308.51-2.54 1.435-3.465a4.874 4.874 0 013.466-1.435c1.308 0 2.54.508 3.464 1.435a4.874 4.874 0 011.435 3.466 4.87 4.87 0 01-1.434 3.464z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function ControlPanel({
  smilesInput,
  selectedExample,
  onSmilesChange,
  onClear,
  onCopy,
  onInputFocusChange,
  onExampleChange
}: ControlPanelProps) {
  const [loading, setLoading] = useState(false);
  const [isValidSmiles, setIsValidSmiles] = useState(true);
  const [casInput, setCasInput] = useState('');
  const [isValidCas, setIsValidCas] = useState(true);

  // Common alert messages
  const alerts = {
    compoundNotFound: 'Compound not found',
    casNotFound: 'CAS number not found',
    iupacNotFound: 'IUPAC Name not found',
    formulaNotFound: 'Molecular Formula not found',
    wikipediaNotFound: 'Wikipedia link not found',
    drugbankNotFound: 'DrugBank ID or CAS number not found',
    invalidSmiles: 'Invalid SMILES format',
    networkError: 'Failed to fetch, please check your network',
    pubchemError: 'Failed to fetch PubChem CID, please check your network',
    wikipediaError: 'Failed to fetch Wikipedia link',
    drugbankError: 'Failed to fetch DrugBank info',
    copyFailed: 'Copy failed'
  };

  const handleSmilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsValidSmiles(validateSmiles(value));
    onSmilesChange(e);
  };

  const handleCasInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCasInput(value);
    setIsValidCas(/^\d{1,7}-\d{2}-\d$/.test(value) || value === '');
  };

  const handleCasSubmit = async () => {
    if (!casInput) return;
    if (!isValidCas) {
      alert('Invalid CAS number format. Expected format: XXXXXXX-XX-X');
      return;
    }
    
    setLoading(true);
    try {
      const smiles = await getSMILESByCAS(casInput);
      if (smiles) {
        const event = {
          target: { value: smiles }
        } as React.ChangeEvent<HTMLInputElement>;
        handleSmilesChange(event);
        setIsValidSmiles(true);

        if (onInputFocusChange) {
          onInputFocusChange(true);
          window.setTimeout(() => onInputFocusChange(false), 800);
        }
      } else {
        alert('No structure found for this CAS number');
      }
    } catch (e) {
      alert('Failed to fetch structure for this CAS number');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onExampleChange(value);
  };

  const handleClearAll = async () => {
    setCasInput('');
    setIsValidCas(true);
    await onClear();
  };

  const handlePubChem = async () => {
    if (!smilesInput) {
      return;
    }
    if (!isValidSmiles) {
      alert(alerts.invalidSmiles);
      return;
    }
    setLoading(true);
    try {
      const cid = await getPubChemCID(smilesInput);
      if (!cid) {
        alert(alerts.compoundNotFound);
        return;
      }
      const url = await getPubChemUrlByCID(cid);
      window.open(url, '_blank');
    } catch (e) {
      alert(alerts.pubchemError);
    } finally {
      setLoading(false);
    }
  };

  const handleHNMR = () => {
    if (smilesInput) {
      const searchUrl = `https://www.nmrdb.org/new_predictor/index.shtml?v=latest&smiles=${encodeURIComponent(smilesInput)}`;
      window.open(searchUrl, '_blank');
    }
  };

  const handleSTP = () => {
    if (!smilesInput || !isValidSmiles) return;
    submitToSwissTargetPrediction(smilesInput);
  };

  // Get dropdown
  const handleGetSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!smilesInput || !value) return;
    setLoading(true);
    try {
      const cid = await getPubChemCID(smilesInput);
      if (!cid) {
        alert(alerts.compoundNotFound);
        return;
      }
      if (value === 'cas') {
        const cas = await getCASByCID(cid);
        if (cas) {
          try {
            await navigator.clipboard.writeText(cas);
            alert(`CAS ${cas} copied`);
          } catch {
            alert(alerts.copyFailed);
          }
        } else {
          alert(alerts.casNotFound);
        }
      } else if (value === 'iupac') {
        const name = await getIUPACNameByCID(cid);
        if (name) {
          try {
            await navigator.clipboard.writeText(name);
            alert(`IUPAC Name: ${name} copied`);
          } catch {
            alert(alerts.copyFailed);
          }
        } else {
          alert(alerts.iupacNotFound);
        }
      } else if (value === 'formula') {
        const formula = await getMolecularFormulaByCID(cid);
        if (formula) {
          try {
            await navigator.clipboard.writeText(formula);
            alert(`Molecular Formula: ${formula} copied`);
          } catch {
            alert(alerts.copyFailed);
          }
        } else {
          alert(alerts.formulaNotFound);
        }
      }
    } catch {
      alert(alerts.networkError);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleGetWikipedia = async () => {
    if (!smilesInput) return;
    setLoading(true);
    try {
      const cid = await getPubChemCID(smilesInput);
      if (!cid) {
        alert(alerts.compoundNotFound);
        return;
      }
      const wikipediaUrl = await getWikipediaUrlByCID(cid);
      if (wikipediaUrl) {
        window.open(wikipediaUrl, '_blank');
      } else {
        alert(alerts.wikipediaNotFound);
      }
    } catch {
      alert(alerts.wikipediaError);
    } finally {
      setLoading(false);
    }
  };

  const handleDrugBankSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (!smilesInput || !value) return;
    
    if (value === 'fuzzy') {
      window.open(buildDrugBankFuzzyUrlBySmiles(smilesInput), '_blank');
      event.target.value = '';
      return;
    }

    setLoading(true);
    try {
      const cid = await getPubChemCID(smilesInput);
      if (!cid) {
        alert(alerts.compoundNotFound);
        return;
      }
      if (value === 'exact') {
        const data = await getPubChemData(cid);
        const result = findDrugBankId(data.Record?.Section);
        if (result && result.url) {
          window.open(result.url, '_blank');
        } else {
          const casNumber = await getCASByCID(cid);
          if (casNumber) {
            window.open(buildDrugBankExactUrlByCAS(casNumber), '_blank');
          } else {
            alert(alerts.drugbankNotFound);
          }
        }
      }
    } catch {
      alert(alerts.drugbankError);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div style={{ marginTop: '4px', marginBottom: '4px' }} className='control-panel shadow-md p-1'>
      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className='text-neutral-600'>Loading...</div>
        </div>
      )}
      {/* Responsive input area */}
      <div className="input-stars-row">
        <div
          className="ketcher-search"
          style={{
            outlineColor: isValidSmiles || !smilesInput ? undefined : '#FF4A4A',
            flex: '2 1 700px',
          }}
        >
          <SearchIcon />
          <input
            id="smiles-input"
            type="search"
            value={smilesInput}
            onChange={handleSmilesChange}
            onFocus={() => onInputFocusChange && onInputFocusChange(true)}
            onBlur={() => onInputFocusChange && onInputFocusChange(false)}
            placeholder="SMILES"
            className="ketcher-search__input"
          />
        </div>
        {smilesInput && (
          <span 
            style={{ 
              marginLeft: '4px', 
              color: isValidSmiles ? '#28a745' : '#dc3545',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            title={isValidSmiles ? 'Valid SMILES' : 'Invalid SMILES format'}
          >
            {isValidSmiles ? '✓' : '✗'}
          </span>
        )}
        <div
          className="ketcher-search"
          style={{
            outlineColor: isValidCas || !casInput ? undefined : '#FF4A4A',
            flex: '1 1 220px',
          }}
        >
          <SearchIcon />
          <input
            id="cas-input"
            type="search"
            value={casInput}
            onChange={handleCasInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleCasSubmit()}
            placeholder="CAS"
            className="ketcher-search__input"
            style={{ flex: 1 }}
          />
        </div>
        <div className="button-group" style={{ display: 'contents' }}>
          <button onClick={handleCasSubmit} disabled={loading || !casInput || !isValidCas}>Search</button>
        </div>
        <a
          href="https://github.com/biantailab/KetcherSearch"
          target="_blank"
          rel="noopener noreferrer"
          style={{ verticalAlign: 'middle', marginLeft: '2px', flex: '0 0 auto', whiteSpace: 'nowrap' }}
        >
          <img
            src="https://img.shields.io/github/stars/biantailab/KetcherSearch.svg?style=social"
            alt="GitHub stars"
            style={{ height: '22px', verticalAlign: 'middle', position: 'relative', marginTop: '-1px' }}
          />
        </a>
      </div>
      {/* Responsive button area */}
      <div className="button-group" style={{ marginTop: '1px', marginBottom: '0px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
        <select value={selectedExample} onChange={handleExampleChange}>
          <option value="">Example:</option>
          <option value="C(C1=CC=CC=C1)[Ti](CC1=CC=CC=C1)(CC1=CC=CC=C1)CC1=CC=CC=C1">Benzyl titanium</option>
          <option value="CCCCCCCCC=O">Nonanal</option>
          <option value="C[C@H]1C[C@@]2([C@H](O[C@](C1)(O2)CCCCCCC[C@@H](C[C@@H]3[C@@H]([C@H]([C@H]([C@@](O3)(C[C@@H]([C@@H](C)/C=C/[C@H](CC[C@H]([C@H]([C@@H]4C[C@H]([C@@H]([C@H](O4)C[C@H]([C@@H](C[C@@H]5[C@H]([C@@H]([C@H]([C@@H](O5)C[C@@H](/C=C\C=C\C[C@H]([C@@H]([C@@H](C/C=C\C(=C)CC[C@@H]([C@H]([C@@H]([C@H](C)C[C@@H]6[C@@H]([C@H]([C@@H]([C@H](O6)/C=C\[C@H]([C@@H](C[C@@H]7C[C@@H]8C[C@H](O7)[C@H](O8)CC[C@@H]9[C@@H](C[C@H](O9)CN)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)O)C[C@@H](C)CCCCC[C@H]([C@@H]([C@@H]([C@H]([C@@H]([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)C[C@@H]([C@@H](/C(=C/[C@@H](C[C@@H](C)[C@@H](C(=O)N/C=C/C(=O)NCCCO)O)O)/C)O)O)O)O)O)O)O)O)O)O)C">Palytoxin</option>
        </select>
        <button onClick={handleClearAll} disabled={loading || (!smilesInput && !casInput)}>Clear</button>
        <button onClick={onCopy} disabled={loading || !smilesInput || !isValidSmiles}>Copy</button>
        <select onChange={handleGetSelect} disabled={loading || !smilesInput || !isValidSmiles}>
          <option value="">Get:</option>
          <option value="cas">CAS</option>
          <option value="iupac" title="IUPACName">Name</option>
          <option value="formula" title="Molecular Formula">Formula</option>
        </select>
        <button onClick={handleHNMR} disabled={loading || !smilesInput || !isValidSmiles}>HNMR</button>
        <button onClick={handlePubChem} disabled={loading || !smilesInput || !isValidSmiles}>PubChem</button>
        <button onClick={handleGetWikipedia} disabled={loading || !smilesInput || !isValidSmiles}>Wikipedia</button>
        <select onChange={handleDrugBankSelect} disabled={loading || !smilesInput || !isValidSmiles}>
          <option value="">DrugBank:</option>
          <option value="exact">exact</option>
          <option value="fuzzy">fuzzy</option>
        </select>
        <button onClick={handleSTP} disabled={loading || !smilesInput || !isValidSmiles} title="SwissTargetPrediction">STP</button>
      </div>
      {/* Responsive styles */}
      <style>{`
        .input-stars-row {
          display: flex;
          align-items: center;
          width: 100%;
          height: auto;
          max-width: 678px;
          gap: 4px;
          margin: 0px auto;
          flex-wrap: nowrap;
        }
        .ketcher-search {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
        }
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1px;
          justify-content: center;
        }
        .button-group button, .button-group select {
          min-width: 60px;
          height: 24px;
        }
        .button-group button:disabled, .button-group select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media screen and (max-width: 602px) {
          .input-stars-row {
            max-width: 100vw;
            flex-wrap: wrap;
          }
          .button-group {
            gap: 1px;
          }
          .button-group button, .button-group select {
            flex: 1 0 auto;
            min-width: 70px;
            max-width: 100%;
            height: 20px;
          }
          .button-group button:disabled, .button-group select:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      `}</style>
    </div>
  );
}

export default ControlPanel;
