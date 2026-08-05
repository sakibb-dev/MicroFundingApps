// Display-only constants for the Investor panel (icons, presets, static
// destination account) -- not API-standin data. Actual UMKM/portfolio/profile
// data comes from src/api/investor.js.
import { IconToolsKitchen2, IconShirt, IconTool, IconCut } from '@tabler/icons-react';

const CATEGORY_ICONS = {
  Kuliner: IconToolsKitchen2,
  Fashion: IconShirt,
  Otomotif: IconTool,
  Kerajinan: IconCut,
};

const CATEGORY_STYLES = {
  Kuliner: { bg: '#D1FAE5', color: '#065F46' },
  Fashion: { bg: '#EDE9FE', color: '#6D28D9' },
  Otomotif: { bg: '#FEF3C7', color: '#92400E' },
  Kerajinan: { bg: '#E0F2FE', color: '#075985' },
};

export const CATEGORIES = ['Kuliner', 'Fashion', 'Otomotif', 'Kerajinan'];

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || IconToolsKitchen2;
}

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || { bg: '#F3F4F6', color: '#374151' };
}

// Funding % drives the status badge/chip shown on cards — single source of
// truth so Home's filter chips and the card badges never disagree.
export function getFundingStatus(percent) {
  if (percent >= 90) return { key: 'hampir_penuh', label: `${percent}% — Segera Penuh`, variant: 'warning' };
  if (percent >= 70) return { key: 'hampir_penuh', label: 'Hampir Penuh', variant: 'warning' };
  return { key: 'aktif', label: 'Funding Aktif', variant: 'success' };
}

export const INVESTMENT_AMOUNT_PRESETS = [500000, 1000000, 2000000, 5000000];

export const REKENING_TUJUAN = {
  bank: 'Bank BCA',
  atasNama: 'PT MicroInvest Nusantara',
  nomor: '1234567890',
};
