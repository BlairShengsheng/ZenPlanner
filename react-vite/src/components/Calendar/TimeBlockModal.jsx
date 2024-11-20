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

  // Format datetime string for input datetime-local
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  // Format datetime for API
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:mm:ss
  };

  useEffect(() => {
    if (timeblock) {
      setFormData({
        name: timeblock.name || '',
        description: timeblock.description || '',
        start_time: formatDateForInput(timeblock.start_time) || '',
        end_time: formatDateForInput(timeblock.end_time) || ''
      });
    } else if (initialTimeSlot) {
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
    
    // Format dates for API submission
    const submissionData = {
      name: formData.name,
      description: formData.description,
      start_time: formatDateForAPI(formData.start_time),
      end_time: formatDateForAPI(formData.end_time)
    };

    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{timeblock ? 'UPDATE' : 'CREATE'} A TIME BLOCK</h2>
        
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
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
