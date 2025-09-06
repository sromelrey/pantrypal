"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SearchFilter } from "@/components/search-filter";
import { DishCard } from "@/components/dish-card";
import { IngredientList } from "@/components/ingredient-list";
import { DishSuggestions } from "@/components/dish-suggestions";
import { DishForm } from "@/components/dish-form";
import { IngredientForm } from "@/components/ingredient-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ToastProvider } from "@/components/ui/toast";
import { usePantryPalStore } from "@/lib/store";
import { getDishes, getIngredients } from "@/lib/actions";
import { DishWithIngredients, Ingredient } from "@/lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "dishes" | "ingredients" | "suggestions"
  >("dishes");
  const [editingDish, setEditingDish] = useState<DishWithIngredients | null>(
    null
  );
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const [showDishForm, setShowDishForm] = useState(false);
  const [showIngredientForm, setShowIngredientForm] = useState(false);

  const {
    dishes,
    ingredients,
    setDishes,
    setIngredients,
    getFilteredDishes,
    getAvailableIngredients,
  } = usePantryPalStore();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dishesData, ingredientsData] = await Promise.all([
          getDishes(),
          getIngredients(),
        ]);
        setDishes(dishesData);
        setIngredients(ingredientsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [setDishes, setIngredients]);

  const handleEditDish = (dish: DishWithIngredients) => {
    setEditingDish(dish);
    setShowDishForm(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowIngredientForm(true);
  };

  const handleCloseForms = () => {
    setShowDishForm(false);
    setShowIngredientForm(false);
    setEditingDish(null);
    setEditingIngredient(null);
  };

  const filteredDishes = getFilteredDishes();
  const availableIngredients = getAvailableIngredients();

  return (
    <ToastProvider>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showDishForm={showDishForm}
        setShowDishForm={setShowDishForm}
        showIngredientForm={showIngredientForm}
        setShowIngredientForm={setShowIngredientForm}
      >
        {/* Dishes Tab */}
        {activeTab === "dishes" && (
          <div className='space-y-6'>
            <SearchFilter />

            {filteredDishes.length === 0 ? (
              <div className='text-center py-12'>
                <div className='text-gray-500'>
                  <p className='text-lg mb-2'>No dishes found</p>
                  <p className='text-sm'>
                    Try adjusting your search filters or add a new dish
                  </p>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} onEdit={handleEditDish} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ingredients Tab */}
        {activeTab === "ingredients" && (
          <div className='space-y-6'>
            <IngredientList
              ingredients={availableIngredients}
              onEdit={handleEditIngredient}
            />
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === "suggestions" && (
          <div className='space-y-6'>
            <DishSuggestions />
          </div>
        )}

        {/* Forms */}
        <Dialog open={showDishForm} onOpenChange={setShowDishForm}>
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DishForm
              dish={editingDish || undefined}
              onClose={handleCloseForms}
              onSuccess={handleCloseForms}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showIngredientForm} onOpenChange={setShowIngredientForm}>
          <DialogContent className='max-w-md'>
            <IngredientForm
              ingredient={editingIngredient || undefined}
              onClose={handleCloseForms}
              onSuccess={handleCloseForms}
            />
          </DialogContent>
        </Dialog>
      </Layout>
    </ToastProvider>
  );
}
