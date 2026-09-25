import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, Server, Sparkles, Cloud, Database } from 'lucide-react';
import { api } from '../lib/api';

export default function SettingsModal({ isOpen, onClose }) {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/api/health', { auth: false });
      setHealthData(data);
    } catch (err) {
      console.log('Health check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>System & Integration Diagnostics</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              MERN Stack, Gemini Vision AI, and Cloudinary pipeline status
            </p>
          </div>
          <button
            type="button"
            onClick={fetchHealth}
            style={{ background: '#F5EFE7', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Refresh Status"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {/* Gemini */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#FAF6F2', borderRadius: 16, border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FDEEE9', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Google Gemini Vision API</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {healthData?.services?.geminiVision === 'active'
                    ? 'Connected & Ready for live photo vision analysis'
                    : 'Running in Smart Intelligence fallback engine mode'}
                </span>
              </div>
            </div>
            <span style={{
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: '0.78rem',
              fontWeight: 700,
              background: healthData?.services?.geminiVision === 'active' ? '#DCFCE7' : '#FEF3C7',
              color: healthData?.services?.geminiVision === 'active' ? '#166534' : '#92400E'
            }}>
              {healthData?.services?.geminiVision === 'active' ? 'LIVE' : 'FALLBACK ACTIVE'}
            </span>
          </div>

          {/* Cloudinary */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#FAF6F2', borderRadius: 16, border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cloud size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Cloudinary CDN Storage</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {healthData?.services?.cloudinary === 'active'
                    ? 'Connected & uploading to Cloudinary cloud'
                    : 'Running in high-speed local data-URI preview mode'}
                </span>
              </div>
            </div>
            <span style={{
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: '0.78rem',
              fontWeight: 700,
              background: healthData?.services?.cloudinary === 'active' ? '#DCFCE7' : '#FEF3C7',
              color: healthData?.services?.cloudinary === 'active' ? '#166534' : '#92400E'
            }}>
              {healthData?.services?.cloudinary === 'active' ? 'LIVE' : 'DATA-URI ACTIVE'}
            </span>
          </div>

          {/* Database */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#FAF6F2', borderRadius: 16, border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Storage Engine</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {healthData?.services?.database === 'mongodb'
                    ? 'Connected to MongoDB Database'
                    : 'Running in zero-config in-memory store'}
                </span>
              </div>
            </div>
            <span style={{
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: '0.78rem',
              fontWeight: 700,
              background: healthData?.services?.database === 'mongodb' ? '#DCFCE7' : '#F3E8FF',
              color: healthData?.services?.database === 'mongodb' ? '#166534' : '#6B21A8'
            }}>
              {healthData?.services?.database === 'mongodb' ? 'MONGODB' : 'IN-MEMORY'}
            </span>
          </div>
        </div>

        {/* Configuration Guide */}
        <div style={{ background: '#FFFDF9', border: '1px dashed var(--border-subtle)', borderRadius: 16, padding: 18 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
            How to plug in your live API keys:
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Simply open <code>backend/.env</code> in your workspace and add:
          </p>
          <pre style={{ background: '#231C18', color: '#F8F3EB', padding: '12px 14px', borderRadius: 10, fontSize: '0.82rem', marginTop: 8, overflowX: 'auto' }}>
{`GEMINI_API_KEY=your_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_atlas_uri`}
          </pre>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Free Gemini API keys can be generated at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>Google AI Studio</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
