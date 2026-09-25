import React from 'react';
import { Sparkles, Camera, Check } from 'lucide-react';

export default function HeroSection({
  onOpenSnap,
  onOpenCuttingBoard,
  exampleIngredients = [],
  selectedIngredients = [],
  onToggleIngredient
}) {
  return (
    <section className="hero-section">
      {/* Left Column: Headline & Controls */}
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} />
          AI KITCHEN COMPANION
        </div>

        <h1 className="hero-title">
          Turn whatever is in your fridge into
          <em>restaurant-quality dinner.</em>
        </h1>

        <p className="hero-description">
          Type what ingredients you have, or snap a photo of your open fridge.
          Our AI matches your exact pantry with step-by-step editorial recipes
          and video tutorials.
        </p>

        <div className="hero-actions">
          <button 
            className="btn-hero-primary" 
            onClick={onOpenCuttingBoard}
          >
            <Sparkles size={18} />
            Open The Cutting Board
          </button>

          <button 
            className="btn-hero-secondary" 
            onClick={onOpenSnap}
          >
            <Camera size={18} />
            Snap Fridge Photo
          </button>
        </div>

        {/* Example Ingredient Board from reference design */}
        <div className="ingredient-board-preview">
          <span className="board-label">EXAMPLE INGREDIENT BOARD:</span>
          <div className="board-chips">
            {exampleIngredients.map((ing) => {
              const isSelected = selectedIngredients.includes(ing);
              return (
                <button
                  key={ing}
                  type="button"
                  className={`chip ${isSelected ? '' : 'inactive'}`}
                  onClick={() => onToggleIngredient(ing)}
                  title={isSelected ? 'Included in pantry' : 'Click to add to pantry'}
                >
                  <span>{ing}</span>
                  {isSelected && <Check size={15} className="chip-check" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Editorial Hero Image */}
      <div className="hero-media-wrapper">
        <div className="hero-image-frame">
          <img
            src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80"
            alt="Tuscan Creamy Garlic Butter Salmon with Fresh Vegetables"
            className="hero-food-img"
          />
        </div>
      </div>
    </section>
  );
}
