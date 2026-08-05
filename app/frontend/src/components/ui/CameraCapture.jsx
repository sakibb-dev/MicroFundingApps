import { useEffect, useRef, useState } from 'react';
import { IconCamera, IconRefresh, IconCircleCheck, IconAlertTriangle, IconUpload } from '@tabler/icons-react';
import FieldWrap from './FieldWrap';

// Live camera capture for KTP/selfie fields, with a manual file-upload
// fallback that's always available (not just after a camera failure) --
// desktops without a webcam, or a user who'd simply rather upload, both
// need a way forward without fighting a permission prompt first.
export default function CameraCapture({
  label,
  required,
  hint = 'Pastikan foto jelas dan tidak buram',
  facingMode = 'environment',
  onChange,
  error,
  id,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('idle'); // idle | live | captured
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraError, setCameraError] = useState('');

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  // Stop the webcam/camera the moment this field is unmounted (step change,
  // route change) -- an open stream left running is both a memory leak and
  // a "why is my camera light on" surprise for the user.
  useEffect(() => stopStream, []);

  async function openCamera() {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Browser ini tidak mendukung akses kamera. Upload file secara manual di bawah.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      streamRef.current = stream;
      setMode('live');
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch (err) {
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Akses kamera ditolak. Izinkan akses kamera di pengaturan browser, atau upload file secara manual di bawah.'
          : 'Kamera tidak tersedia di perangkat ini. Upload file secara manual di bawah.'
      );
    }
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopStream();
        setPreviewUrl(URL.createObjectURL(blob));
        setMode('captured');
        onChange?.(new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.9
    );
  }

  function retake() {
    setPreviewUrl(null);
    onChange?.(null);
    openCamera();
  }

  function cancelLive() {
    stopStream();
    setMode('idle');
  }

  function handleManualFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopStream();
    setCameraError('');
    setPreviewUrl(URL.createObjectURL(file));
    setMode('captured');
    onChange?.(file);
  }

  return (
    <FieldWrap label={label} required={required} error={error} hint={mode === 'idle' ? hint : undefined} id={id}>
      {mode === 'captured' && previewUrl ? (
        <div className="border-[1.5px] border-green-400 bg-green-50 rounded p-3">
          <img src={previewUrl} alt="Hasil foto" className="w-full max-h-64 object-contain rounded mb-2.5" />
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-green-700 mb-2.5">
            <IconCircleCheck size={14} aria-hidden="true" /> Foto siap dikirim
          </div>
          <button
            type="button"
            onClick={retake}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-full font-semibold text-[12.5px] px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <IconRefresh size={14} aria-hidden="true" /> Ambil Ulang
          </button>
        </div>
      ) : mode === 'live' ? (
        <div className="border-[1.5px] border-neutral-300 rounded p-3">
          <video ref={videoRef} autoPlay muted playsInline className="w-full max-h-64 rounded bg-black mb-2.5" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelLive}
              className="flex-1 inline-flex items-center justify-center rounded-full font-semibold text-[12.5px] px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={capture}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full font-semibold text-[12.5px] px-4 py-2 bg-green-800 text-white hover:bg-green-600 transition-colors"
            >
              <IconCamera size={14} aria-hidden="true" /> Ambil Foto
            </button>
          </div>
        </div>
      ) : (
        <div className="border-[1.5px] border-dashed border-neutral-300 rounded p-5 text-center">
          <IconCamera size={26} className="mx-auto mb-2 text-neutral-500" aria-hidden="true" />
          <button
            type="button"
            onClick={openCamera}
            className="inline-flex items-center justify-center gap-1.5 rounded-full font-semibold text-[12.5px] px-5 py-2.5 bg-green-800 text-white hover:bg-green-600 transition-colors"
          >
            <IconCamera size={15} aria-hidden="true" /> Buka Kamera
          </button>

          {cameraError && (
            <div className="flex items-center justify-center gap-1 text-[11.5px] text-danger mt-2.5">
              <IconAlertTriangle size={13} aria-hidden="true" /> {cameraError}
            </div>
          )}

          <div className="mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-neutral-500 hover:text-neutral-700"
            >
              <IconUpload size={13} aria-hidden="true" /> atau upload file dari perangkat
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
              onChange={handleManualFile}
            />
          </div>
        </div>
      )}
    </FieldWrap>
  );
}
