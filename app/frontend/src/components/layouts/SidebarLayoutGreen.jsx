import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { IconMenu2, IconX } from '@tabler/icons-react';
import Avatar from '../ui/Avatar';

export default function SidebarLayoutGreen({ navItems, user }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebarBody = (
    <>
      <div className="flex items-center gap-2 px-2 pt-1 pb-6">
        <div className="w-7 h-7 bg-green-400 rounded-[7px] flex items-center justify-center font-extrabold text-[13px] text-green-950">
          M
        </div>
        <span className="text-[15px] font-bold text-white">MicroInvest</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded text-[13.5px] font-medium transition-colors ${
                isActive ? 'bg-green-400 text-green-950 font-bold' : 'text-white/55 hover:bg-white/[.06] hover:text-white/85'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className="shrink-0" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {item.badge != null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-px rounded-full ${
                      isActive ? 'bg-green-950 text-green-400' : 'bg-danger text-white'
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

      <div className="border-t border-white/10 pt-3.5 mt-2.5 flex items-center gap-2.5">
        <Avatar name={user?.name} tone="green" size={34} className="!bg-green-600" />
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-white truncate">{user?.name}</div>
          <div className="text-[11px] text-green-400">● {user?.status}</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-green-950 px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-400 rounded-[7px] flex items-center justify-center font-extrabold text-[13px] text-green-950">
            M
          </div>
          <span className="text-[15px] font-bold text-white">MicroInvest</span>
        </div>
        <button onClick={() => setDrawerOpen(true)} aria-label="Buka menu" className="text-white">
          <IconMenu2 size={22} />
        </button>
      </div>

      <div className="hidden lg:flex flex-col bg-green-950 px-3.5 py-5 sticky top-0 h-screen">{sidebarBody}</div>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 max-w-[85vw] bg-green-950 px-3.5 py-5 flex flex-col">
            <button onClick={() => setDrawerOpen(false)} aria-label="Tutup menu" className="self-end text-white/70 mb-2">
              <IconX size={20} />
            </button>
            {sidebarBody}
          </div>
        </div>
      )}

      <main className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10 max-w-[1200px] w-full">
        <Outlet />
      </main>
    </div>
  );
}
