// Type definitions for PantryPal app

export interface Ingredient {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Dish {
  id: number;
  name: string;
  procedure: string;
  ingredients: number[]; // Array of ingredient IDs
  created_at?: string;
  updated_at?: string;
}

export interface DishWithIngredients extends Omit<Dish, "ingredients"> {
  ingredients: Ingredient[];
}

export interface MockData {
  ingredients: Ingredient[];
  dishes: Dish[];
}

// Form types for creating/updating
export interface CreateDishData {
  name: string;
  procedure: string;
  ingredientIds: number[];
}

export interface UpdateDishData extends CreateDishData {
  id: number;
}

export interface CreateIngredientData {
  name: string;
}

export interface UpdateIngredientData extends CreateIngredientData {
  id: number;
}

// Search and filter types
export interface SearchFilters {
  query: string;
  ingredientIds: number[];
}

export interface DishSuggestion {
  dish: DishWithIngredients;
  matchScore: number;
  matchedIngredients: Ingredient[];
}
