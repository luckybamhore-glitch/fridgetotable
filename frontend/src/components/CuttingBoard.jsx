import React, { useState } from 'react';
import { Plus, X, Sparkles, Filter, Check, ChefHat, Trash2, Camera } from 'lucide-react';

export default function CuttingBoard({
  ingredients = [],
  onAddIngredient,
  onRemoveIngredient,
  onClearIngredients,
  onGenerateRecipes,
  isGenerating,
  selectedDietary = [],
  onToggleDietary,
  onOpenSnap
}) {
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Produce');

  const categories = [
    'Produce',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Pantry & Grains',
    'Condiments & Sauces'
  ];

  const dietaryOptions = [
    'Under 30 Mins',
    'High Protein',
    'Vegetarian',
    'Gluten-Free',
    'Low Carb',
    'Keto-Friendly'
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;
    onAddIngredient({
      name: newIngredient.trim(),
      category: selectedCategory,
      confidence: 'high',
      freshnessHint: 'fresh'
    });
    setNewIngredient('');
  };

  // Group items by category
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = ingredients.filter(i => (i.category || 'Produce') === cat);
    return acc;
  }, {});

  // Any other uncategorized
  const otherItems = ingredients.filter(i => !categories.includes(i.category));
  if (otherItems.length > 0) {
    grouped['Other Items'] = otherItems;
  }

  return (
    <section id="cutting-board-section" className="cutting-board-section">
      <div className="section-header">
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Live Inventory
          </span>
          <h2 className="section-title">The Cutting Board</h2>
          <p className="section-subtitle">
            {ingredients.length} ingredients ready for your dinner. Add staples, remove items, or refine dietary goals.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn-hero-secondary"
            onClick={onOpenSnap}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <Camera size={16} />
            Scan More Items
          </button>

          {ingredients.length > 0 && (
            <button
              type="button"
              onClick={onClearIngredients}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-full)',
                padding: '10px 16px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              title="Clear all ingredients"
            >
              <Trash2 size={15} />
              Reset
            </button>
          )}

          <button
            type="button"
            className="btn-hero-primary"
            onClick={onGenerateRecipes}
            disabled={isGenerating || ingredients.length === 0}
            style={{
              opacity: (isGenerating || ingredients.length === 0) ? 0.7 : 1,
              padding: '12px 28px'
            }}
          >
            <Sparkles size={18} />
            {isGenerating ? 'Chef AI Formulating...' : 'Generate Recipes'}
          </button>
        </div>
      </div>

      {/* Dietary & Cooking Filters */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
          Dietary Focus & Preferences:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {dietaryOptions.map((diet) => {
            const isSelected = selectedDietary.includes(diet);
            return (
              <button
                key={diet}
                type="button"
                onClick={() => onToggleDietary(diet)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-light)',
                  background: isSelected ? 'var(--bg-terracotta-light)' : '#FFFFFF',
                  color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease'
                }}
              >
                {isSelected && <Check size={14} />}
                {diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Add Ingredient Bar */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="Add an ingredient (e.g., Parmigiano, Olive Oil, Asparagus)..."
          style={{
            flex: '1 1 280px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
            fontSize: '0.95rem',
            outline: 'none',
            background: '#FFFFFF',
            boxShadow: 'var(--shadow-sm)'
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
            background: '#FFFFFF',
            fontSize: '0.9rem',
            color: 'var(--text-main)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          type="submit"
          className="btn-hero-secondary"
          style={{ padding: '10px 22px', fontSize: '0.92rem' }}
        >
          <Plus size={16} />
          Add Item
        </button>
      </form>

      {/* Categorized Ingredients Display */}
      <div className="board-categories-grid">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="category-card">
            <div className="category-title">
              <span>{category}</span>
              <span style={{ fontSize: '0.78rem', background: '#F4EFE7', padding: '2px 8px', borderRadius: 10 }}>
                {items.length}
              </span>
            </div>

            {items.length === 0 ? (
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No items in this category yet
              </p>
            ) : (
              <div className="ingredients-flow">
                {items.map((ing) => (
                  <div key={ing.name} className="ingredient-pill">
                    <span>{ing.name}</span>
                    <button
                      type="button"
                      className="remove-ing-btn"
                      onClick={() => onRemoveIngredient(ing.name)}
                      title={`Remove ${ing.name}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
