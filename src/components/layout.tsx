"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ChefHat, Package, Lightbulb } from "lucide-react";
import { DishForm } from "./dish-form";
import { IngredientForm } from "./ingredient-form";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "dishes" | "ingredients" | "suggestions";
  onTabChange: (tab: "dishes" | "ingredients" | "suggestions") => void;
  showDishForm: boolean;
  setShowDishForm: (show: boolean) => void;
  showIngredientForm: boolean;
  setShowIngredientForm: (show: boolean) => void;
}

export function Layout({
  children,
  activeTab,
  onTabChange,
  showDishForm,
  setShowDishForm,
  showIngredientForm,
  setShowIngredientForm,
}: LayoutProps) {
  const tabs = [
    { id: "dishes", label: "Dishes", icon: ChefHat },
    { id: "ingredients", label: "Ingredients", icon: Package },
    { id: "suggestions", label: "Suggestions", icon: Lightbulb },
  ] as const;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-3'>
              <ChefHat className='h-8 w-8 text-orange-500' />
              <h1 className='text-xl font-bold text-gray-900'>PantryPal</h1>
            </div>

            {/* Mobile Add Button */}
            <div className='flex gap-2 sm:hidden'>
              {activeTab === "dishes" && (
                <Dialog open={showDishForm} onOpenChange={setShowDishForm}>
                  <DialogTrigger asChild>
                    <Button size='sm'>
                      <Plus className='h-4 w-4' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                    <DishForm
                      onClose={() => setShowDishForm(false)}
                      onSuccess={() => setShowDishForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}

              {activeTab === "ingredients" && (
                <Dialog
                  open={showIngredientForm}
                  onOpenChange={setShowIngredientForm}
                >
                  <DialogTrigger asChild>
                    <Button size='sm'>
                      <Plus className='h-4 w-4' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-md'>
                    <IngredientForm
                      onClose={() => setShowIngredientForm(false)}
                      onSuccess={() => setShowIngredientForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex space-x-8'>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  <span className='hidden sm:inline'>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Desktop Add Buttons */}
        <div className='hidden sm:flex justify-end mb-6 gap-2'>
          {activeTab === "dishes" && (
            <Dialog open={showDishForm} onOpenChange={setShowDishForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Dish
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                <DishForm
                  onClose={() => setShowDishForm(false)}
                  onSuccess={() => setShowDishForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}

          {activeTab === "ingredients" && (
            <Dialog
              open={showIngredientForm}
              onOpenChange={setShowIngredientForm}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Ingredient
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <IngredientForm
                  onClose={() => setShowIngredientForm(false)}
                  onSuccess={() => setShowIngredientForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Tab Content */}
        <div className='space-y-6'>{children}</div>
      </main>
    </div>
  );
}
