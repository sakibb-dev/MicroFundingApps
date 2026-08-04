import { useMemo } from 'react';
import { IconCash, IconCheck, IconClock, IconBell } from '@tabler/icons-react';
import { Card, EmptyState } from '../../components/ui';
import { getNotifications } from '../../mocks/investor';

const TYPE_STYLES = {
  bagi_hasil: { icon: IconCash, bg: 'bg-green-100', color: 'text-green-700' },
  kyc: { icon: IconCheck, bg: 'bg-blue-100', color: 'text-blue-700' },
  pending: { icon: IconClock, bg: 'bg-amber-100', color: 'text-amber-700' },
};

export default function Notifikasi() {
  const notifications = useMemo(() => getNotifications(), []);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Notifikasi</div>
        <div className="text-[13.5px] text-neutral-500 mt-0.5">
          {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua notifikasi sudah dibaca'}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState
            icon={IconBell}
            title="Belum ada notifikasi"
            body="Notifikasi tentang investasi dan bagi hasil akan muncul di sini."
          />
        </Card>
      ) : (
        <Card padded={false}>
          <div className="px-5">
            {notifications.map((n) => {
              const t = TYPE_STYLES[n.type] || TYPE_STYLES.pending;
              const Icon = t.icon;
              return (
                <div key={n.id} className="flex gap-3 py-3.5 border-b border-neutral-100 last:border-b-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.bg}`}>
                    <Icon size={16} className={t.color} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-neutral-900">{n.title}</div>
                    <div className="text-[12.5px] text-neutral-500 mt-0.5">{n.desc}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[11px] text-neutral-500 whitespace-nowrap">{n.time}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-green-400" aria-label="Belum dibaca" />}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
