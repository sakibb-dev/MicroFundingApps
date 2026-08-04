export default function Card({ children, className = '', padded = true, as: Comp = 'div', ...props }) {
  return (
    <Comp
      className={`bg-white border border-neutral-100 rounded-lg ${padded ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
