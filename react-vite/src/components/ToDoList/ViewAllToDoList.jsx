// import { useState,useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom"
// import { setAllTasksThunk, deleteATaskThunk, editATaskThunk} from "../../redux/tasks";
// import  DeleteConfirmationModal  from "./DeleteToDos";
// import editConfirmationModal from "./EditToDos";


// //! --------------------------------------------------------------------
// //*                       ViewAllToDoList Component
// //! --------------------------------------------------------------------

// export const ViewAllToDoList = () => {
//   const dispatch = useDispatch();
//   // const navigate = useNavigate();

//   const sessionUser = useSelector(state => state.session.user);
//   const todoObj = useSelector(state => state.tasks.allTasks);

//     // Convert ToDos object to array and filter for current user
//   const ToDos = Object.values(todoObj || {}).filter(todo => todo && todo.user_id === sessionUser?.id)

//   //for the edit(update), delete part state
//   const [showModal, setShowModal] = useState(false);
//   const [showUpdateModal, setUpdateModal] = useState(false)
//   const [todoToDelete, setToDoDelete] = useState(null);
//   const [todoToUpdate, setToDoUpdate] = useState(null);

//   //validation state
//   const [isLoading, setIsLoading] = useState(true);


//   useEffect(() => {
//     const loadToDoList = async () => {
//       setIsLoading(true);

//       try{
//         if(sessionUser){
//           console.log("Getting ToDos for user:", sessionUser.id);
//           await dispatch(setAllTasksThunk());
//         }
//       } catch (error) {
//         console.error('Error loading To Do List:', error);
//       } finally {
//         setIsLoading(false);
//       }

//     };

//     loadToDoList();


//   }, [dispatch, sessionUser]);

//   if(isLoading) {
//     return <div>Loading...</div>
//   }
//   if(!sessionUser){
//     return <div>Please log in to view your To Do Lists</div>
//   }


//   //-------------update section--------------
//   // const [todoToUpdate, setToDoUpdate] = useState(null);

//   const handleUpdate = (todoData) => {
//     setToDoUpdate(todoData);
//     setUpdateModal(true);
//   }

//   const handleConfirmUpdate = () => {
//     if(todoToUpdate){
//       dispatch(editATaskThunk(todoToUpdate));
//       dispatch(setAllTasksThunk());
//       setUpdateModal(false);
//     }
//   }

//   const handleCancelUpdate = () => {
//     setUpdateModal(false);
//   }
 
//   //-------------update section--------------




//   //-------------delete section--------------
//   const handleDelete = (todoId) => {
//     setToDoDelete(todoId);
//     setShowModal(true);
//   }

//   const handleConfirmDelete = () => {
//     if(todoToDelete){
//       dispatch(deleteATaskThunk(todoToDelete));
//       dispatch(setAllTasksThunk());
//       setShowModal(false);
//     }
//   }

//   const handleCancelDelete = () => {
//     setShowModal(false);
//   }
//   //-------------delete section--------------
  

//   //! --------------------------------------------------------------------
//   //                         Return JSX HTML Part
//   //! --------------------------------------------------------------------

//   return (
//     <div className="ToDos-Page">
//       <h1>To Do List</h1>
//       <div className="ToDos-Column">

//         {ToDos && ToDos.length > 0 ?(
//           ToDos.map((todo, i) => (

//             <div key={i} className="todo-card-wrapper">
//               <h3>{todo.name}</h3>
//               <p>{todo.description}</p>

//               <div className="action-button">
//                 <button 
//                   className="update-btn"
//                   onClick={(e) => handleUpdate(e, todo.id)}

//                 > Update 📝</button>

//                 <button 
//                   className="delete-btn"
//                   onClick={() => handleDelete(todo.id)}
//                 > Delete</button>
              
//               </div>
//             </div>


//           ))

//         ):(
//           <p>No to dos found. Create a new to do list to get started!</p>
//         )}
        

//       </div>
//       <editConfirmationModal
//         show={showUpdateModal}
//         onConfirm={handleConfirmUpdate}
//         onCancel={handleCancelUpdate}
//       />

//       <DeleteConfirmationModal 
//         show={showModal} 
//         onConfirm={handleConfirmDelete} 
//         onCancel={handleCancelDelete} 
//       />

//     </div>
//   );
// };


// ViewAllToDoList.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllTasksThunk, deleteATaskThunk } from "../../redux/tasks";
import DeleteConfirmationModal from "./DeleteToDos";
import EditConfirmationModal from "./EditToDos";

export const ViewAllToDoList = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const todoObj = useSelector(state => state.tasks.allTasks);

  // Convert ToDos object to array and filter for current user
  const ToDos = Object.values(todoObj || {}).filter(todo => todo && todo.user_id === sessionUser?.id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <div>Loading...</div>;
  if (!sessionUser) return <div>Please log in to view your To Do Lists</div>;

  const handleUpdate = (todo) => {
    setSelectedTodo(todo);
    setShowEditModal(true);
  };

  const handleDelete = (todo) => {
    setSelectedTodo(todo);
    setShowDeleteModal(true);
  };

  return (
    <div className="ToDos-Page">
      <h1>To Do List</h1>
      <div className="ToDos-Column">
        {ToDos && ToDos.length > 0 ? (
          ToDos.map((todo, i) => (
            <div key={todo.id || i} className="todo-card-wrapper">
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>
              <div className="action-button">
                <button 
                  className="update-btn"
                  onClick={() => handleUpdate(todo)}
                >
                  Update 📝
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(todo)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No to dos found. Create a new to do list to get started!</p>
        )}
      </div>

      <EditConfirmationModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTodo(null);
        }}
        todoData={selectedTodo}
      />

      <DeleteConfirmationModal 
        show={showDeleteModal}
        onConfirm={async () => {
          if (selectedTodo) {
            await dispatch(deleteATaskThunk(selectedTodo.id));
            await dispatch(setAllTasksThunk());
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
