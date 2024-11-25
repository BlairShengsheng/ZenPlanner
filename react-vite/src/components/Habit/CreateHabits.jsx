// CreateHabits.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAHabitThunk, setAllHabitsThunk } from '../../redux/habits';
import './CreateHabit.css';

// Change from const to default export
export default function CreateHabitModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = {};

    if (!name.trim()) validationErrors.name = "Name is required";
    if (!description.trim()) validationErrors.description = "Description is required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const habitData = {
      name: name.trim(),
      description: description.trim()
    };

    try {
      const newHabit = await dispatch(createAHabitThunk(habitData));
      
      if (newHabit && newHabit.id) {
        await dispatch(setAllHabitsThunk());
        setName("");
        setDescription("");
        setErrors({});
        setHasSubmitted(false);
        onClose();
      }
    } catch (error) {
      console.error('Failed to create habit:', error);
      setErrors({ submit: "Failed to create habit. Please try again." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <h2>Create A Habit</h2>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <p className="error-message">{errors.submit}</p>
            )}

            <div className="form-group">
              <label>
                <h4>Habit Name</h4>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Habit Name"
                  className={hasSubmitted && errors.name ? 'error' : ''}
                />
                {hasSubmitted && errors.name && (
                  <p className="error-message">{errors.name}</p>
                )}
              </label>
            </div>

            <div className="form-group">
              <label>
                <h4>Description</h4>
                <textarea
                  id="description-area"
                  placeholder='Please write about your habit detail...'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={hasSubmitted && errors.description ? 'error' : ''}
                />
                {hasSubmitted && errors.description && (
                  <p className="error-message">{errors.description}</p>
                )}
              </label>
            </div>

            <div className="modal-buttons">
              <button type="submit" className="confirm-create-btn">Create</button>
              <button 
                type="button" 
                onClick={() => {
                  setName("");
                  setDescription("");
                  setErrors({});
                  setHasSubmitted(false);
                  onClose();
                }} 
                className='cancel-create-btn'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
