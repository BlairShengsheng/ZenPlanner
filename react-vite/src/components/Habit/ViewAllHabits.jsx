// ViewAllHabits.jsx
import { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteAHabitThunk, setAllHabitsThunk } from "../../redux/habits";
import DeleteConfirmedModal from "./DeleteHabits";
import EditConfirmedModal from "./EditHabits";
import CreateHabitModal from "./CreateHabits";
import "./habitList.css";


import { DndContext, TouchSensor, PointerSensor, KeyboardSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { SortableHabitItem } from "./SortableHabitItem";


export const ViewAllHabit = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const habitObj = useSelector(state => state.habits.allHabits);

  const [habits, setHabits] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add new state for create modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor,{
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

  //Load initail habits
  useEffect(() => {
    const loadHabitList = async () => {
      setIsLoading(true);

      try{
        if(sessionUser){
          await dispatch(setAllHabitsThunk());
        }
      } catch (error){
        console.error('Error loading habit list:', error);

      } finally {
        setIsLoading(false);
      }
    };
    loadHabitList();
  },[dispatch, sessionUser]);

  // Update local state when Redux state changes
  useEffect(() => {
    if(habitObj){
      const filteredHabits = Object.values(habitObj).filter(habit => habit && habit.user_id === sessionUser?.id);
      setHabits(filteredHabits);
    }
  },[habitObj, sessionUser]);

  if(isLoading) return <div>Loading...</div>;
  if(!sessionUser) return <div>Please log in to view your Habit Lists</div>;

  const handleEditClick = (e, habit) => {
    e.stopPropagation();
    setSelectedHabit(habit);
    setShowEditModal(true);
  };

  const handleDeleteClick = (e, habit) => {
    e.stopPropagation();
    setSelectedHabit(habit);
    setShowDeleteModal(true);
  };

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (!over || active.id === over.id) return;

    setHabits((items) => { // change this line 
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      return  arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="habit-page">
      {/* <h1>Habit List
      <NavLink to='/habits/new' title="Create a new Habit List">  ✚</NavLink>
      </h1> */}

      <h1>
        Habit List
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="add-habit-button"
          title="Create a new Habit List"
        >  
          ✚
        </button>
      </h1>


        <DndContext 
          sensors={sensors} 
          onDragEnd={handleDragEnd} 
          collisionDetection={closestCorners}
        >
          <div className="habits-column">
            {habits.length > 0 ? (
            <SortableContext items={habits.map(habit => habit.id)} strategy={verticalListSortingStrategy}
            >

              {habits.map((habit) => (
                <SortableHabitItem key={habit.id} habit={habit} onUpdate={(e) => handleEditClick(e, habit)} onDelete={(e) => handleDeleteClick(e, habit)}/>
              ))}
            </SortableContext>


            ):(
              <p>No Habit Found. Create a new habit to get started!</p>
            )}
         </div>

        </DndContext>

        <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          dispatch(setAllHabitsThunk());
        }}
      />

        <EditConfirmedModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedHabit(null);
            dispatch(setAllHabitsThunk());
          }}
          habitData={selectedHabit}
        />


        <DeleteConfirmedModal 
          show={showDeleteModal}
          onConfirm={async () => {
            try {
              if(selectedHabit?.id){
                await dispatch(deleteAHabitThunk(selectedHabit.id));
                await dispatch(setAllHabitsThunk());
              }
            } finally {
              setShowDeleteModal(false);
               setSelectedHabit(null); 
            }
          }}
          onCancel={() => {
            setShowDeleteModal(false);
            // setHabits(null);
            // navigate('/habits')
          }}
        />
    </div>
  );

};
