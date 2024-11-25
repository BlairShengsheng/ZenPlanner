import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAHabitThunk, setAllHabitsThunk } from "../../redux/habits";

import { useNavigate } from "react-router-dom";
import "./CreateHabit.css";
//! --------------------------------------------------------------------
//*                          CreateHabit Component
//! --------------------------------------------------------------------

//CreateHabits.jsx

export const CreateHabit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser =  useSelector(state => state.session.user)

  useEffect(() => {
    //Redirect if not logged in
    if(!sessionUser) {
      navigate('/login');
    }
  },[sessionUser, navigate]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  //Validation state
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  //! -------------------------Handle Form Submit-------------------------
  useEffect(() => {
    dispatch(setAllHabitsThunk());

    return () => {
      setName("");
      setDescription("");
      setErrors({});
      setHasSubmitted(false);
    }
  },[dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    let validationErrors = {};

    //validate all fields
    if(!name.trim()) validationErrors.name = "name is required";
    if(!description.trim()) validationErrors = "description is required";

    setErrors(validationErrors); 

    if(Object.keys(validationErrors).length > 0){return;}

    const habitData = {
      name, 
      description
    }
    console.log('Submitting habit data:', habitData);// add this line to debug

    const newHabit = await dispatch(createAHabitThunk(habitData));

    console.log('Response from createAHabitThunk:', newHabit);// add this line to debug

    if(newHabit && newHabit.id) {
      await dispatch(setAllHabitsThunk());
      navigate('/habits/');

    } else {
      console.error('Failed to create habit:', newHabit); //add this line for debug
    }
  };

  //! --------------------------------------------------------------------
  //                         Return JSX HTML Part
  //! --------------------------------------------------------------------

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create A Habit</h2>

        <div className="form-container">
          <form onSubmit={handleSubmit}>

            <label>
              <h4>Habit Name</h4>
              <input
                type="text"
                value={name}
                onChange = {(e) => setName(e.target.value)}
                placeholder="Habit Name"
                className={hasSubmitted && errors.name ? 'error':''}
              />
              {hasSubmitted && errors.name && (
                <p className="error-message">{errors.name}</p>
              )}
            </label>

            <label>
              <h4>Description</h4>
              <textarea
                id="description-area"
                placeholder='Please write about your habit detail...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={hasSubmitted && errors.description ? 'error':''}
              />
              {hasSubmitted && errors.name && (
                <p className="error-message">{errors.name}</p>
              )}
            </label>

            <div className="modal-buttons">
              <button type="submit" className="confirm-create-btn">Create</button>
              <button type="button" onClick={() => navigate('/habits')} className='cancel-create-btn'>Cancel</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );


};
