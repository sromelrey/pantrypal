"use server";

// import { revalidatePath } from 'next/cache'; // Commented out for now as it's not available in this version
import {
  Dish,
  Ingredient,
  CreateDishData,
  UpdateDishData,
  CreateIngredientData,
  UpdateIngredientData,
} from "./types";
import { mockData } from "./mock-data";

// In-memory storage for demo purposes
// In production, this would be replaced with actual database operations
const dishes = [...mockData.dishes];
const ingredients = [...mockData.ingredients];
let nextDishId = Math.max(...dishes.map((d) => d.id)) + 1;
let nextIngredientId = Math.max(...ingredients.map((i) => i.id)) + 1;

// Dish Actions
export async function createDish(
  data: CreateDishData
): Promise<{ success: boolean; dish?: Dish; error?: string }> {
  try {
    console.log("Creating dish:", data);

    // Validate required fields
    if (!data.name.trim()) {
      return { success: false, error: "Dish name is required" };
    }

    if (!data.procedure.trim()) {
      return { success: false, error: "Cooking procedure is required" };
    }

    // Check if dish name already exists
    const existingDish = dishes.find(
      (d) => d.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingDish) {
      return { success: false, error: "A dish with this name already exists" };
    }

    // Validate ingredient IDs
    const validIngredientIds = ingredients.map((i) => i.id);
    const invalidIds = data.ingredientIds.filter(
      (id) => !validIngredientIds.includes(id)
    );
    if (invalidIds.length > 0) {
      return {
        success: false,
        error: `Invalid ingredient IDs: ${invalidIds.join(", ")}`,
      };
    }

    const newDish: Dish = {
      id: nextDishId++,
      name: data.name.trim(),
      procedure: data.procedure.trim(),
      ingredients: data.ingredientIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dishes.push(newDish);
    console.log("Dish created successfully:", newDish);

    // revalidatePath('/'); // Commented out for now
    return { success: true, dish: newDish };
  } catch (error) {
    console.error("Error creating dish:", error);
    return { success: false, error: "Failed to create dish" };
  }
}

export async function updateDish(
  data: UpdateDishData
): Promise<{ success: boolean; dish?: Dish; error?: string }> {
  try {
    console.log("Updating dish:", data);

    const dishIndex = dishes.findIndex((d) => d.id === data.id);
    if (dishIndex === -1) {
      return { success: false, error: "Dish not found" };
    }

    // Validate required fields
    if (!data.name.trim()) {
      return { success: false, error: "Dish name is required" };
    }

    if (!data.procedure.trim()) {
      return { success: false, error: "Cooking procedure is required" };
    }

    // Check if dish name already exists (excluding current dish)
    const existingDish = dishes.find(
      (d) =>
        d.id !== data.id && d.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingDish) {
      return { success: false, error: "A dish with this name already exists" };
    }

    // Validate ingredient IDs
    const validIngredientIds = ingredients.map((i) => i.id);
    const invalidIds = data.ingredientIds.filter(
      (id) => !validIngredientIds.includes(id)
    );
    if (invalidIds.length > 0) {
      return {
        success: false,
        error: `Invalid ingredient IDs: ${invalidIds.join(", ")}`,
      };
    }

    const updatedDish: Dish = {
      ...dishes[dishIndex],
      name: data.name.trim(),
      procedure: data.procedure.trim(),
      ingredients: data.ingredientIds,
      updated_at: new Date().toISOString(),
    };

    dishes[dishIndex] = updatedDish;
    console.log("Dish updated successfully:", updatedDish);

    // revalidatePath('/'); // Commented out for now
    return { success: true, dish: updatedDish };
  } catch (error) {
    console.error("Error updating dish:", error);
    return { success: false, error: "Failed to update dish" };
  }
}

export async function deleteDish(
  dishId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Deleting dish:", dishId);

    const dishIndex = dishes.findIndex((d) => d.id === dishId);
    if (dishIndex === -1) {
      return { success: false, error: "Dish not found" };
    }

    dishes.splice(dishIndex, 1);
    console.log("Dish deleted successfully");

    // revalidatePath('/'); // Commented out for now
    return { success: true };
  } catch (error) {
    console.error("Error deleting dish:", error);
    return { success: false, error: "Failed to delete dish" };
  }
}

