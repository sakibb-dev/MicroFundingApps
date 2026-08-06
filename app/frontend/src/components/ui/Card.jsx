export default function Card({ children, className = '', padded = true, as: Comp = 'div', ...props }) {
  return (
    <Comp
      className={`bg-white border border-neutral-200 rounded-lg shadow-sm ${padded ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
