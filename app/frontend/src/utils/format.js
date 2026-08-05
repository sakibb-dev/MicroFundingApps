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

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const diffMs = Date.now() - d.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  return `${Math.floor(months / 12)} tahun lalu`;
}

export function formatPeriode(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
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
