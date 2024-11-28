## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Project Structure
src/
├── app/
│   └── page.tsx           # Main page component
├── components/
│   ├── AddNavigationItem.tsx    # New item form
│   ├── EditNavigationItem.tsx   # Edit item form
│   ├── NavigationList.tsx       # DnD container
│   ├── SortableItem.tsx        # Draggable item
│   └── MoveIcon.tsx            # Drag handle icon

# Features

- Navigation List: Display navigation items with labels and URLs
- Drag & Drop: Reorder items using drag and drop
- Nested Navigation: Create parent/child relationships
- Form Validation: Required fields and URL format validation
- Real-time Updates: Instant feedback with toast notifications

# List to improve

- Design to be improved
- Improve URL validation in Edit Form
- State management to be improved (Zustand as example)