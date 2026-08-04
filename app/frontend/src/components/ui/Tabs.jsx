import { useState } from 'react';

export default function Tabs({ tabs, tone = 'green', defaultTab, className = '' }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key);
  const activeColor = tone === 'teal' ? 'text-teal-800 border-teal-800' : 'text-green-800 border-green-800';
  const current = tabs.find((t) => t.key === active);

  return (
    <div className={className}>
      <div className="flex gap-0 border-b border-neutral-100 mb-4 overflow-x-auto" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={`py-2.5 mr-5 text-[13.5px] font-semibold border-b-2 whitespace-nowrap transition-colors ${
              active === t.key ? activeColor : 'text-neutral-500 border-transparent hover:text-neutral-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current?.content}</div>
    </div>
  );
}
