// SortableTodoItem.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableTodoItem = ({ todo, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: todo.id,
    data: todo
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    touchAction: 'none'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="todo-card-wrapper"
    >
      <div 
        {...attributes}
        {...listeners}
        className="drag-handle"
      >
        ⋮⋮
      </div>
      
      <div className="todo-content">
        <input 
          type="checkbox" 
          className="checkbox"
          onClick={(e) => e.stopPropagation()}
        />
        <h3>{todo.name}</h3>
        <p>{todo.description}</p>
      </div>
      
      <div className="action-button">
        <button
          type="button"
          className="update-btn"
          onClick={onUpdate}
        >
          Update 📝
        </button>
        <button
          type="button"
          className="delete-btn"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
