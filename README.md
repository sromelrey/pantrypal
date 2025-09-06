# PantryPal 🍳

A Next.js web application for managing dishes, ingredients, and getting cooking suggestions based on what you have in your pantry.

## Features

### 📌 Core Features

- **Dish Management (CRUD)**: Add, update, delete, and view dishes with cooking procedures and ingredients
- **Ingredient Management (CRUD)**: Add, update, delete, and view ingredients
- **Dish Suggestions**: Get dish recommendations based on available ingredients with fuzzy matching
- **Search & Filtering**: Search dishes by name and filter by ingredients
- **Mobile-First Design**: Responsive design that works great on all devices

### 🛠️ Technical Features

- **Next.js 15** with App Router
- **Server Actions** for CRUD operations
- **Zustand** for state management
- **shadcn/ui** components with Tailwind CSS
- **TypeScript** for type safety
- **Mock Data** for testing (ready for PostgreSQL integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Managing Dishes
- Navigate to the "Dishes" tab
- Click "Add Dish" to create a new dish
- Fill in the dish name, cooking procedure, and select ingredients
- Edit or delete existing dishes using the action buttons

### Managing Ingredients
- Navigate to the "Ingredients" tab
- Click "Add Ingredient" to create a new ingredient
- Edit or delete existing ingredients

### Getting Dish Suggestions
- Navigate to the "Suggestions" tab
- Select ingredients you have available
- View suggested dishes with match percentages
- See which ingredients you're missing for each dish

### Searching and Filtering
- Use the search bar to find dishes by name or ingredients
- Filter dishes by specific ingredients
- Clear filters to see all dishes

## Database Integration

The app currently uses mock data for demonstration. To integrate with PostgreSQL:

1. Update the server actions in `src/lib/actions.ts`
2. Replace the in-memory storage with actual database queries
3. Uncomment the `revalidatePath` calls for proper cache invalidation

### Database Schema

```sql
-- Dishes table
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  procedure TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Many-to-many relationship between dishes and ingredients
CREATE TABLE dish_ingredients (
  dish_id INT REFERENCES dishes(id) ON DELETE CASCADE,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
  PRIMARY KEY (dish_id, ingredient_id)
);
```

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── dish-card.tsx
│   ├── dish-form.tsx
│   ├── dish-suggestions.tsx
│   ├── ingredient-form.tsx
│   ├── ingredient-list.tsx
│   ├── layout.tsx
│   ├── search-filter.tsx
│   └── toast.tsx
└── lib/
    ├── actions.ts    # Server actions
    ├── mock-data.ts  # Sample data
    ├── store.ts      # Zustand store
    ├── types.ts      # TypeScript types
    └── utils.ts      # Utility functions
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **Lucide React** - Icons
- **Server Actions** - Server-side operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details