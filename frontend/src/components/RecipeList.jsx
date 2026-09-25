import React from 'react';
import { Clock, Star, Heart, Flame, Sparkles, ChefHat } from 'lucide-react';

export default function RecipeList({
  recipes = [],
  onSelectRecipe,
  savedRecipeIds = [],
  onToggleSaveRecipe
}) {
  if (recipes.length === 0) return null;

  return (
    <section id="recipes-section" style={{ padding: '24px 0 60px 0', scrollMarginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tailored To Your Pantry
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--text-main)', marginTop: 4 }}>
            Editorial Recipes For Tonight
          </h2>
        </div>
      </div>

      <div className="recipes-grid">
        {recipes.map((recipe) => {
          const isSaved = savedRecipeIds.includes(recipe.id || recipe._id);

          return (
            <div
              key={recipe.id || recipe._id}
              className="recipe-card"
              onClick={() => onSelectRecipe(recipe)}
            >
              {/* Media Container */}
              <div className="recipe-card-media">
                <img
                  src={recipe.imageUrl || 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80'}
                  alt={recipe.title}
                  className="recipe-card-img"
                  loading="lazy"
                />

                {/* Match Percentage Pill */}
                <div className="recipe-match-float">
                  <Sparkles size={13} color="#D9532F" />
                  <span>{recipe.matchPercentage}% Match</span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  className={`recipe-favorite-btn ${isSaved ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSaveRecipe(recipe);
                  }}
                  title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Heart size={18} fill={isSaved ? '#E11D48' : 'none'} />
                </button>
              </div>

              {/* Body */}
              <div className="recipe-card-body">
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {recipe.tags?.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: '#FAF2E8',
                        color: '#9A3412',
                        padding: '3px 8px',
                        borderRadius: 6
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <h3 className="recipe-card-title">{recipe.title}</h3>
                <p className="recipe-card-subtitle">{recipe.subtitle}</p>

                {/* Footer Metadata */}
                <div className="recipe-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={15} />
                      {recipe.cookTime || '20 mins'}
                    </span>

                    {recipe.calories && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Flame size={15} color="#D9532F" />
                        {recipe.calories} kcal
                      </span>
                    )}
                  </div>

                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <Star size={15} className="star-icon" />
                    {recipe.rating || 4.9}
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
