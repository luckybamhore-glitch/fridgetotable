import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Camera, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';

export default function SnapFridgeModal({ isOpen, onClose, onIngredientsDetected }) {
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'camera' | 'samples'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [detectedTags, setDetectedTags] = useState([]);
  const [sampleFridges, setSampleFridges] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [noticeMsg, setNoticeMsg] = useState('');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Fetch preset sample fridges on mount
  useEffect(() => {
    api.get('/api/vision/samples', { auth: false })
      .then(data => {
        if (data.success) {
          setSampleFridges(data.data);
        }
      })
      .catch(err => console.log('Could not load sample fridges:', err));
  }, []);

  // Cleanup camera stream on close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSelectedFile(null);
      setPreviewUrl('');
      setIsScanning(false);
      setDetectedTags([]);
      setErrorMsg('');
      setNoticeMsg('');
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedImage(file);
    }
  };

  const processSelectedImage = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setErrorMsg('');
  };

  // Live Camera handlers
  const startCamera = async () => {
    setActiveMode('camera');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setErrorMsg('Camera access is not permitted or not available. Please upload a photo instead.');
      setActiveMode('upload');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `fridge_snap_${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopCamera();
        processSelectedImage(file);
        setActiveMode('upload');
      }
    }, 'image/jpeg', 0.9);
  };

  // Perform Gemini Vision AI Scan
  const handleScanImage = async (presetItem = null) => {
    setIsScanning(true);
    setErrorMsg('');
    setNoticeMsg('');
    setDetectedTags([]);
    setScanStep('Uploading high-res frame to Cloudinary CDN...');

    try {
      const formData = new FormData();
      if (presetItem) {
        formData.append('sampleId', presetItem.id);
        formData.append('imageUrl', presetItem.imageUrl);
        setPreviewUrl(presetItem.imageUrl);
      } else if (selectedFile) {
        formData.append('image', selectedFile);
      } else {
        setErrorMsg('Please select or capture a photo first.');
        setIsScanning(false);
        return;
      }

      // Simulated radar progression for visual delight
      setTimeout(() => setScanStep('Gemini 1.5/2.5 Vision inspecting shelves & crisper drawers...'), 1100);
      setTimeout(() => setScanStep('Classifying fresh produce, dairy proteins, and pantry items...'), 2200);

      const response = await api.postForm('/api/vision/analyze', formData);

      const data = response;

      if (!data.success) {
        throw new Error(data.message || 'Analysis failed');
      }

      setScanStep('Ingredients identified successfully!');
      setDetectedTags(data.ingredients || []);
      if (data.isFallback) {
        setNoticeMsg('AI vision was unavailable, so demo ingredients are shown. Check the backend Gemini model setup and try again.');
      } else {
        setNoticeMsg('');
      }

      // Fire celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Brief delay so user sees detected results then transit to cutting board
      setTimeout(() => {
        setIsScanning(false);
        onIngredientsDetected(data.ingredients, data.imageUrl);
        onClose();
      }, 1400);

    } catch (err) {
      console.error('Scan error:', err);
      setErrorMsg(err.message || 'Could not process photo');
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Vision AI Pipeline
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-main)', marginTop: 4 }}>
            Snap & Scan Your Fridge
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
            Upload a photo of your open fridge or pantry. Google Gemini Vision will identify all available ingredients automatically.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {noticeMsg && (
          <div style={{ background: '#FEF3C7', color: '#92400E', padding: '12px 16px', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
            <AlertCircle size={18} />
            <span>{noticeMsg}</span>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
          <button
            type="button"
            onClick={() => { stopCamera(); setActiveMode('upload'); }}
            style={{
              background: activeMode === 'upload' ? 'var(--bg-terracotta-light)' : 'transparent',
              color: activeMode === 'upload' ? 'var(--color-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <UploadCloud size={16} />
            Upload Photo
          </button>

          <button
            type="button"
            onClick={startCamera}
            style={{
              background: activeMode === 'camera' ? 'var(--bg-terracotta-light)' : 'transparent',
              color: activeMode === 'camera' ? 'var(--color-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Camera size={16} />
            Live Camera
          </button>

          <button
            type="button"
            onClick={() => { stopCamera(); setActiveMode('samples'); }}
            style={{
              background: activeMode === 'samples' ? 'var(--bg-terracotta-light)' : 'transparent',
              color: activeMode === 'samples' ? 'var(--color-primary)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Sparkles size={16} />
            Try Preset Fridges
          </button>
        </div>

        {/* Live Camera View */}
        {activeMode === 'camera' && (
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', height: 320, background: '#000', marginBottom: 20 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={captureCameraFrame}
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '12px 26px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                }}
              >
                <Camera size={18} />
                Capture Snapshot
              </button>
            </div>
          </div>
        )}

        {/* Upload Mode View */}
        {activeMode === 'upload' && !isScanning && !previewUrl && (
          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('dragover');
              const file = e.dataTransfer.files?.[0];
              if (file) processSelectedImage(file);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div className="dropzone-icon-circle">
              <UploadCloud size={30} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
              Click to browse or drop fridge photo here
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Supports JPG, PNG, WEBP from your phone or desktop
            </p>
          </div>
        )}

        {/* Scanning or Preview State */}
        {(previewUrl || isScanning) && activeMode !== 'camera' && activeMode !== 'samples' && (
          <div>
            <div className="scanner-preview-wrapper">
              <img src={previewUrl} alt="Fridge preview" className="scanner-image" />
              {isScanning && <div className="scanner-laser"></div>}

              {/* Live detected tag badges appearing */}
              {detectedTags.map((tag, idx) => (
                <div
                  key={tag.name}
                  className="scanner-overlay-tag"
                  style={{
                    top: `${20 + (idx * 16) % 65}%`,
                    left: `${15 + (idx * 22) % 65}%`
                  }}
                >
                  ✓ {tag.name}
                </div>
              ))}
            </div>

            {isScanning ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--color-primary)', fontWeight: 600, fontSize: '1rem' }}>
                  <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{scanStep}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(''); setSelectedFile(null); }}
                  className="btn-hero-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.95rem' }}
                >
                  Choose Different Photo
                </button>
                <button
                  type="button"
                  onClick={() => handleScanImage()}
                  className="btn-hero-primary"
                  style={{ padding: '10px 26px', fontSize: '0.95rem' }}
                >
                  <Sparkles size={16} />
                  Analyze with Gemini AI
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sample Presets Grid */}
        {activeMode === 'samples' && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              Select any sample fridge photo to test Gemini Vision and recipe matching instantly:
            </p>
            <div className="sample-presets-grid">
              {sampleFridges.map((preset) => (
                <div
                  key={preset.id}
                  className="sample-preset-card"
                  onClick={() => handleScanImage(preset)}
                >
                  <img src={preset.imageUrl} alt={preset.name} className="sample-preset-img" />
                  <span className="sample-preset-name">{preset.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {preset.ingredients?.length || 8} items detected
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
