import { useState } from 'react';
import { Card, Input, Select, TextArea, Button, Avatar } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { formatNumberInput, parseCurrencyInput } from '../../utils/format';
import { getBusinessProfile, KATEGORI_OPTIONS } from '../../mocks/umkm';

export default function ProfilUsaha() {
  const toast = useToast();
  const profile = getBusinessProfile();

  const [namaUsaha, setNamaUsaha] = useState(profile.namaUsaha);
  const [kategori, setKategori] = useState(profile.kategori);
  const [kota, setKota] = useState(profile.kota);
  const [tahunBerdiri, setTahunBerdiri] = useState(String(profile.tahunBerdiri));
  const [targetDana, setTargetDana] = useState(profile.targetDana);
  const [persenBagiHasil, setPersenBagiHasil] = useState(String(profile.persenBagiHasil));
  const [deskripsi, setDeskripsi] = useState(profile.deskripsi);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    // Placeholder for a real API call — simulate a short round trip.
    setTimeout(() => {
      setSaving(false);
      toast.success('Perubahan tersimpan.');
    }, 400);
  }

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Profil Usaha</div>
        <div className="text-[13px] text-neutral-500 mt-1">Kelola informasi dan dokumen usahamu</div>
      </div>

      <Card className="max-w-[720px]">
        <div className="flex items-center gap-3.5 mb-5">
          <Avatar name={namaUsaha} tone="teal" size={54} />
          <div>
            <div className="text-[15px] font-bold text-neutral-900">{namaUsaha}</div>
            <div className="text-xs font-semibold text-teal-700">
              &#9679; {profile.statusLabel} &middot; {kategori}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            id="nama-usaha"
            label="Nama usaha"
            value={namaUsaha}
            onChange={(e) => setNamaUsaha(e.target.value)}
          />
          <Select id="kategori" label="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}>
            {KATEGORI_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
          <Input id="kota" label="Kota" value={kota} onChange={(e) => setKota(e.target.value)} />
          <Input
            id="tahun-berdiri"
            label="Tahun berdiri"
            inputMode="numeric"
            value={tahunBerdiri}
            onChange={(e) => setTahunBerdiri(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
          />
          <Input
            id="target-dana"
            label="Target dana (Rp)"
            inputMode="numeric"
            value={formatNumberInput(targetDana)}
            onChange={(e) => setTargetDana(parseCurrencyInput(e.target.value))}
          />
          <Input
            id="persen-bagi-hasil"
            label="% Bagi hasil"
            inputMode="numeric"
            hint="Persentase keuntungan bersih yang dibagikan ke investor tiap periode"
            value={persenBagiHasil}
            onChange={(e) => setPersenBagiHasil(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
          />
        </div>

        <TextArea
          id="deskripsi"
          label="Deskripsi usaha"
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />

        <Button tone="teal" onClick={handleSave} loading={saving}>
          {saving ? 'Menyimpan...' : 'Simpan perubahan'}
        </Button>
      </Card>
    </div>
  );
}
