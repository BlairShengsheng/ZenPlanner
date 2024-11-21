// EditConfirmationModal.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editATaskThunk, setAllTasksThunk, setOneTaskThunk } from '../../redux/tasks';


const EditConfirmationModal = ({ show, onClose, todoData }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset form when modal opens with new todo data
  useEffect(() => {
    if (show && todoData) {
      setName(todoData.name || "");
      setDescription(todoData.description || "");
      setPriority(todoData.priority || "low");
      setErrors({});
      setHasSubmitted(false);
    }
  }, [show, todoData]);

  // const handleChange = (e) => {
  //   e.preventDefault();
  //   setPriority(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = {};
    if (!name.trim()) validationErrors.name = "Name is required";
    if (!description.trim()) validationErrors.description = "Description is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const updatedTodoData = {
      id: todoData.id, // remember to add this when it update sth
      name,
      description,
      priority
    };

    try {
      const editedTodo = await dispatch(editATaskThunk(updatedTodoData));
      if (editedTodo && editedTodo.id) {
        await dispatch(setAllTasksThunk());
        await dispatch(setOneTaskThunk(editedTodo.id));
        onClose();
      }
    } catch (error) {
      console.error('Failed to edit Todo:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update To Do List</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>
              <h4>Task Name</h4>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Task Name"
                className={hasSubmitted && errors.name ? 'error' : ''}
              />
              {hasSubmitted && errors.name && (
                <p className="error-message">{errors.name}</p>
              )}
            </label>

            <label>
              <h4>Description</h4>
              <textarea
                id="description-area"
                placeholder='Please write about your task details...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={hasSubmitted && errors.description ? 'error' : ''}
              />
              {hasSubmitted && errors.description && (
                <p className="error-message">{errors.description}</p>
              )}
            </label>

            <div className="priority-container">
              <label><h4>Priority</h4></label>
              <div className="priority-options">
                {['low', 'medium', 'high'].map((level) => (
                  <label key={level} className="priority-label">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={priority === level}
                      onChange={(e) => setPriority(e.target.value)}
                    />
                    <span className={`priority-btn ${level}`}>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-buttons">
              <button type="submit" className="confirm-update-btn">
                Update
              </button>
              <button type="button" onClick={onClose} className="cancel-update-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditConfirmationModal;
