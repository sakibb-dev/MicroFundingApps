import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

// Bahasa Indonesia copy per context-backend-and-system/PROMPT_FEEDBACK_SYSTEM.md section 2.
const MESSAGES = {
  network: 'Kamu sedang offline. Periksa koneksi internet dan coba lagi.',
  unauthorized: 'Sesi kamu berakhir. Masuk lagi untuk melanjutkan.',
  forbidden: 'Kamu tidak punya akses untuk melakukan ini.',
  not_found: 'Data yang kamu cari tidak ditemukan.',
  rate_limited: 'Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.',
  server_error: 'Ada gangguan di server kami. Coba lagi dalam beberapa saat.',
};

// Mounted once near the app root: bridges axios interceptor events (outside
// the React tree) to toast + redirect behavior (inside it).
export default function ApiErrorBridge() {
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    function handleApiError(e) {
      const { type, message } = e.detail;
      if (type === 'business_error' && message) {
        toast.error(message);
        return;
      }
      if (type === 'unauthorized') {
        toast.error(MESSAGES.unauthorized);
        navigate('/masuk');
        return;
      }
      if (MESSAGES[type]) toast.error(MESSAGES[type]);
    }
    window.addEventListener('api-error', handleApiError);
    return () => window.removeEventListener('api-error', handleApiError);
  }, [toast, navigate]);

  return null;
}
