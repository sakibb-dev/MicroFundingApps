import { Link } from 'react-router-dom';
import { IconCircleCheck, IconMail } from '@tabler/icons-react';

export default function SuccessScreen({ title, description, infoText }) {
  return (
    <div className="text-center py-5">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <IconCircleCheck size={32} className="text-green-600" />
      </div>
      <div className="text-[19px] font-extrabold text-neutral-900 mb-2">{title}</div>
      <p className="text-[13.5px] text-neutral-500 max-w-[380px] mx-auto mb-6 leading-relaxed">{description}</p>
      <div className="bg-green-50 rounded-lg px-[18px] py-3.5 text-[12.5px] text-green-800 flex items-center gap-2 justify-center mb-6">
        <IconMail size={16} /> {infoText}
      </div>
      <Link to="/" className="inline-block px-[26px] py-3 rounded-full text-sm font-bold bg-green-800 text-white hover:bg-green-600 transition-colors">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
