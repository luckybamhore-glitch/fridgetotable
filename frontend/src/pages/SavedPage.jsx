import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Clock, Star, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

export default function SavedPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/api/recipes/saved');
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err.message || 'Could not load saved recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.del(`/api/recipes/saved/${id}`);
      setRecipes((prev) => prev.filter((r) => (r._id || r.id) !== id && (r.id || r._id) !== id));
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  return (
    <section style={{ padding: '24px 0 60px 0' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
        <ArrowLeft size={16} /> Back to kitchen
      </Link>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Your collection
      </span>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--text-main)', marginTop: 4 }}>
        Saved Recipes
      </h1>
      <p style={{ color: 'var(--text-muted)' }}>{recipes.length} favorite{recipes.length === 1 ? '' : 's'} in your cookbook.</p>

      {loading && <p style={{ color: 'var(--text-muted)', marginTop: 24 }}>Loading your cookbook...</p>}
      {error && <div className="auth-error" style={{ marginTop: 16 }}>{error}</div>}

      {!loading && recipes.length === 0 && !error && (
        <div style={{ marginTop: 24, padding: 32, background: '#FFFDF9', border: '1px dashed var(--border-subtle)', borderRadius: 16, textAlign: 'center' }}>
          <Heart size={28} color="var(--color-primary)" />
          <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>No saved recipes yet. Generate recipes on the home page and tap the heart to save them here.</p>
          <Link to="/" className="btn-hero-primary" style={{ display: 'inline-flex', marginTop: 16, textDecoration: 'none' }}>Find recipes</Link>
        </div>
      )}

      <div className="recipes-grid" style={{ marginTop: 24 }}>
        {recipes.map((recipe) => {
          const key = recipe._id || recipe.id;
          return (
            <div key={key} className="recipe-card">
              <div className="recipe-card-media">
                <img
                  src={recipe.imageUrl || 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80'}
                  alt={recipe.title}
                  className="recipe-card-img"
                  loading="lazy"
                />
                <button
                  type="button"
                  className="recipe-favorite-btn favorited"
                  title="Remove from favorites"
                  onClick={() => handleDelete(recipe._id || recipe.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="recipe-card-body">
                <h3 className="recipe-card-title">{recipe.title}</h3>
                <p className="recipe-card-subtitle">{recipe.subtitle}</p>
                <div className="recipe-card-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={15} /> {recipe.cookTime || '20 mins'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <Star size={15} className="star-icon" /> {recipe.rating || 4.9}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
