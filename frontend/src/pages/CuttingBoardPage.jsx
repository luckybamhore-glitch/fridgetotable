import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CuttingBoard from '../components/CuttingBoard';
import { useKitchen } from '../context/KitchenContext';

export default function CuttingBoardPage() {
  const navigate = useNavigate();
  const {
    ingredients,
    selectedDietary,
    recipes,
    isGenerating,
    addIngredient,
    removeIngredient,
    clearIngredients,
    toggleDietary,
    generateRecipes,
    setIsSnapModalOpen
  } = useKitchen();

  const handleGenerate = async () => {
    await generateRecipes(ingredients, selectedDietary, { goHome: true });
  };

  return (
    <>
      <Link
        to="/"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}
      >
        <ArrowLeft size={16} /> Back to home
      </Link>

      <CuttingBoard
        ingredients={ingredients}
        onAddIngredient={addIngredient}
        onRemoveIngredient={removeIngredient}
        onClearIngredients={clearIngredients}
        onGenerateRecipes={handleGenerate}
        isGenerating={isGenerating}
        selectedDietary={selectedDietary}
        onToggleDietary={toggleDietary}
        onOpenSnap={() => setIsSnapModalOpen(true)}
      />

      {recipes.length > 0 && !isGenerating && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 48 }}>
          <button
            type="button"
            className="btn-hero-primary"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('recipes-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
          >
            View {recipes.length} generated recipes
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </>
  );
}
