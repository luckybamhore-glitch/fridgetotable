import React, { useState, useEffect } from 'react';
import { ChefHat, Flame, Salad, Soup, Timer, Sparkles } from 'lucide-react';

const GENERATION_STEPS = [
  {
    icon: Salad,
    title: 'Reading your pantry...',
    subtitle: 'Matching fresh ingredients to flavor profiles'
  },
  {
    icon: Flame,
    title: 'Preheating the kitchen...',
    subtitle: 'Warming up Gemini Chef AI for your pantry'
  },
  {
    icon: Soup,
    title: 'Simmering ideas...',
    subtitle: 'Combining tastes, textures and cook times'
  },
  {
    icon: Timer,
    title: 'Timing every step...',
    subtitle: 'Balancing under-30-minute, high-protein picks'
  },
  {
    icon: Sparkles,
    title: 'Plating your menu...',
    subtitle: 'Adding photos, ratings and chef tips'
  }
];

export default function RecipeGeneratingLoader({ isOpen, ingredientCount = 0, ingredients = [] }) {
  const [stepIndex, setStepIndex] = useState(0);

  // Rotate through fun cooking steps while generating
  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % GENERATION_STEPS.length);
    }, 2400);
    return () => clearInterval(id);
  }, [isOpen]);

  // Lock background scroll while the loading screen is visible
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const CurrentIcon = GENERATION_STEPS[stepIndex].icon;
  const previewNames = ingredients.slice(0, 4).map((i) => (typeof i === 'string' ? i : i.name));

  return (
    <div
      className="recipe-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label="Generating recipes"
    >
      <div className="recipe-loader-card">
        {/* Animated chef mark */}
        <div className="recipe-loader-visual">
          <span className="recipe-loader-ring ring-1" />
          <span className="recipe-loader-ring ring-2" />
          <span className="recipe-loader-ring ring-3" />
          <div className="recipe-loader-chef">
            <ChefHat size={40} />
          </div>
          <div className="recipe-loader-pot-bubble b1" />
          <div className="recipe-loader-pot-bubble b2" />
          <div className="recipe-loader-pot-bubble b3" />
        </div>

        <span className="recipe-loader-eyebrow">
          <Sparkles size={14} />
          Chef AI is cooking
        </span>
        <h2 className="recipe-loader-title">Crafting your recipes...</h2>

        {/* Rotating step */}
        <div key={stepIndex} className="recipe-loader-step">
          <span className="recipe-loader-step-icon">
            <CurrentIcon size={18} />
          </span>
          <div>
            <p className="recipe-loader-step-title">{GENERATION_STEPS[stepIndex].title}</p>
            <p className="recipe-loader-step-subtitle">{GENERATION_STEPS[stepIndex].subtitle}</p>
          </div>
        </div>

        {/* Indeterminate progress bar */}
        <div className="recipe-loader-progress">
          <div className="recipe-loader-progress-bar" />
        </div>

        {/* Step dots */}
        <div className="recipe-loader-dots">
          {GENERATION_STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`recipe-loader-dot ${idx === stepIndex ? 'active' : idx < stepIndex ? 'done' : ''}`}
            />
          ))}
        </div>

        {/* Context: what we're cooking from */}
        {ingredientCount > 0 && (
          <div className="recipe-loader-context">
            <span className="recipe-loader-context-label">
              Cooking from {ingredientCount} ingredient{ingredientCount === 1 ? '' : 's'}
              {previewNames.length > 0 ? ':' : ''}
            </span>
            {previewNames.length > 0 && (
              <div className="recipe-loader-chips">
                {previewNames.map((name) => (
                  <span key={name} className="recipe-loader-chip">{name}</span>
                ))}
                {ingredientCount > previewNames.length && (
                  <span className="recipe-loader-chip muted">+{ingredientCount - previewNames.length} more</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Skeleton preview cards */}
        <div className="recipe-loader-skeletons" aria-hidden="true">
          {[0, 1, 2].map((n) => (
            <div key={n} className="recipe-loader-skeleton-card">
              <div className="recipe-loader-skeleton-media shimmer" />
              <div className="recipe-loader-skeleton-line short shimmer" />
              <div className="recipe-loader-skeleton-line shimmer" />
              <div className="recipe-loader-skeleton-line shimmer" />
            </div>
          ))}
        </div>

        <p className="recipe-loader-hint">This usually takes a few seconds — please keep this tab open.</p>
      </div>
    </div>
  );
}
