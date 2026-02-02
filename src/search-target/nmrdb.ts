export const handleHNMR = (smilesInput: string) => {
  if (smilesInput) {
    const searchUrl = `https://www.nmrdb.org/new_predictor/index.shtml?v=latest&smiles=${encodeURIComponent(smilesInput)}`;
    window.open(searchUrl, '_blank');
  }
};