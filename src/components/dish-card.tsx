/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChefHat } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { usePantryPalStore } from "@/lib/store";
import { deleteDish } from "@/lib/actions";
import { DishWithIngredients } from "@/lib/types";

interface DishCardProps {
  dish: DishWithIngredients;
  onEdit: (dish: DishWithIngredients) => void;
}

export function DishCard({ dish, onEdit }: DishCardProps) {
  // const { addToast } = usePantryPalStore();
  const { addToast: showToast } = useToast();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${dish.name}"?`)) {
      return;
    }

    try {
      const result = await deleteDish(dish.id);
      if (result.success) {
        usePantryPalStore.getState().deleteDish(dish.id);
        showToast({
          title: "Success",
          description: "Dish deleted successfully!",
          type: "success",
        });
      } else {
        showToast({
          title: "Error",
          description: result.error || "Failed to delete dish",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
    }
  };

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <ChefHat className='h-5 w-5 text-orange-500' />
          {dish.name}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex-1 flex flex-col'>
        {/* Ingredients */}
        <div className='mb-4'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>
            Ingredients:
          </h4>
          <div className='flex flex-wrap gap-1'>
            {dish.ingredients.length > 0 ? (
              dish.ingredients.map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant='secondary'
                  className='text-xs'
                >
                  {ingredient.name}
                </Badge>
              ))
            ) : (
              <span className='text-sm text-gray-500 italic'>
                No ingredients
              </span>
            )}
          </div>
        </div>

        {/* Procedure Preview */}
        <div className='mb-4 flex-1'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>Procedure:</h4>
          <p className='text-sm text-gray-600 line-clamp-4'>{dish.procedure}</p>
        </div>

        {/* Actions */}
        <div className='flex gap-2 mt-auto'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onEdit(dish)}
            className='flex-1'
          >
            <Edit className='h-4 w-4 mr-1' />
            Edit
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDelete}
            className='text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
