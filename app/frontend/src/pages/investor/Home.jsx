import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconSearch, IconMapPin } from '@tabler/icons-react';
import { Card, Badge, ProgressBar, Select, Chip, EmptyState } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { getUmkmList, getCategoryIcon, getCategoryStyle, getFundingStatus, CATEGORIES } from '../../mocks/investor';

const STATUS_CHIPS = [
  { key: 'semua', label: 'Semua' },
  { key: 'aktif', label: 'Funding Aktif' },
  { key: 'hampir_penuh', label: 'Hampir Penuh' },
  { key: 'terbaru', label: 'Terbaru' },
];

export default function Home() {
  const list = useMemo(() => getUmkmList(), []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('semua');
  const [statusFilter, setStatusFilter] = useState('semua');

  function resetFilters() {
    setSearch('');
    setCategory('semua');
    setStatusFilter('semua');
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((item) => {
      const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const matchesCategory = category === 'semua' || item.category === category;
      const fundingKey = getFundingStatus(item.percent).key;
      let matchesChip = true;
      if (statusFilter === 'aktif') matchesChip = fundingKey === 'aktif';
      else if (statusFilter === 'hampir_penuh') matchesChip = fundingKey === 'hampir_penuh';
      else if (statusFilter === 'terbaru') matchesChip = item.isNew;
      return matchesSearch && matchesCategory && matchesChip;
    });
  }, [list, search, category, statusFilter]);

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Temukan UMKM</div>
        <div className="text-[13.5px] text-neutral-500 mt-0.5">{list.length}+ UMKM terverifikasi siap didanai</div>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama usaha atau kategori..."
            aria-label="Cari nama usaha atau kategori"
            className="w-full pl-9 pr-3.5 py-2.5 border border-neutral-300 rounded text-[13.5px] font-sans outline-none focus:border-green-400 transition-colors"
          />
        </div>
        <Select
          id="filter-kategori"
          aria-label="Filter kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          wrapClassName="mb-0 w-full sm:w-56"
        >
          <option value="semua">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_CHIPS.map((chip) => (
          <Chip key={chip.key} tone="green" active={statusFilter === chip.key} onClick={() => setStatusFilter(chip.key)}>
            {chip.label}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={IconSearch}
            title="Tidak ada UMKM yang cocok"
            body="Coba ubah kata kunci atau filter kategori."
            ctaLabel="Reset filter"
            onCta={resetFilters}
            tone="green"
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[18px]">
          {filtered.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const style = getCategoryStyle(item.category);
            const funding = getFundingStatus(item.percent);
            return (
              <Card
                key={item.id}
                as={Link}
                to={`/investor/detail/${item.id}`}
                padded={false}
                className="overflow-hidden block cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <div className="h-[130px] flex items-center justify-center relative" style={{ background: style.bg }}>
                  <Icon size={30} style={{ color: style.color }} aria-hidden="true" />
                  <Badge variant={funding.variant} tone="green" className="absolute top-2.5 right-2.5">
                    {funding.label}
                  </Badge>
                </div>
                <div className="px-4 pt-3.5 pb-4">
                  <div className="text-[10.5px] font-bold text-neutral-500 uppercase tracking-wide">{item.category}</div>
                  <div className="text-[14.5px] font-bold mt-0.5 mb-1 text-neutral-900">{item.name}</div>
                  <div className="text-xs text-neutral-500 mb-2.5 flex items-center gap-1">
                    <IconMapPin size={12} aria-hidden="true" /> {item.city}
                  </div>
                  <div className="text-lg font-extrabold text-green-600">
                    {item.returnPct}% <span className="text-[11.5px] font-medium text-neutral-500">/ bln</span>
                  </div>
                  <ProgressBar
                    percent={item.percent}
                    tone="green"
                    className="my-2"
                    labels={[`${item.percent}% terdanai`, `${formatCurrency(item.collected)} / ${formatCurrency(item.target)}`]}
                  />
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-neutral-100">
                    <span className="text-[11px] text-neutral-500">
                      {item.daysLeft} hari &middot; {item.investorCount} investor
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
