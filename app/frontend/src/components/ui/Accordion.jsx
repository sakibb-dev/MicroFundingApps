import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

export default function Accordion({ items, tone = 'green', className = '' }) {
  const [openIndex, setOpenIndex] = useState(null);
  const activeColor = tone === 'teal' ? 'text-teal-800' : 'text-green-800';
  const activeChevron = tone === 'teal' ? 'text-teal-700' : 'text-green-600';

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `accordion-panel-${i}`;
        return (
          <div key={i} className="border-b border-neutral-100">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className={`text-[15px] font-semibold ${isOpen ? activeColor : 'text-neutral-900'}`}>{item.question}</span>
              <IconChevronDown
                size={20}
                className={`shrink-0 transition-transform ${isOpen ? `rotate-180 ${activeChevron}` : 'text-neutral-400'}`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div id={panelId} className="text-sm text-neutral-600 leading-relaxed pb-5">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