export async function getDishes(): Promise<Dish[]> {
  console.log("Fetching dishes:", dishes.length);
  return dishes;
}

// Ingredient Actions
export async function createIngredient(
  data: CreateIngredientData
): Promise<{ success: boolean; ingredient?: Ingredient; error?: string }> {
  try {
    console.log("Creating ingredient:", data);

    // Validate required fields
    if (!data.name.trim()) {
      return { success: false, error: "Ingredient name is required" };
    }

    // Check if ingredient name already exists
    const existingIngredient = ingredients.find(
      (i) => i.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingIngredient) {
      return {
        success: false,
        error: "An ingredient with this name already exists",
      };
    }

    const newIngredient: Ingredient = {
      id: nextIngredientId++,
      name: data.name.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    ingredients.push(newIngredient);
    console.log("Ingredient created successfully:", newIngredient);

    // revalidatePath('/'); // Commented out for now
    return { success: true, ingredient: newIngredient };
  } catch (error) {
    console.error("Error creating ingredient:", error);
    return { success: false, error: "Failed to create ingredient" };
  }
}

export async function updateIngredient(
  data: UpdateIngredientData
): Promise<{ success: boolean; ingredient?: Ingredient; error?: string }> {
  try {
    console.log("Updating ingredient:", data);

    const ingredientIndex = ingredients.findIndex((i) => i.id === data.id);
    if (ingredientIndex === -1) {
      return { success: false, error: "Ingredient not found" };
    }

    // Validate required fields
    if (!data.name.trim()) {
      return { success: false, error: "Ingredient name is required" };
    }

    // Check if ingredient name already exists (excluding current ingredient)
    const existingIngredient = ingredients.find(
      (i) =>
        i.id !== data.id && i.name.toLowerCase() === data.name.toLowerCase()
    );
    if (existingIngredient) {
      return {
        success: false,
        error: "An ingredient with this name already exists",
      };
    }

    const updatedIngredient: Ingredient = {
      ...ingredients[ingredientIndex],
      name: data.name.trim(),
      updated_at: new Date().toISOString(),
    };

    ingredients[ingredientIndex] = updatedIngredient;
    console.log("Ingredient updated successfully:", updatedIngredient);

    // revalidatePath('/'); // Commented out for now
    return { success: true, ingredient: updatedIngredient };
  } catch (error) {
    console.error("Error updating ingredient:", error);
    return { success: false, error: "Failed to update ingredient" };
  }
}

export async function deleteIngredient(
  ingredientId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Deleting ingredient:", ingredientId);

    const ingredientIndex = ingredients.findIndex((i) => i.id === ingredientId);
    if (ingredientIndex === -1) {
      return { success: false, error: "Ingredient not found" };
    }

    // Check if ingredient is used in any dishes
    const dishesUsingIngredient = dishes.filter((d) =>
      d.ingredients.includes(ingredientId)
    );
    if (dishesUsingIngredient.length > 0) {
      return {
        success: false,
        error: `Cannot delete ingredient. It is used in ${
          dishesUsingIngredient.length
        } dish(es): ${dishesUsingIngredient.map((d) => d.name).join(", ")}`,
      };
    }

    ingredients.splice(ingredientIndex, 1);
    console.log("Ingredient deleted successfully");

    // revalidatePath('/'); // Commented out for now
    return { success: true };
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    return { success: false, error: "Failed to delete ingredient" };
  }
}

export async function getIngredients(): Promise<Ingredient[]> {
  console.log("Fetching ingredients:", ingredients.length);
  return ingredients;
}
