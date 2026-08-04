import { IconCheck } from '@tabler/icons-react';

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center mb-7">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < currentStep ? 'done' : n === currentStep ? 'active' : 'pending';
        return (
          <div key={label} className="flex flex-col items-center gap-1.5 flex-1 relative">
            {i < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${state === 'done' ? 'bg-green-400' : 'bg-neutral-100'}`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold z-10 transition-colors ${
                state === 'active'
                  ? 'bg-green-800 text-white'
                  : state === 'done'
                  ? 'bg-green-400 text-green-950'
                  : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {state === 'done' ? <IconCheck size={15} /> : n}
            </div>
            <div className={`text-[11px] font-semibold text-center hidden sm:block ${state === 'active' ? 'text-green-800' : 'text-neutral-500'}`}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
