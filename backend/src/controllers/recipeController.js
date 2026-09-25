import mongoose from 'mongoose';
import { generateWithFallback, extractJsonArray, isGeminiConfigured } from '../config/gemini.js';
import Recipe from '../models/Recipe.js';
import { inMemoryStore, isDbConnected } from '../config/db.js';
import { FALLBACK_RECIPES } from '../data/sampleData.js';

/**
 * Generate chef recipes from ingredients using Gemini or high-quality fallback
 */
export const generateRecipes = async (req, res) => {
  try {
    const { ingredients = [], preferences = {} } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 1 or 2 ingredients from your fridge.'
      });
    }

    const ingredientNames = ingredients.map(item => (typeof item === 'string' ? item : item.name));
    console.log(`🍳 Generating recipes for ${ingredientNames.length} ingredients:`, ingredientNames.join(', '));

    let recipes = [];
    let generationSource = 'fallback_recipes';

    if (isGeminiConfigured) {
      try {
        console.log('🤖 Calling Google Gemini API to generate tailored culinary recipes...');

        const prompt = `You are a Michelin-star Executive Chef creating inspiring, restaurant-quality dinners for home cooks based strictly on whatever is in their fridge and pantry.

AVAILABLE INGREDIENTS:
${ingredientNames.join(', ')}

DIETARY / CONSTRAINTS:
${preferences.dietary ? preferences.dietary.join(', ') : 'None'}
Max Prep/Cook Time: ${preferences.maxTime || '35'} minutes

TASK:
Create 3 distinct, restaurant-quality recipes that utilize as many of the available ingredients as possible.
At least one recipe should be a signature showstopper (95%+ match).
Be realistic: if a few small pantry staples (like salt, pepper, olive oil, lemon) are missing, list them explicitly under missingIngredients.

CRITICAL: Return ONLY a raw JSON array of objects without markdown backticks.
Schema for each recipe:
{
  "id": "unique-slug-string",
  "title": "Creative Appetizing Name (e.g. Tuscan Creamy Garlic Butter Salmon)",
  "subtitle": "One sentence appetizing editorial description",
  "matchPercentage": number (75 to 98),
  "prepTime": "e.g. 10 mins",
  "cookTime": "e.g. 20 mins",
  "servings": 2,
  "difficulty": "Easy" | "Medium" | "Intermediate",
  "rating": 4.9,
  "reviewsCount": "1.1k",
  "calories": number (approx 400-650, per serving),
  "nutrition": {
    "calories": number (per serving, must match "calories" above),
    "servingSize": "e.g. 1 fillet + 3/4 cup sauce",
    "proteinGrams": number (e.g. 34),
    "carbsGrams": number (e.g. 12),
    "fatGrams": number (e.g. 32),
    "fiberGrams": number (e.g. 3),
    "sugarGrams": number (e.g. 5),
    "sodiumMg": number (e.g. 620),
    "cholesterolMg": number (e.g. 145),
    "highlights": ["High Protein", "Omega-3 Rich", max 3 short labels]
  },
  "cuisine": "e.g. Italian Coastal, Modern Bistro, etc.",
  "imageUrl": "valid unsplash food url",
  "matchedIngredients": [
    { "name": "Ingredient Name", "amount": "quantity used", "isFromPantry": true }
  ],
  "missingIngredients": [
    { "name": "Missing Item", "amount": "quantity", "optional": boolean, "substitute": "what they can use instead" }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Step title",
      "instruction": "Detailed clear instruction",
      "durationMinutes": number,
      "tip": "Chef secret tip for this step"
    }
  ],
  "chefTips": ["tip 1", "tip 2"],
  "whyItWorks": "Culinary chemistry explanation of why these ingredients harmonize",
  "winePairing": "Sommelier recommendation or beverage pairing",
  "tags": ["High Protein", "Under 30 Mins", etc.]
}`;

        const { text: responseText, model: usedModel } = await generateWithFallback(prompt);

        recipes = extractJsonArray(responseText);
        generationSource = `gemini_ai:${usedModel}`;
        console.log(`✅ Generated ${recipes.length} recipes via Gemini AI (${usedModel})!`);
      } catch (geminiErr) {
        console.warn('⚠️ Gemini recipe generation failed, using curated gourmet recipes:', geminiErr.message);
        generationSource = 'fallback_recipes';
      }
    }

    // Fallback if AI not configured or failed
    if (!recipes || recipes.length === 0) {
      recipes = FALLBACK_RECIPES;
      // Adjust match percentage dynamically based on matched items
      recipes = recipes.map(r => {
        const matchesCount = r.matchedIngredients.filter(mi => 
          ingredientNames.some(userIng => userIng.toLowerCase().includes(mi.name.toLowerCase()) || mi.name.toLowerCase().includes(userIng.toLowerCase()))
        ).length;
        const calculatedMatch = Math.min(98, Math.max(78, Math.round((matchesCount / (r.matchedIngredients.length || 1)) * 100)));
        return {
          ...r,
          matchPercentage: calculatedMatch
        };
      });
    }

    // Guarantee every recipe carries a complete per-serving nutrition card,
    // even when the AI omits it or returns partial data.
    recipes = recipes.map(ensureNutrition);

    res.json({
      success: true,
      generationSource,
      count: recipes.length,
      recipes
    });

  } catch (error) {
    console.error('Error in generateRecipes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recipes: ' + error.message
    });
  }
};

