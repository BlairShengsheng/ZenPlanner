import { useState, useEffect } from 'react';
import './TimeBlockModal.css';

export const TimeBlockModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  timeblock,
  initialTimeSlot,
  error 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: ''
  });

  // Format datetime for input datetime-local
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    // If date is a string, convert it to Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';

    // Format to local datetime string and slice off seconds
    return dateObj.toISOString().slice(0, 16);
  };

  // Format datetime for API
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    // Get local ISO string parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format as YYYY-MM-DD HH:mm:ss
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (timeblock) {
      // Editing existing timeblock
      setFormData({
        name: timeblock.name || '',
        description: timeblock.description || '',
        start_time: formatDateForInput(timeblock.start_time) || '',
        end_time: formatDateForInput(timeblock.end_time) || ''
      });
    } else if (initialTimeSlot) {
      // Creating new timeblock with initial time slot
      setFormData(prev => ({
        ...prev,
        start_time: formatDateForInput(initialTimeSlot.start_time),
        end_time: formatDateForInput(initialTimeSlot.end_time)
      }));
    }
  }, [timeblock, initialTimeSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate times
    const startDate = new Date(formData.start_time);
    const endDate = new Date(formData.end_time);
    
    if (endDate <= startDate) {
      alert('End time must be after start time');
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...(timeblock?.id && { id: timeblock.id }),
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_time: formatDateForAPI(formData.start_time),
      end_time: formatDateForAPI(formData.end_time)
    };

    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <h2>{timeblock ? 'Update' : 'Create'} Time Block</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="start_time">Start Time:</label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_time">End Time:</label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              {timeblock ? 'Update' : 'Create'}
            </button>
            {timeblock && (
              <button 
                type="button" 
                className="delete-btn"
                onClick={() => onDelete?.(timeblock.id)}
              >
                Delete
              </button>
            )}
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
