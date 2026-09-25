import React from 'react';
import { Flame, Salad } from 'lucide-react';
import { getNutrition, dailyValues } from '../utils/nutrition';

/**
 * Per-serving Nutrition Facts card shown inside the recipe detail modal
 * (the card that opens when a user chooses a recipe).
 */
export default function NutritionCard({ recipe }) {
  if (!recipe) return null;
  const n = getNutrition(recipe);
  const dv = dailyValues(n);

  const proteinKcal = n.proteinGrams * 4;
  const carbsKcal = n.carbsGrams * 4;
  const fatKcal = n.fatGrams * 9;
  const macroTotal = Math.max(1, proteinKcal + carbsKcal + fatKcal);
  const proteinPct = Math.round((proteinKcal / macroTotal) * 100);
  const carbsPct = Math.round((carbsKcal / macroTotal) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  const rows = [
    { label: 'Protein', value: n.protein, dv: dv.protein, color: '#2E7D32', bg: '#E8F5E9' },
    { label: 'Carbs', value: n.carbs, dv: dv.carbs, color: '#9A3412', bg: '#FFF3E0' },
    { label: 'Fat', value: n.fat, dv: dv.fat, color: '#6D4C41', bg: '#EFEBE9' },
    { label: 'Fiber', value: n.fiber, dv: dv.fiber, color: '#33691E', bg: '#F1F8E9' },
    { label: 'Sugar', value: n.sugar, dv: dv.sugar, color: '#AD1457', bg: '#FCE4EC' },
    { label: 'Sodium', value: n.sodium, dv: dv.sodium, color: '#455A64', bg: '#ECEFF1' }
  ];

  return (
    <div className="nutrition-card" aria-label="Nutrition facts">
      <div className="nutrition-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="nutrition-icon-badge">
            <Salad size={18} />
          </span>
          <div>
            <h3 className="nutrition-title">Nutrition Facts</h3>
            <p className="nutrition-subtitle">Per serving &middot; {n.servingSize}</p>
          </div>
        </div>
        <div className="nutrition-calories">
          <span className="nutrition-calories-value">
            <Flame size={16} color="#D9532F" style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
            {n.calories}
          </span>
          <span className="nutrition-calories-label">kcal / serving</span>
        </div>
      </div>

      {n.highlights.length > 0 && (
        <div className="nutrition-highlights">
          {n.highlights.map((h) => (
            <span key={h} className="nutrition-highlight-pill">{h}</span>
          ))}
        </div>
      )}

      {/* Macro energy split bar */}
      <div className="nutrition-macro-bar" title={`Protein ${proteinPct}% · Carbs ${carbsPct}% · Fat ${fatPct}%`}>
        <div style={{ width: `${proteinPct}%`, background: '#43A047' }} />
        <div style={{ width: `${carbsPct}%`, background: '#E58744' }} />
        <div style={{ width: `${fatPct}%`, background: '#8D6E63' }} />
      </div>
      <div className="nutrition-macro-legend">
        <span><i style={{ background: '#43A047' }} /> Protein {proteinPct}%</span>
        <span><i style={{ background: '#E58744' }} /> Carbs {carbsPct}%</span>
        <span><i style={{ background: '#8D6E63' }} /> Fat {fatPct}%</span>
      </div>

      <div className="nutrition-grid">
        {rows.map((r) => (
          <div key={r.label} className="nutrition-cell" style={{ background: r.bg }}>
            <span className="nutrition-cell-label" style={{ color: r.color }}>{r.label}</span>
            <span className="nutrition-cell-value">{r.value}</span>
            <span className="nutrition-cell-dv">{r.dv}% DV</span>
            <div className="nutrition-cell-track">
              <div
                className="nutrition-cell-fill"
                style={{ width: `${Math.min(100, r.dv)}%`, background: r.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="nutrition-footnote">
        Cholesterol {n.cholesterolMg}mg &middot; % Daily Values are based on a 2,000-calorie diet.
        Values are per-serving estimates generated with the recipe.
      </p>
    </div>
  );
}
