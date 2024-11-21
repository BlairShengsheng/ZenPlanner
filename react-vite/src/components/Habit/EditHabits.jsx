// EditConfirmedModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editAHabitThunk, setAllHabitsThunk, setOneHabitThunk } from '../../redux/habits';

const EditConfirmedModal = ({ show, onClose, habitData }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  //reset the form when down with updating
  useEffect(() => {
    if(show && habitData) {
      setName(habitData.name || "");
      setDescription(habitData.description || "");
      setErrors({});
      setHasSubmitted(false);
    }
  }, [show, habitData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    let validationErrors = {};
    if(!name.trim()) validationErrors.name = "Name is required";
    if(!description.trim()) validationErrors.description = "Description is required";

    setErrors(validationErrors);
    if(Object.keys(validationErrors).length > 0) return;

    const updatedHabitData = {
      id: habitData.id,
      name,
      description
    };

    try{
      const editedHabit = await dispatch(editAHabitThunk(updatedHabitData));
      if(editedHabit && editedHabit.id) {
        await dispatch(setAllHabitsThunk());
        await dispatch(setOneHabitThunk(editedHabit.id));
        onClose();
      }
    } catch (error) {
      console.log('Failed to edit Habit:', error);
    }
  };

  if(!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update A Habit</h2>

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
              <button type="submit" className="confirm-update-btn">Update</button>
              <button type="button" onClick={onClose} className='cancel-update-btn'>Cancel</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );

};

export default EditConfirmedModal;
