// SortableTodoItem.jsx
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import './SortableTodoItem.css';

export const SortableTodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isCompleted, setIsCompleted] = useState(false);// add this 

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

  // add handleCheckboxChange function for "completed"
  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    setIsCompleted(e.target.checked);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`todo-card-wrapper ${isCompleted ? 'completed' : ''}`}// change this line
    >
      <div 
        {...attributes}
        {...listeners}
        className="drag-handle"
      >
        ⋮⋮
      </div>

      <input 
          type="checkbox" 
          className="checkbox"
          checked={isCompleted}// add this line
          onChange={handleCheckboxChange}// add this line
          onClick={(e) => e.stopPropagation()}
      />

      
      <div className="todo-content">
 
        {/* add another div */}
        <div className={`todo-text ${isCompleted ? 'completed': ''}`}> 
          <h3>{todo.name}</h3>
          <p>{todo.description}</p>
          {/* Add proper priority styling */}
          <span className={`priority-tag ${todo.priority}`}>{todo.priority?.toUpperCase()}</span>
        </div>

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
