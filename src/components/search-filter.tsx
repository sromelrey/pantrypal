"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { usePantryPalStore } from "@/lib/store";

export function SearchFilter() {
  const { searchFilters, setSearchFilters, getAvailableIngredients } =
    usePantryPalStore();

  const availableIngredients = getAvailableIngredients();

  const handleSearchChange = (value: string) => {
    setSearchFilters({
      ...searchFilters,
      query: value,
    });
  };

  const handleIngredientFilter = (ingredientId: string) => {
    const id = parseInt(ingredientId);
    const newIngredientIds = searchFilters.ingredientIds.includes(id)
      ? searchFilters.ingredientIds.filter((existingId) => existingId !== id)
      : [...searchFilters.ingredientIds, id];

    setSearchFilters({
      ...searchFilters,
      ingredientIds: newIngredientIds,
    });
  };

  const removeIngredientFilter = (ingredientId: number) => {
    setSearchFilters({
      ...searchFilters,
      ingredientIds: searchFilters.ingredientIds.filter(
        (id) => id !== ingredientId
      ),
    });
  };

  const clearAllFilters = () => {
    setSearchFilters({
      query: "",
      ingredientIds: [],
    });
  };

  const getSelectedIngredients = () => {
    return searchFilters.ingredientIds
      .map((id) => availableIngredients.find((ing) => ing.id === id))
      .filter(Boolean);
  };

  const getAvailableFilterOptions = () => {
    return availableIngredients.filter(
      (ing) => !searchFilters.ingredientIds.includes(ing.id)
    );
  };

  const hasActiveFilters =
    searchFilters.query || searchFilters.ingredientIds.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Search className='h-5 w-5' />
          Search & Filter Dishes
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Search Input */}
        <div className='space-y-2'>
          <Label htmlFor='search'>Search by name or ingredients</Label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              id='search'
              placeholder='Search dishes...'
              value={searchFilters.query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Ingredient Filter */}
        <div className='space-y-2'>
          <Label>Filter by ingredients</Label>
          <div className='flex gap-2'>
            <Select onValueChange={handleIngredientFilter}>
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Select ingredients to filter by' />
              </SelectTrigger>
              <SelectContent>
                {getAvailableFilterOptions().map((ingredient) => (
                  <SelectItem
                    key={ingredient.id}
                    value={ingredient.id.toString()}
                  >
                    {ingredient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant='outline'
              size='sm'
              disabled={getAvailableFilterOptions().length === 0}
            >
              <Filter className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label className='text-sm font-medium'>Active Filters:</Label>
              <Button
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='text-xs'
              >
                Clear All
              </Button>
            </div>

            <div className='flex flex-wrap gap-2'>
              {searchFilters.query && (
                <Badge variant='secondary' className='flex items-center gap-1'>
                  Search: "{searchFilters.query}"
                  <button
                    onClick={() => handleSearchChange("")}
                    className='hover:bg-gray-300 rounded-full p-0.5'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              )}

              {getSelectedIngredients().map((ingredient) => (
                <Badge
                  key={ingredient!.id}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {ingredient!.name}
                  <button
                    onClick={() => removeIngredientFilter(ingredient!.id)}
                    className='hover:bg-gray-300 rounded-full p-0.5'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
