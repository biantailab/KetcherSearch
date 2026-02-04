<img src="public/logo.svg" alt="KetcherSearch logo" width="100" height="100" align="right" />

# KetcherSearch

<p align="center">
   English |  <a href="README_zh-CN.md">简体中文</a>
</p>

Pure front-end implementation of SMILES⇄mol based on Ketcher Searching for compound information from molecular structures

Powered by [Ketcher](https://github.com/epam/ketcher) & [KetchKitSearch](https://github.com/biantailab/KetchKitSearch)

## Dependencies

- Data source
    - [pubchem](https://pubchem.ncbi.nlm.nih.gov)

## Search target

> [!tip]
> DrugBank exact and Wikipedia jump links from PubChem JSON

- [nmrdb](https://www.nmrdb.org)
- [pubchem](https://pubchem.ncbi.nlm.nih.gov)
    - [wikipedia](https://en.wikipedia.org)
    - [drugbank](https://go.drugbank.com)
- [swisstargetprediction](https://www.swisstargetprediction.ch)
- Shop
    - [chemicalbook](https://www.chemicalbook.com)
    - [tansoole](https://www.tansoole.com)
    - [sigma-aldrich](https://www.sigmaaldrich.com)
    - [tci](https://www.tcichemicals.com)
    - [macklin](https://www.macklin.cn)
    - [leyan](https://www.leyan.com)

## Demo

<img src="imgs/demo.gif" >

## Functionality

- Real-time conversion of SMILES and mol
- Query the mol via CAS
- `Example:`
    - `Benzyl titanium`
    - `Nonanal`
    - `Palytoxin`
- `Clear`
- `Copy`
- `Get:`
    - `CAS`
    - `Name` IUPACName
    - `Formula` Molecular Formula
- `HNMR`
- `PubChem`
- `Wikipedia`
- `DrugBank`
    - `exact`
    - `fuzzy` Fuzzy, structural and similar search
- `STP` SwissTargetPrediction
- `Shop`
    - `1` ChemicalBook
    - `2` Tansoole
    - `3` Sigma-Aldrich
    - `4` TCI
    - `5` Macklin
    - `6` Leyan

## More

- [StructuredSearch](https://github.com/biantailab/StructuredSearch) - Searching for compound information from molecular structures based on Marvin JS and web services