export function Table({ children, className = '', minWidth = '560px' }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className={`w-full border-collapse text-[13px] ${className}`} style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className = '' }) {
  return (
    <th className={`text-left text-[11px] text-neutral-500 font-semibold py-2 px-2.5 border-b border-neutral-100 whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }) {
  return <td className={`py-2.5 px-2.5 border-b border-neutral-100 ${className}`}>{children}</td>;
}

export default Table;
