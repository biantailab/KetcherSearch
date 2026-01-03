<img src="public/ketchersearch_logo.svg" alt="KetcherSearch logo" width="100" height="100" align="right" />

# KetcherSearch

<p align="center">
   English |  <a href="README_zh-CN.md">简体中文</a>
</p>

Pure front-end implementation of smiles⇄mol based on Ketcher Searching for compound information from molecular structures

Powered by [Ketcher](https://github.com/epam/ketcher) & [KetchKitSearch](https://github.com/biantailab/KetchKitSearch)

## Dependencies

- [pubchem](https://pubchem.ncbi.nlm.nih.gov)

## Search target

> [!tip]
> DrugBank exact and Wikipedia jump links from PubChem JSON

- [nmrdb](https://www.nmrdb.org)
- [pubchem](https://pubchem.ncbi.nlm.nih.gov)
- [wikipedia](https://en.wikipedia.org)
- [drugbank](https://go.drugbank.com)
- [swisstargetprediction](https://www.swisstargetprediction.ch)

## Demo

<img src="imgs/ketchersearch.gif" >

## Functionality

- Real-time conversion of smiles and mol
- Query the mol via CAS
- Example:
    - Benzyl titanium
    - Nonanal
    - Palytoxin
- Clear smiles
- Copy smiles
- Get:
    - CAS
    - IUPACName
    - Molecular Formula
- HNMR search
- PubChem search
- Wikipedia search
- DrugBank search
    - exact
    - fuzzy
- SwissTargetPrediction search

## More

- [StructuredSearch](https://github.com/biantailab/StructuredSearch) - Searching for compound information from molecular structures based on Marvin JS and web services