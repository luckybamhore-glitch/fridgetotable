import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section style={{ textAlign: 'center', padding: '80px 20px' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>404</span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', margin: '8px 0' }}>Plate not found</h1>
      <p style={{ color: 'var(--text-muted)' }}>That page wandered out of the kitchen.</p>
      <Link to="/" className="btn-hero-primary" style={{ display: 'inline-flex', marginTop: 20, textDecoration: 'none' }}>
        Back to home
      </Link>
    </section>
  );
}
