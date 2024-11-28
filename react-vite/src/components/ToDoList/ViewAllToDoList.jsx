// ViewAllToDoList.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { NavLink } from 'react-router-dom';
import { setAllTasksThunk, deleteATaskThunk } from "../../redux/tasks";
import DeleteConfirmationModal from "./DeleteToDos";
import EditConfirmationModal from "./EditToDos";

import { CreateTaskModal } from './CreateToDos'; 

import { DndContext, TouchSensor, PointerSensor, KeyboardSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { SortableTodoItem } from "./SortableTodoItem";
// import "./list.css"
import "./ToDoList.css";




export const ViewAllToDoList = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const todoObj = useSelector(state => state.tasks.allTasks);
  
  const [todos, setTodos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  // Add new state for create modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Load initial todos
  useEffect(() => {
    const loadToDoList = async () => {
      setIsLoading(true);
      try {
        if (sessionUser) {
          await dispatch(setAllTasksThunk());
        }
      } catch (error) {
        console.error('Error loading To Do List:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToDoList();
  }, [dispatch, sessionUser]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (todoObj) {
      const filteredTodos = Object.values(todoObj)
        .filter(todo => todo && todo.user_id === sessionUser?.id);
      setTodos(filteredTodos);
    }
  }, [todoObj, sessionUser]);

  if (isLoading) return <div>Loading...</div>;
  if (!sessionUser) return <div>Please log in to view your To Do Lists</div>;

  const handleEditClick = (todo, e) => {
    e.stopPropagation();
    setSelectedTodo(todo);
    setShowEditModal(true);
  };

  const handleDeleteClick = (todo, e) => {
    e.stopPropagation();
    setSelectedTodo(todo);
    setShowDeleteModal(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTodos((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="ToDos-Page">
      {/* <h1>To Do List
      <NavLink to='/tasks/new' title="Create a new To Do List">  ✚</NavLink>
      </h1> */}

      <h1>
        To Do List
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="add-task-button"
          title="Create a new To Do List"
        >  
          ✚
        </button>
      </h1>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="ToDos-Column">
          {todos.length > 0 ? (
          <SortableContext items={todos} strategy={verticalListSortingStrategy}>
              {todos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={(e) => handleEditClick(todo, e)}
                  onDelete={(e) => handleDeleteClick(todo, e)}
                />
              ))}
            </SortableContext>
          ) : (
            <p>No to dos found. Create a new to do list to get started!</p>
          )}
        </div>
      </DndContext>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          dispatch(setAllTasksThunk());
        }}
      />

      <EditConfirmationModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTodo(null);
          dispatch(setAllTasksThunk());
        }}
        todoData={selectedTodo}
      />

      <DeleteConfirmationModal 
        show={showDeleteModal}
        onConfirm={async () => {
          try {
            if (selectedTodo?.id) {
              await dispatch(deleteATaskThunk(selectedTodo.id));
              await dispatch(setAllTasksThunk());
            }
          } finally {
            setShowDeleteModal(false);
            setSelectedTodo(null);
          }
        }}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedTodo(null);
        }}
      />
    </div>
  );
};
