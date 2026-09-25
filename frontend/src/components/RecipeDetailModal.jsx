import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, Users, Star, Sparkles, Check, HelpCircle, Wine, Play, Pause, RotateCcw, MessageCircleQuestion } from 'lucide-react';
import NutritionCard from './NutritionCard';

export default function RecipeDetailModal({ recipe, isOpen, onClose, onOpenChefAssistant }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Reset timer on step change or modal open
  useEffect(() => {
    if (recipe && recipe.instructions && recipe.instructions[activeStepIndex]) {
      const stepDuration = recipe.instructions[activeStepIndex].durationMinutes || 3;
      setTimerSeconds(stepDuration * 60);
      setIsTimerRunning(false);
    }
  }, [recipe, activeStepIndex]);

  // Countdown effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card recipe-modal-wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Hero Banner */}
        <div className="recipe-modal-hero">
          <img src={recipe.imageUrl} alt={recipe.title} />
          <div className="recipe-modal-hero-gradient">
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span className="pick-match-tag" style={{ background: '#FFF', color: '#B45309' }}>
                <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />
                {recipe.matchPercentage}% Pantry Match
              </span>
              {recipe.cuisine && (
                <span style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600 }}>
                  {recipe.cuisine}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="recipe-stats-grid">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', display: 'block' }}>Prep Time</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{recipe.prepTime || '10 mins'}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', display: 'block' }}>Cook Time</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{recipe.cookTime || '20 mins'}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', display: 'block' }}>Servings</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{recipe.servings || 2} portions</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', display: 'block' }}>Calories</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>{recipe.calories || 480} kcal</span>
          </div>
        </div>

        {/* Nutrition Facts Card — per-serving nutritional details */}
        <NutritionCard recipe={recipe} />

        {/* Ask Assistant Prompt Banner */}
        <div style={{ background: '#FFF8F3', border: '1px solid #FED7AA', borderRadius: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} color="#D9532F" />
            <span style={{ fontSize: '0.92rem', color: '#9A3412', fontWeight: 500 }}>
              Need substitutions, wine pairing advice, or scaling for guests?
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChefAssistant(recipe)}
            style={{
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <MessageCircleQuestion size={15} />
            Ask Chef AI
          </button>
        </div>

        {/* Ingredients Checklist */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 16 }}>
            Ingredients Breakdown
          </h3>

          <div className="ingredients-breakdown-grid">
            {/* From Your Fridge */}
            <div style={{ background: '#F8FAF5', border: '1px solid #E2EED8', borderRadius: 16, padding: 18 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>
                ✓ Ready in Your Pantry ({recipe.matchedIngredients?.length || 0})
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recipe.matchedIngredients?.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Check size={14} color="#2E7D32" strokeWidth={3} />
                      <strong>{item.name}</strong>
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing or Optional */}
            <div style={{ background: '#FFFBF5', border: '1px solid #FDE8CF', borderRadius: 16, padding: 18 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>
                Staples / Optional Swaps ({recipe.missingIngredients?.length || 0})
              </span>
              {(!recipe.missingIngredients || recipe.missingIngredients.length === 0) ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>You have 100% of the needed ingredients!</p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recipe.missingIngredients.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{item.amount}</span>
                      </div>
                      {item.substitute && (
                        <div style={{ fontSize: '0.78rem', color: '#9A3412', marginTop: 2 }}>
                          ↳ Swap: {item.substitute}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Step-by-Step Cooking Steps */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
              Step-by-Step Culinary Method
            </h3>

            {/* Step Timer Widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F5EFE7', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
              <Clock size={16} color="var(--color-primary)" />
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                {formatTime(timerSeconds)}
              </span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}
                title={isTimerRunning ? 'Pause timer' : 'Start step timer'}
              >
                {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  const stepDur = recipe.instructions?.[activeStepIndex]?.durationMinutes || 3;
                  setTimerSeconds(stepDur * 60);
                  setIsTimerRunning(false);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                title="Reset timer"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="cooking-steps-list">
            {recipe.instructions?.map((step, idx) => (
              <div
                key={idx}
                className={`cooking-step-item ${activeStepIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveStepIndex(idx)}
                style={{ cursor: 'pointer' }}
              >
                <div className="step-number-badge">{step.step || idx + 1}</div>
                <div className="step-details">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 className="step-title">{step.title}</h4>
                    {step.durationMinutes && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        approx {step.durationMinutes} mins
                      </span>
                    )}
                  </div>
                  <p className="step-instruction">{step.instruction}</p>
                  {step.tip && (
                    <div className="step-chef-tip">
                      <Sparkles size={14} style={{ flexShrink: 0 }} />
                      <span><strong>Chef's Secret:</strong> {step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why It Works & Wine Pairing */}
        <div className="chem-pair-grid">
          {recipe.whyItWorks && (
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Culinary Chemistry
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {recipe.whyItWorks}
              </p>
            </div>
          )}

          {recipe.winePairing && (
            <div style={{ background: '#FAF6F2', padding: 14, borderRadius: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Wine size={20} color="#D9532F" style={{ marginTop: 2 }} />
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9A3412', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Sommelier Pairing
                </span>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: 2 }}>
                  {recipe.winePairing}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
