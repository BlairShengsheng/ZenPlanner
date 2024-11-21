//SortableHabitItem.jsx


// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";


// export const SortableHabitItem = ({habit, onUpdate, onDelete}) => {

//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging

//   } = useSortable({
//     id: habit.id,
//     // data: habit
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//     cursor: 'grab',
//     touchAction: 'none'
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       <div {...attributes} {...listeners} className="drag-handle">⋮⋮</div>

//       <div className="habit-content">
//           <input 
//             type="checkbox"
//             className="checkbox"
//             onClick={(e) => e.stopPropagation()}
//           />
//           <div className="habit-text">
//             <h3>{habit.name}</h3>
//             <p>{habit.description}</p>
//           </div>

//         </div>

//       <div className="action-button">
//         <button type="button" className="update-btn" onClick={onUpdate}>Update 📝</button>
//         <button type="button" className="delete-btn" onClick={onDelete}>Delete</button>
//       </div>

//     </div>
//   )
// }


import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableHabitItem = ({ habit, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: habit.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="habit-item">
      <div {...attributes} {...listeners} className="menu-dots">
        ⋮
      </div>
      
      <input
        type="checkbox"
        className="checkbox"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="habit-content">
        <div className="habit-name">{habit.name}</div>
        <div className="habit-description">{habit.description}</div>
      </div>

      <div className="action-buttons">
        <button className="update-btn" onClick={onUpdate}>
          Update
        </button>
        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};
