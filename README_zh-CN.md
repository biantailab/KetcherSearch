<img src="public/ketchersearch_logo.svg" alt="KetcherSearch logo" width="100" height="100" align="right" />

# KetcherSearch

<p align="center">
    <a href="README.md">English</a> | 简体中文
</p>

基于Ketcher的纯前端实现smiles⇄mol的从分子结构中搜索化合物信息

Powered by [Ketcher](https://github.com/epam/ketcher) & [KetchKitSearch](https://github.com/biantailab/KetchKitSearch)

## 依赖

- [pubchem](https://pubchem.ncbi.nlm.nih.gov) - 数据源

## 搜索目标

> [!tip]
> DrugBank exact和Wikipedia跳转链接来自PubChem JSON

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

## 预览

<img src="imgs/ketchersearch.gif" >

## 功能

- 实时转换smiles和分子结构
- 通过CAS查询分子结构
- Example:
    - Benzyl titanium (苄钛)
    - Nonanal (壬醛)
    - Palytoxin (岩沙海葵毒素)
- Clear smiles
- Copy smiles
- Get:
    - CAS
    - IUPACName
    - Molecular Formula (分子式)
- HNMR搜索
- PubChem搜索
- Wikipedia搜索
- DrugBank搜索
    - exact (详细)
    - fuzzy (模糊)
- SwissTargetPrediction搜索
- Shop
    - 1 (ChemicalBook)
    - 2 (Tansoole)
    - 3 (Sigma-Aldrich)
    - 4 (TCI)
    - 5 (Macklin)
    - 6 (Leyan)

## 更多

- [StructuredSearch](https://github.com/biantailab/StructuredSearch) - 基于Marvin JS和webservices的从分子结构检索化合物信息