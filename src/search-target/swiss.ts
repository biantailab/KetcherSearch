export const submitToSwissTargetPrediction = (smiles: string): void => {
  if (!smiles) return;

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.swisstargetprediction.ch/index.php';
  form.target = '_blank';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'smiles';
  input.value = smiles;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};