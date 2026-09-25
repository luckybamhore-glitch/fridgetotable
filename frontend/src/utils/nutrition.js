/**
 * Normalize per-serving nutrition for any recipe object.
 * Works with new AI recipes (recipe.nutrition), legacy recipes
 * (only `calories`), and saved recipes from MongoDB.
 */
export function getNutrition(recipe = {}) {
  const src = recipe?.nutrition || {};
  const toNum = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  const str = (v, fallback) => (v === undefined || v === null || v === '' ? fallback : String(v));

  const calories = Math.round(toNum(src.calories ?? recipe?.calories, 480));

  // Backfill missing macros from calories (protein 25% / carbs 35% / fat 40% of kcal)
  const proteinGrams = Math.round(toNum(src.proteinGrams ?? parseFloat(src.protein), (calories * 0.25) / 4));
  const carbsGrams = Math.round(toNum(src.carbsGrams ?? parseFloat(src.carbs), (calories * 0.35) / 4));
  const fatGrams = Math.round(toNum(src.fatGrams ?? parseFloat(src.fat), (calories * 0.4) / 9));
  const fiberGrams = Math.round(toNum(src.fiberGrams ?? parseFloat(src.fiber), 4));
  const sugarGrams = Math.round(toNum(src.sugarGrams ?? parseFloat(src.sugar), 6));
  const sodiumMg = Math.round(toNum(src.sodiumMg ?? parseFloat(src.sodium), 620));
  const cholesterolMg = Math.round(toNum(src.cholesterolMg ?? parseFloat(src.cholesterol), 120));

  return {
    calories,
    servingSize: str(src.servingSize, '1 serving'),
    protein: str(src.protein, `${proteinGrams}g`),
    proteinGrams,
    carbs: str(src.carbs, `${carbsGrams}g`),
    carbsGrams,
    fat: str(src.fat, `${fatGrams}g`),
    fatGrams,
    fiber: str(src.fiber, `${fiberGrams}g`),
    fiberGrams,
    sugar: str(src.sugar, `${sugarGrams}g`),
    sugarGrams,
    sodium: str(src.sodium, `${sodiumMg}mg`),
    sodiumMg,
    cholesterolMg,
    highlights: Array.isArray(src.highlights) ? src.highlights : []
  };
}

/** % Daily Value helpers (2000 kcal reference diet) */
export function dailyValues(nutrition) {
  return {
    protein: Math.min(100, Math.round(((nutrition.proteinGrams || 0) / 50) * 100)),
    carbs: Math.min(100, Math.round(((nutrition.carbsGrams || 0) / 275) * 100)),
    fat: Math.min(100, Math.round(((nutrition.fatGrams || 0) / 78) * 100)),
    fiber: Math.min(100, Math.round(((nutrition.fiberGrams || 0) / 28) * 100)),
    sugar: Math.min(100, Math.round(((nutrition.sugarGrams || 0) / 50) * 100)),
    sodium: Math.min(100, Math.round(((nutrition.sodiumMg || 0) / 2300) * 100))
  };
}
