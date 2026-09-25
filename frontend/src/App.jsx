import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { KitchenProvider, useKitchen } from './context/KitchenContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import SnapFridgeModal from './components/SnapFridgeModal';
import RecipeDetailModal from './components/RecipeDetailModal';
import RecipeGeneratingLoader from './components/RecipeGeneratingLoader';
import ChefAssistantModal from './components/ChefAssistantModal';
import SettingsModal from './components/SettingsModal';
import HomePage from './pages/HomePage';
import CuttingBoardPage from './pages/CuttingBoardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage';
import NotFoundPage from './pages/NotFoundPage';

function Shell() {
  const {
    savedRecipeIds,
    selectedRecipe,
    setSelectedRecipe,
    isSnapModalOpen,
    setIsSnapModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isChefAssistantOpen,
    setIsChefAssistantOpen,
    isAskAiOpen,
    setIsAskAiOpen,
    handleIngredientsDetected,
    recipes,
    isGenerating,
    ingredients
  } = useKitchen();

  return (
    <div className="app-container">
      <Navbar
        onOpenSnap={() => setIsSnapModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAskAi={() => setIsAskAiOpen(true)}
        savedCount={savedRecipeIds.length}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cutting-board" element={<CuttingBoardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedPage />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {/* Global modals */}
      <SnapFridgeModal
        isOpen={isSnapModalOpen}
        onClose={() => setIsSnapModalOpen(false)}
        onIngredientsDetected={handleIngredientsDetected}
      />

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
        onOpenChefAssistant={() => setIsChefAssistantOpen(true)}
      />

      <ChefAssistantModal
        recipe={selectedRecipe || recipes[0]}
        isOpen={isChefAssistantOpen}
        onClose={() => setIsChefAssistantOpen(false)}
      />

      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />

      {/* Global Ask AI Chef — available from the navbar on every page */}
      <ChefAssistantModal
        recipe={null}
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
      />

      {/* Full-screen loading screen while recipes are generating */}
      <RecipeGeneratingLoader
        isOpen={isGenerating}
        ingredientCount={ingredients.length}
        ingredients={ingredients}
      />

      <footer className="site-footer">
        <div>
          <strong>Fridge to Table</strong> — Michelin-inspired dinners from everyday fridge contents.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>Powered by Google Gemini Vision & Cloudinary CDN Pipeline.</span>
          <button
            type="button"
            className="footer-status-btn"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            System status
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <KitchenProvider>
          <Shell />
        </KitchenProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
