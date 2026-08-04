import { useRef, useState } from 'react';
import { IconPaperclip, IconCircleCheck } from '@tabler/icons-react';
import FieldWrap from './FieldWrap';

const ACCEPTED_TYPES = { 'image/jpeg': 1, 'image/png': 1, 'application/pdf': 1 };
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function FileUpload({
  label,
  required,
  hint = 'JPG, PNG, atau PDF — maks 5MB',
  icon: Icon = IconPaperclip,
  multiple = false,
  onChange,
  error,
  id,
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [localError, setLocalError] = useState('');

  function validateAndSet(fileList) {
    const arr = Array.from(fileList || []);
    if (arr.length === 0) return;
    for (const f of arr) {
      if (!ACCEPTED_TYPES[f.type]) {
        setLocalError('Format file harus JPG, PNG, atau PDF.');
        return;
      }
      if (f.size > MAX_SIZE_BYTES) {
        setLocalError('Ukuran file maksimal 5MB. Kompres dulu atau pilih file lain.');
        return;
      }
    }
    setLocalError('');
    setFiles(arr);
    onChange?.(multiple ? arr : arr[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    validateAndSet(e.dataTransfer.files);
  }

  const showError = error || localError;

  return (
    <FieldWrap label={label} required={required} error={showError} id={id}>
      <div
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        className={`border-[1.5px] border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
          files.length ? 'border-green-400 bg-green-50' : 'border-neutral-300 hover:border-green-400 hover:bg-green-50'
        }`}
      >
        <Icon size={26} className={`mx-auto mb-2 ${files.length ? 'text-green-600' : 'text-neutral-500'}`} aria-hidden="true" />
        <div className="text-[12.5px] font-semibold text-neutral-700">
          {files.length ? 'Klik untuk ganti file' : 'Klik atau drag file ke sini'}
        </div>
        <div className="text-[11px] text-neutral-500 mt-1">{hint}</div>
        {files.map((f, i) => (
          <div key={i} className="flex items-center justify-center gap-1 text-xs font-semibold text-green-700 mt-1.5">
            <IconCircleCheck size={14} /> {f.name}
          </div>
        ))}
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files)}
        />
      </div>
    </FieldWrap>
  );
}
