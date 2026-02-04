<img src="public/logo.svg" alt="KetcherSearch logo" width="100" height="100" align="right" />

# KetcherSearch

<p align="center">
    <a href="README.md">English</a> | 简体中文
</p>

基于Ketcher的纯前端实现SMILES⇄mol的从分子结构中搜索化合物信息

Powered by [Ketcher](https://github.com/epam/ketcher) & [KetchKitSearch](https://github.com/biantailab/KetchKitSearch)

## 依赖

- 数据源
    - [pubchem](https://pubchem.ncbi.nlm.nih.gov)

## 搜索目标

> [!tip]
> DrugBank exact和Wikipedia跳转链接来自PubChem JSON

- [nmrdb](https://www.nmrdb.org)
- [pubchem](https://pubchem.ncbi.nlm.nih.gov)
    - [wikipedia](https://en.wikipedia.org)
    - [drugbank](https://go.drugbank.com)
- [swisstargetprediction](https://www.swisstargetprediction.ch)
- 购物
    - [chemicalbook](https://www.chemicalbook.com)
    - [tansoole](https://www.tansoole.com)
    - [sigma-aldrich](https://www.sigmaaldrich.com)
    - [tci](https://www.tcichemicals.com)
    - [macklin](https://www.macklin.cn)
    - [leyan](https://www.leyan.com)

## 预览

<img src="imgs/demo.gif" >

## 功能

- 实时转换SMILES和分子结构
- 通过CAS查询分子结构
- `Example:`
    - `Benzyl titanium` 苄钛
    - `Nonanal` 壬醛
    - `Palytoxin` 岩沙海葵毒素
- `Clear`
- `Copy`
- `Get:`
    - `CAS`
    - `Name` IUPAC名称
    - `Formula` 分子式
- `HNMR`
- `PubChem`
- `Wikipedia`
- `DrugBank`
    - `exact` 精确搜索
    - `fuzzy` 模糊、结构、相似搜索
- `STP` 瑞士目标预测
- `Shop`
    - `1` ChemicalBook
    - `2` 泰坦
    - `3` Sigma-Aldrich
    - `4` TCI
    - `5` 麦克林
    - `6` 乐研

## 更多

- [StructuredSearch](https://github.com/biantailab/StructuredSearch) - 基于Marvin JS和webservices的从分子结构检索化合物信息