import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllTimeblocksThunk, editTimeblockThunk, setOneTimeblockThunk } from '../../redux/timeblocks';

export const EditTimeBlock = () => {
  const { timeblockId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const timeblock = useSelector(state => state.timeblocks.singleTimeblock);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Helper function to format SQL datetime to datetime-local input format
  const formatDateTimeForInput = (sqlDateTime) => {
    if (!sqlDateTime) return "";
    // Convert SQL datetime string to ISO format and slice to remove seconds/milliseconds
    return new Date(sqlDateTime).toISOString().slice(0, 16);
  };

  useEffect(() => {
    dispatch(setOneTimeblockThunk(timeblockId));
  }, [dispatch, timeblockId]);

  useEffect(() => {
    if (timeblock) {
      setName(timeblock.name || "");
      setDescription(timeblock.description || "");
      // Format the datetime values properly for the input
      setStartTime(formatDateTimeForInput(timeblock.start_time) || "");
      setEndTime(formatDateTimeForInput(timeblock.end_time) || "");
      setErrors({});
      setHasSubmitted(false);
    }
  }, [timeblock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = {};

    if (!name.trim()) validationErrors.name = "Name is required";
    if (!description.trim()) validationErrors.description = "Description is required";
    if (!startTime.trim()) validationErrors.startTime = "Start Time is required";
    if (!endTime.trim()) validationErrors.endTime = "End Time is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formatDataTime = (dateTimeStr) => {
      const date = new Date(dateTimeStr);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const editTimeBlockData = {
      id: timeblockId,
      name,
      description,
      start_time: formatDataTime(startTime),
      end_time: formatDataTime(endTime)
    };

    const updateTimeBlock = await dispatch(editTimeblockThunk(editTimeBlockData));

    if (updateTimeBlock && updateTimeBlock.id) {
      navigate('/timeblocks');
      await dispatch(setAllTimeblocksThunk());
    }
  };

  return (
    <div className="modal-overly">
      <div className="modal-content">
        <h2>Update A Time Block</h2>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>
              <h4>Time Block Name</h4>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Time Block Name'
                className={hasSubmitted && errors.name ? 'error' : ''}
              />
              {hasSubmitted && errors.name && (
                <p className='error-message'>{errors.name}</p>
              )}
            </label>

            <label>
              <h4>Description</h4>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Please write the thing you need to do...'
                className={hasSubmitted && errors.description ? 'error' : ''}
              />
              {hasSubmitted && errors.description && (
                <p className='error-message'>{errors.description}</p>
              )}
            </label>

            <label>
              <h4>Start Time:</h4>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={hasSubmitted && errors.startTime ? 'error' : ''}
              />
              {hasSubmitted && errors.startTime && (
                <p className='error-message'>{errors.startTime}</p>
              )}
            </label>

            <label>
              <h4>End Time:</h4>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={hasSubmitted && errors.endTime ? 'error' : ''}
              />
              {hasSubmitted && errors.endTime && (
                <p className='error-message'>{errors.endTime}</p>
              )}
            </label>

            <div className="modal-buttons">
              <button type="submit" className="confirm-create-btn">Update</button>
              <button type="button" onClick={() => navigate('/timeblocks')} className='cancel-create-btn'>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
