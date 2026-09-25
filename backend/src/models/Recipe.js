import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    userEmail: {
      type: String,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: String,
    description: String,
    matchPercentage: {
      type: Number,
      default: 90
    },
    prepTime: {
      type: String,
      default: '15 mins'
    },
    cookTime: {
      type: String,
      default: '25 mins'
    },
    servings: {
      type: Number,
      default: 2
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Intermediate', 'Advanced'],
      default: 'Easy'
    },
    rating: {
      type: Number,
      default: 4.9
    },
    reviewsCount: {
      type: String,
      default: '1.2k'
    },
    calories: Number,
    cuisine: String,
    nutrition: {
      calories: Number,
      servingSize: { type: String, default: '1 serving' },
      protein: { type: String, default: '0g' },
      proteinGrams: Number,
      carbs: { type: String, default: '0g' },
      carbsGrams: Number,
      fat: { type: String, default: '0g' },
      fatGrams: Number,
      fiber: { type: String, default: '0g' },
      fiberGrams: Number,
      sugar: { type: String, default: '0g' },
      sugarGrams: Number,
      sodium: { type: String, default: '0mg' },
      sodiumMg: Number,
      cholesterolMg: Number,
      highlights: [String]
    },
    matchedIngredients: [
      {
        name: String,
        amount: String,
        isFromPantry: { type: Boolean, default: true }
      }
    ],
    missingIngredients: [
      {
        name: String,
        amount: String,
        optional: { type: Boolean, default: false },
        substitute: String
      }
    ],
    instructions: [
      {
        step: Number,
        title: String,
        instruction: String,
        durationMinutes: Number,
        tip: String
      }
    ],
    chefTips: [String],
    whyItWorks: String,
    winePairing: String,
    imageUrl: String,
    tags: [String],
    sourcePhotoUrl: String
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
export default Recipe;
