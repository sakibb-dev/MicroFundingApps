import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { IconMenu2, IconX } from '@tabler/icons-react';
import Avatar from '../ui/Avatar';

export default function SidebarLayoutTeal({ navItems, user, badgeLabel }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebarBody = (
    <>
      <div className="flex items-center gap-2 px-2 pt-1 pb-5">
        <div className="w-[26px] h-[26px] bg-teal-800 rounded-[7px] flex items-center justify-center font-extrabold text-xs text-white">
          M
        </div>
        <span className="text-[14.5px] font-bold text-neutral-900">MicroInvest</span>
        {badgeLabel && (
          <span className="ml-auto text-[9.5px] font-bold text-teal-700 bg-teal-50 px-[7px] py-0.5 rounded-full">
            {badgeLabel}
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded text-[13px] font-medium transition-colors ${
                isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-neutral-500 hover:bg-neutral-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} className="shrink-0" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.badge != null && (
                  <span
                    className={`text-[9.5px] font-bold px-[6px] py-px rounded-full ${
                      isActive ? 'bg-teal-800 text-white' : 'bg-danger text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neutral-100 pt-3.5 mt-2.5 flex items-center gap-2.5">
        <Avatar name={user?.name} tone="teal" size={32} />
        <div className="min-w-0">
          <div className="text-[12.5px] font-semibold text-neutral-900 truncate">{user?.name}</div>
          <div className="text-[10.5px] text-teal-700">{user?.status}</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[230px_1fr]">
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b border-neutral-100 px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] bg-teal-800 rounded-[7px] flex items-center justify-center font-extrabold text-xs text-white">
            M
          </div>
          <span className="text-[14.5px] font-bold text-neutral-900">MicroInvest</span>
        </div>
        <button onClick={() => setDrawerOpen(true)} aria-label="Buka menu" className="text-neutral-700">
          <IconMenu2 size={22} />
        </button>
      </div>

      <div className="hidden lg:flex flex-col bg-white border-r border-neutral-100 px-3 py-[18px] sticky top-0 h-screen">
        {sidebarBody}
      </div>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 max-w-[85vw] bg-white px-3 py-[18px] flex flex-col">
            <button onClick={() => setDrawerOpen(false)} aria-label="Tutup menu" className="self-end text-neutral-400 mb-2">
              <IconX size={20} />
            </button>
            {sidebarBody}
          </div>
        </div>
      )}

      <main className="px-4 py-6 sm:px-8 sm:py-7 lg:px-9 max-w-[1220px] w-full">
        <Outlet />
      </main>
    </div>
  );
}
