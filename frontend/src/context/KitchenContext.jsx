import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

export const INITIAL_EXAMPLE_INGREDIENTS = [
  'Salmon Fillets',
  'Garlic',
  'Spinach',
  'Heavy Cream',
  'Sun-dried Tomatoes',
  'Butter'
];

const DEFAULT_INGREDIENTS = [
  { name: 'Salmon Fillets', category: 'Meat & Seafood', confidence: 'high', freshnessHint: 'fresh' },
  { name: 'Garlic', category: 'Produce', confidence: 'high', freshnessHint: 'stable' },
  { name: 'Spinach', category: 'Produce', confidence: 'high', freshnessHint: 'needs-use-soon' },
  { name: 'Heavy Cream', category: 'Dairy & Eggs', confidence: 'high', freshnessHint: 'fresh' },
  { name: 'Sun-dried Tomatoes', category: 'Pantry & Grains', confidence: 'high', freshnessHint: 'stable' },
  { name: 'Butter', category: 'Dairy & Eggs', confidence: 'high', freshnessHint: 'stable' }
];

const DEFAULT_DIETARY = ['High Protein', 'Under 30 Mins'];

const KitchenContext = createContext(null);

const scrollToRecipes = () => {
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      const el = document.getElementById('recipes-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });
};

export function KitchenProvider({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [ingredients, setIngredients] = useState(DEFAULT_INGREDIENTS);
  const [selectedDietary, setSelectedDietary] = useState(DEFAULT_DIETARY);
  const [recipes, setRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);

  // Global modals
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isChefAssistantOpen, setIsChefAssistantOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);

  const fetchSavedRecipes = useCallback(async () => {
    if (!localStorage.getItem('ftt_token')) {
      setSavedRecipeIds([]);
      return;
    }
    try {
      const data = await api.get('/api/recipes/saved');
      if (data.success && data.recipes) {
        setSavedRecipeIds(data.recipes.map((r) => r.id || r._id));
      }
    } catch {
      setSavedRecipeIds([]);
    }
  }, []);

  const generateRecipes = useCallback(async (
    currentIngredients = ingredients,
    dietary = selectedDietary,
    { celebrate = true, goHome = false } = {}
  ) => {
    if (currentIngredients.length === 0) return;
    setIsGenerating(true);
    try {
      const data = await api.post('/api/recipes/generate', {
        ingredients: currentIngredients.map((i) => i.name),
        preferences: { dietary, maxTime: 30 }
      }, { auth: false });
      if (data.success && data.recipes) {
        setRecipes(data.recipes);
        if (celebrate) {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
        }
        if (goHome) {
          navigate('/');
          scrollToRecipes();
        } else if (celebrate) {
          scrollToRecipes();
        }
      }
    } catch (err) {
      console.error('Failed to generate recipes:', err);
    } finally {
      setIsGenerating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients, selectedDietary, navigate]);

  // Initial load — do NOT auto-generate recipes here.
  // Recipes should only generate on explicit user action
  // (Cutting Board generate button, fridge photo scan, etc.)
  useEffect(() => {
    fetchSavedRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch saved list when auth state changes.
  // When the user logs out, also clear any generated recipes from the
  // landing page so the next visitor / logged-out view starts clean.
  useEffect(() => {
    if (!isAuthenticated) {
      setRecipes([]);
      setSelectedRecipe(null);
      setSavedRecipeIds([]);
      setIsGenerating(false);
    }
    fetchSavedRecipes();
  }, [isAuthenticated, fetchSavedRecipes]);

  // Allow the global navbar to open the snap modal from any route
  useEffect(() => {
    const open = () => setIsSnapModalOpen(true);
    window.addEventListener('ftt:open-snap', open);
    if (new URLSearchParams(window.location.search).get('snap') === '1') {
      setIsSnapModalOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
    return () => window.removeEventListener('ftt:open-snap', open);
  }, []);

  const toggleExampleIngredient = useCallback((name) => {
    setIngredients((prev) => {
      const exists = prev.some((i) => i.name.toLowerCase() === name.toLowerCase());
      if (exists) return prev.filter((i) => i.name.toLowerCase() !== name.toLowerCase());
      return [...prev, { name, category: 'Produce', confidence: 'high', freshnessHint: 'fresh' }];
    });
  }, []);

  const addIngredient = useCallback((newItem) => {
    setIngredients((prev) => {
      if (prev.some((i) => i.name.toLowerCase() === newItem.name.toLowerCase())) return prev;
      return [newItem, ...prev];
    });
  }, []);

  const removeIngredient = useCallback((name) => {
    setIngredients((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const clearIngredients = useCallback(() => setIngredients([]), []);

  const clearRecipes = useCallback(() => {
    setRecipes([]);
    setSelectedRecipe(null);
    setIsGenerating(false);
  }, []);

  const toggleDietary = useCallback((diet) => {
    setSelectedDietary((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]));
  }, []);

  const handleIngredientsDetected = useCallback((newDetectedIngredients) => {
    const combined = [...newDetectedIngredients];
    setIngredients(combined);
    // Fresh scan → take the user to the recipes on the home page
    generateRecipes(combined, selectedDietary, { goHome: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateRecipes, selectedDietary]);

  const toggleSaveRecipe = useCallback(async (recipe) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/saved', notice: 'Log in to save recipes to your collection.' } });
      return;
    }
    const recipeId = recipe.id || recipe._id;
    const isAlreadySaved = savedRecipeIds.includes(recipeId);

    if (isAlreadySaved) {
      setSavedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      try {
        await api.del(`/api/recipes/saved/${recipeId}`);
        fetchSavedRecipes();
      } catch (e) {
        console.log(e);
      }
    } else {
      setSavedRecipeIds((prev) => [...prev, recipeId]);
      try {
        await api.post('/api/recipes/save', recipe);
        fetchSavedRecipes();
      } catch (e) {
        console.log(e);
        setSavedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      }
    }
  }, [isAuthenticated, navigate, savedRecipeIds, fetchSavedRecipes]);

  const value = {
    ingredients,
    selectedDietary,
    recipes,
    isGenerating,
    selectedRecipe,
    savedRecipeIds,
    isSnapModalOpen,
    isSettingsModalOpen,
    isChefAssistantOpen,
    isAskAiOpen,
    setSelectedRecipe,
    setIsSnapModalOpen,
    setIsSettingsModalOpen,
    setIsChefAssistantOpen,
    setIsAskAiOpen,
    fetchSavedRecipes,
    generateRecipes,
    clearRecipes,
    toggleExampleIngredient,
    addIngredient,
    removeIngredient,
    clearIngredients,
    toggleDietary,
    handleIngredientsDetected,
    toggleSaveRecipe
  };

  return <KitchenContext.Provider value={value}>{children}</KitchenContext.Provider>;
}

export const useKitchen = () => {
  const ctx = useContext(KitchenContext);
  if (!ctx) throw new Error('useKitchen must be used within KitchenProvider');
  return ctx;
};
