export function formatCurrency(value) {
  const n = Number(value) || 0;
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function parseCurrencyInput(str) {
  return Number(String(str).replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;
}

export function formatNumberInput(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('id-ID');
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function maskName(fullName) {
  const parts = String(fullName).trim().split(/\s+/);
  return parts
    .map((word) => {
      if (word.length <= 1) return word + '*';
      return word[0] + '*'.repeat(Math.max(1, word.length - 2)) + word[word.length - 1];
    })
    .join(' ');
}
