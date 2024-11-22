//ViewAllTimeBlocks.jsx
import{ useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setAllTimeblocksThunk, deleteTimeblockThunk } from "../../redux/timeblocks";
import './ViewTimeBlock.css';


export const ViewAllTimeBlocks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessionUser = useSelector(state => state.session.user);
  const timeblockObj = useSelector(state => state.timeblocks.allTimeblocks);

  //filter those timeblocks only belong to the logged in user
  const timeBlocks = Object.values(timeblockObj || {}).filter(timeblock => timeblock && timeblock.user_id === sessionUser?.id);
  

  const [isLoading, setIsLoading] = useState(true);

  //Load initial timeblocks
  useEffect(() => {
    const loadTimeBlocks = async () => {
      setIsLoading(true);

      try {
        if(sessionUser) {
          await dispatch(setAllTimeblocksThunk());
        }
      } catch (error) {
        console.error('Error loading time block list:', error);

      } finally {
        setIsLoading(false);
      }
    };
    loadTimeBlocks();
  },[dispatch, sessionUser]);

  if(isLoading) return <div>Loading...</div>
  if(!sessionUser) return <div>Please log in to view your time block lists</div>


  const handleUpdate = async (e, timeBlockId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/timeblocks/${timeBlockId}/edit`)
  }

  const handleDelete = async (e, timeBlockId) => {
    e.preventDefault();// Prevent the Link navigation
    e.stopPropagation();// Stop the event from bubbling up
    await dispatch(deleteTimeblockThunk(timeBlockId));
    await dispatch(setAllTimeblocksThunk());
  }


  return (
    <div className="timeblock-page">
      <h1>Time Block List</h1>

      <div className="timeblocks-grid">
        {timeBlocks && timeBlocks.length > 0 ? (
          timeBlocks.map((timeblock, i) => (
            <div key={i} className="timeblock-card-wrapper">
              <h3>{timeblock.name}</h3>
              <p>{timeblock.description}</p>

              <div className="start-time-section">
                <h4>Start Time:</h4>
                {timeblock.start_time}
              </div>

              <div className="end-time-section">
                <h4>End Time:</h4>
                {timeblock.end_time}
              </div>

              <div className="action-buttons">
                <button className="update-btn" onClick={(e) => handleUpdate(e,timeblock.id)} >Update</button>
                <button className="delete-btn" onClick={(e) => handleDelete(e, handleDelete(e,timeblock.id))}>Delete</button>

              </div>
            </div>
          ))

        ):(
          <p>No time blocks found. Create a new time block to get started!</p>
        )}
      </div>
    </div>
  );
};
