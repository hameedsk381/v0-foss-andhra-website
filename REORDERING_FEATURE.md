# Drag-and-Drop Reordering Feature

## ✅ Implementation Complete

The Dynamic Programs CMS now supports **drag-and-drop reordering** for all content types.

## 🎯 Features

### Visual Reordering
- **Drag Handle**: Grip icon on the left of each row
- **Live Feedback**: Items become semi-transparent while dragging
- **Smooth Animation**: CSS transitions for visual feedback
- **Auto-save**: Order updates automatically on drop

### Technical Implementation

#### 1. **Dependencies**
```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable list support
- `@dnd-kit/utilities` - CSS utilities

#### 2. **Database Order Field**
All content items have an `order` field:
- Automatically assigned on creation
- Starts at 0 and increments
- Updated via reorder API

#### 3. **API Endpoints**

**Reorder Endpoint:**
```
POST /api/admin/programs/[id]/[contentType]/reorder

Body:
{
  "items": [
    { "id": "item1", "order": 0 },
    { "id": "item2", "order": 1 },
    { "id": "item3", "order": 2 }
  ]
}
```

**List Endpoint** (updated):
- Now orders by `order ASC` instead of `createdAt DESC`
- Ensures consistent display order

**Create Endpoint** (updated):
- Automatically assigns next available order number
- Prevents gaps in order sequence

#### 4. **Component Updates**

**DynamicList Component:**
- Added `DndContext` wrapper
- Created `SortableRow` component
- Added drag handle column
- Integrated order persistence

**Props Added:**
```typescript
interface DynamicListProps {
  // ... existing props
  programId: string      // Required for API calls
  onReorder?: () => void // Callback after reorder
}
```

## 🎨 User Experience

### How to Reorder
1. Hover over any row
2. Click and hold the grip icon (⋮⋮) on the left
3. Drag the row up or down
4. Release to drop
5. Order saves automatically

### Visual Feedback
- **Dragging**: Row becomes 50% transparent
- **Updating**: "Updating order..." message appears
- **Success**: Toast notification confirms save
- **Error**: Toast notification + order reverts

## 🔧 Usage Example

```tsx
<DynamicList
  contentType={contentType}
  data={sortedData}
  onEdit={handleEdit}
  onDelete={handleDelete}
  programId="fosstar"
  onReorder={() => fetchData()} // Refresh after reorder
/>
```

## 📝 Code Structure

```
components/admin/
└── DynamicList.tsx              ← Drag-and-drop enabled

app/api/admin/programs/[id]/[contentType]/
├── route.ts                     ← Updated GET/POST
└── reorder/
    └── route.ts                 ← New reorder endpoint

app/admin/programs/[id]/[contentType]/
└── page.tsx                     ← Updated props
```

## 🎯 Accessibility

- **Keyboard Support**: Use Tab + Space/Enter to grab, Arrow keys to move
- **Screen Reader**: Announces drag state and position
- **Focus Management**: Maintains focus during drag operations

## 🔒 Security

- **Authentication**: Requires NextAuth session
- **Validation**: Checks array format and item structure
- **Transaction**: All updates in single database transaction
- **Error Handling**: Reverts on failure

## 🚀 Benefits

1. **Intuitive**: No manual order input needed
2. **Visual**: See changes in real-time
3. **Reliable**: Transaction-based updates
4. **Flexible**: Works for all content types
5. **Accessible**: Keyboard and screen reader support

## 📊 Performance

- **Optimistic Updates**: UI updates immediately
- **Batch Operations**: Single API call for all changes
- **Transaction Safety**: All-or-nothing updates
- **Revert on Error**: Maintains data integrity

## 🎉 What's Next (Tier 3)

- Bulk actions (select multiple items)
- Search and filtering
- Image upload system
- Preview mode
- Export/Import functionality

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: ✅ Complete and Ready to Use
