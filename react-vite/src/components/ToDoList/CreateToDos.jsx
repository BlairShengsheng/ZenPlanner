
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector} from 'react-redux';
// import { createATaskThunk, setAllTasksThunk } from '../../redux/tasks';

// import { useNavigate } from 'react-router-dom';


// //! --------------------------------------------------------------------
// //*                          CreateTask Component
// //! --------------------------------------------------------------------


// // CreateTasks.jsx
// export const CreateTask = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const sessionUser = useSelector(state => state.session.user);  // Add this

//   useEffect(() => {
//     // Redirect if not logged in
//     if (!sessionUser) {
//       navigate('/login');
//     }
//   }, [sessionUser, navigate]);


//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState("low");

//   // Validation state
//   const [errors, setErrors] = useState({});
//   const [hasSubmitted, setHasSubmitted] = useState(false);

//   //! --------------------------------------------------------------------
//   //                          Handle Form Submit
//   //! --------------------------------------------------------------------

//   useEffect(() => {

//     dispatch(setAllTasksThunk());

//     return () => {
//       //Reset the form
//       setName("");
//       setDescription("")
//       setPriority("low")
//       setHasSubmitted(false)
//     }
//   },[dispatch]);

//   const handleChange = async (e) => {
//     e.preventDefault();
//     setPriority(e.target.value)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setHasSubmitted(true);

//     const validationErrors = {};

//     //validate all fields
//     if(!name.trim()) validationErrors.name = "name is required";
//     if(!description.trim()) validationErrors.description = "description is required";

//     setErrors(validationErrors); //Update errors state

//     if(Object.keys(validationErrors).length > 0){
//       return;
//     }

//     const taskData = { 
//       name, 
//       description, 
//       priority,
//      }
//     console.log('Submitting task data:', taskData); // Add this log

//     const newTask = await dispatch(createATaskThunk(taskData));
//     console.log('Response from createATaskThunk:', newTask); // Add this log

//     if(newTask && newTask.id) {
//       await dispatch(setAllTasksThunk());
//       // navigate(`/tasks/${newTask.id}`)
//       navigate('/tasks/')
      
//     }else{
//       console.error('Failed to create task:', newTask); // Add this log
//     }
//   };


//   //! --------------------------------------------------------------------
//   //                         Return JSX HTML Part
//   //! --------------------------------------------------------------------



//   return (


//       <div className="create-task-container">



//         <div className="right-panel">
//           <h2>CREATE A To Do Task</h2>

//            <div className="form-container">

//             <form onSubmit={handleSubmit}>



//               <label><h4>Task Name </h4>
//                 <input 
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Task Name"
//                   //The input gets a red border to show it needs attention
//                   className={hasSubmitted && errors.name ? 'error':''}
//                 />
//                 {/* red error message  */}
//                 {hasSubmitted && errors.name && <p className="error-message">{errors.name}</p>}
//               </label>

//               <label><h4>Description</h4>
//                 <textarea
//                   id="description-area"
//                   placeholder='Please write about your task details......'
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className={hasSubmitted && errors.name ? 'error':''}
//                 ></textarea>

//                 {/* red error message  */}
//                 {hasSubmitted && errors.description && <p className="error-message">{errors.description}</p>}
//               </label>

//               <div className="priority-container">
//                 <label><h4>Priority</h4></label>
//                 <div className="priority-options">

//                   <label className="priority-label">
//                     <input
//                       type="radio"
//                       name="priority"
//                       value="low"
//                       checked={priority === 'low'}
//                       onChange={handleChange}
//                     />
//                     <span className="priority-btn low">Low</span>
//                   </label>

//                   <label className="priority-label">
//                     <input
//                       type="radio"
//                       name="priority"
//                       value="medium"
//                       checked={priority === 'medium'}
//                       onChange={handleChange}
//                     />
//                     <span className="priority-btn medium">Medium</span>
//                   </label>

//                   <label className="priority-label">
//                     <input
//                       type="radio"
//                       name="priority"
//                       value="high"
//                       checked={priority === 'high'}
//                       onChange={handleChange}
//                     />
//                     <span className="priority-btn high">High</span>
//                   </label>
//                 </div>

//                 <div className="form-action">
//                   <button type="submit" className="create_button">Create Task</button>
//                   <button type="button" onClick={() => navigate('/tasks')} className="cancel_button">Cancel</button>
//                 </div>


//               </div>

//             </form>
//           </div>

//         </div>
//       </div>
   
    
//   );
// };


// CreateTaskModal.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createATaskThunk, setAllTasksThunk } from '../../redux/tasks';

export const CreateTaskModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setPriority(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = {};
    if(!name.trim()) validationErrors.name = "name is required";
    if(!description.trim()) validationErrors.description = "description is required";
    if (name.length > 100) validationErrors.name = "Task name cannot exceed 100 characters";
    if (description.length > 200) validationErrors.description = "Description cannot exceed 200 characters";

    setErrors(validationErrors);

    if(Object.keys(validationErrors).length > 0) {
      return;
    }

    const taskData = { name, description, priority };

    try {
      const newTask = await dispatch(createATaskThunk(taskData));
      if(newTask && newTask.id) {
        await dispatch(setAllTasksThunk());
        // Reset form
        setName("");
        setDescription("");
        setPriority("low");
        setHasSubmitted(false);
        onClose();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <h2>Create a To Do Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task Name"
              className={hasSubmitted && errors.name ? 'form-input error' : 'form-input'}
            />
            {hasSubmitted && errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write about your task details......"
              className={hasSubmitted && errors.description ? 'form-input error' : 'form-input'}
              rows={4}
            />
            {hasSubmitted && errors.description && <p className="error-message">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label>Priority</label>
            <div className="priority-options">
              <label className="priority-label">
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={priority === 'low'}
                  onChange={handleChange}
                />
                <span className="priority-btn low">Low</span>
              </label>

              <label className="priority-label">
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={priority === 'medium'}
                  onChange={handleChange}
                />
                <span className="priority-btn medium">Medium</span>
              </label>

              <label className="priority-label">
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={priority === 'high'}
                  onChange={handleChange}
                />
                <span className="priority-btn high">High</span>
              </label>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">Create Task</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