/**
 * Ask Chef Assistant for substitutions or tips
 */
export const askChefAssistant = async (req, res) => {
  try {
    const { question, recipeContext } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    if (isGeminiConfigured) {
      const prompt = `You are a friendly, world-class culinary chef assistant for the app "Fridge to Table".
The user is cooking: ${recipeContext?.title || 'a home dinner'}.
User Question: "${question}"

Provide a concise, encouraging, and expert answer (2 to 4 sentences). Give exact substitution ratios if asking about an ingredient.`;

      const { text } = await generateWithFallback(prompt);
      return res.json({
        success: true,
        answer: text,
        source: 'gemini'
      });
    }

    // Smart culinary answers fallback
    let cannedAnswer = "For heavy cream, you can whisk 3/4 cup whole milk with 1/4 cup melted unsalted butter, or use full-fat coconut cream or Greek yogurt with a splash of milk for a silky richness!";
    const qLower = question.toLowerCase();

    if (qLower.includes('substitute') && qLower.includes('butter')) {
      cannedAnswer = "Extra virgin olive oil or ghee is an outstanding 1:1 substitute for butter, adding a lovely aromatic fruitiness to pan sauces.";
    } else if (qLower.includes('salmon') || qLower.includes('fish')) {
      cannedAnswer = "Chicken breasts, firm tofu, or sea bass work with this exact Tuscan garlic pan sauce with similar cooking times.";
    } else if (qLower.includes('garlic')) {
      cannedAnswer = "You can use 1/4 tsp garlic powder per clove, or shallow-fry shallots for a mild, sweet allium profile.";
    }

    res.json({
      success: true,
      answer: cannedAnswer,
      source: 'culinary_knowledge_base'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Save a recipe to favorites (MongoDB or Memory) — scoped to the logged-in user.
 */
export const saveRecipe = async (req, res) => {
  try {
    const recipeData = req.body;
    if (!recipeData || !recipeData.title) {
      return res.status(400).json({ success: false, message: 'Invalid recipe data' });
    }

    if (isDbConnected()) {
      // Prevent duplicate saves of the same recipe per user (title + owner)
      const existing = await Recipe.findOne({
        title: recipeData.title,
        userEmail: req.user?.email
      });
      if (existing) {
        return res.json({ success: true, recipe: existing, storage: 'mongodb', deduped: true });
      }
      const saved = await Recipe.create({
        ...recipeData,
        user: isObjectId(req.user?.id) ? req.user.id : undefined,
        userEmail: req.user?.email
      });
      return res.json({ success: true, recipe: saved, storage: 'mongodb' });
    }

    // In-memory fallback — scoped per user email
    const id = recipeData.id || `rec_${Date.now()}`;
    const owner = req.user?.email || 'anonymous';
    const already = inMemoryStore.recipes.find((r) => (r.id === id || r._id === id) && r.userEmail === owner);
    if (already) {
      return res.json({ success: true, recipe: already, storage: 'in_memory', deduped: true });
    }
    const newRecipe = { ...recipeData, _id: id, id, userEmail: owner, createdAt: new Date() };
    inMemoryStore.recipes.unshift(newRecipe);

    res.json({ success: true, recipe: newRecipe, storage: 'in_memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get saved recipes for the logged-in user only.
 */
export const getSavedRecipes = async (req, res) => {
  try {
    if (isDbConnected()) {
      const recipes = await Recipe.find({ userEmail: req.user?.email }).sort({ createdAt: -1 });
      return res.json({ success: true, count: recipes.length, recipes, storage: 'mongodb' });
    }

    const owner = req.user?.email || 'anonymous';
    const recipes = inMemoryStore.recipes.filter((r) => r.userEmail === owner || (!r.userEmail && owner === 'anonymous'));
    res.json({
      success: true,
      count: recipes.length,
      recipes,
      storage: 'in_memory'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a saved recipe — only if it belongs to the logged-in user.
 */
export const deleteSavedRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const doc = await findOwnedRecipe(id, req.user);
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Recipe not found' });
      }
      await doc.deleteOne();
      return res.json({ success: true, message: 'Recipe removed' });
    }

    const owner = req.user?.email || 'anonymous';
    const before = inMemoryStore.recipes.length;
    inMemoryStore.recipes = inMemoryStore.recipes.filter(
      (r) => !((r._id === id || r.id === id) && (r.userEmail === owner || (!r.userEmail && owner === 'anonymous')))
    );
    if (inMemoryStore.recipes.length === before) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({ success: true, message: 'Recipe removed from in-memory store' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

/**
 * Normalize / backfill per-serving nutrition so the frontend
 * Nutrition card always has complete values.
 */
const ensureNutrition = (recipe) => {
  const calories = toNum(recipe?.nutrition?.calories ?? recipe?.calories, 480);
  const n = recipe?.nutrition || {};

  // Sensible macro split when AI omits values (protein 25% / carbs 35% / fat 40% of kcal)
  const proteinGrams = Math.round(toNum(n.proteinGrams, (calories * 0.25) / 4));
  const carbsGrams = Math.round(toNum(n.carbsGrams, (calories * 0.35) / 4));
  const fatGrams = Math.round(toNum(n.fatGrams, (calories * 0.4) / 9));
  const fiberGrams = Math.round(toNum(n.fiberGrams, 4));
  const sugarGrams = Math.round(toNum(n.sugarGrams, 6));
  const sodiumMg = Math.round(toNum(n.sodiumMg ?? n.sodium, 620));
  const cholesterolMg = Math.round(toNum(n.cholesterolMg, 120));

  const nutrition = {
    calories,
    servingSize: n.servingSize || '1 serving',
    proteinGrams,
    protein: n.protein || `${proteinGrams}g`,
    carbsGrams,
    carbs: n.carbs || `${carbsGrams}g`,
    fatGrams,
    fat: n.fat || `${fatGrams}g`,
    fiberGrams,
    fiber: n.fiber || `${fiberGrams}g`,
    sugarGrams,
    sugar: n.sugar || `${sugarGrams}g`,
    sodiumMg,
    sodium: n.sodium || `${sodiumMg}mg`,
    cholesterolMg,
    highlights: Array.isArray(n.highlights) ? n.highlights.slice(0, 3) : []
  };

  return { ...recipe, calories, nutrition };
};

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const findOwnedRecipe = async (id, user) => {
  const or = [];
  if (mongoose.Types.ObjectId.isValid(id)) or.push({ _id: id });
  or.push({ id });
  const doc = await Recipe.findOne({ $or: or });
  if (!doc) return null;
  // Legacy docs without owner are treated as unowned -> deny unless same legacy path;
  // enforce ownership when userEmail is present.
  if (doc.userEmail && doc.userEmail !== user?.email) return null;
  return doc;
};
