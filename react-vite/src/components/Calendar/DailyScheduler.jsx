import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  setAllTimeblocksThunk, 
  createTimeblockThunk, 
  editTimeblockThunk, 
  deleteTimeblockThunk 
} from '../../redux/timeblocks';
import { TimeBlockModal } from './TimeBlockModal'; // Import the separate modal component
import './DailyScheduler.css';

export const DailyScheduler = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const timeblockObj = useSelector(state => state.timeblocks.allTimeblocks);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [error, setError] = useState('');
  
  // Convert timeblocks to FullCalendar events format
  const convertTimeblocksToEvents = (timeblocks) => {
    return Object.values(timeblocks || {})
      .filter(timeblock => timeblock && timeblock.user_id === sessionUser?.id)
      .map(timeblock => {
        // Add timezone offset to correct the display
        const start = new Date(timeblock.start_time.replace(' ', 'T'));
        const end = new Date(timeblock.end_time.replace(' ', 'T'));

        return {
          id: timeblock.id.toString(),
          title: timeblock.name,
          description: timeblock.description,
          start,
          end
        };
      });
  };

  // Load timeblocks on component mount
  useEffect(() => {
    const loadTimeBlocks = async () => {
      if (sessionUser) {
        await dispatch(setAllTimeblocksThunk());
      }
    };
    loadTimeBlocks();
  }, [dispatch, sessionUser]);

  // Handle event creation from clicking on time slot
  const handleDateSelect = (selectInfo) => {
    if (!sessionUser) {
      alert("Please log in to create time blocks");
      return;
    }

    // Create modal data with the selected time slot
    setModalData({
      start_time: selectInfo.start,
      end_time: selectInfo.end
    });
    setShowModal(true);
    selectInfo.view.calendar.unselect();
  };

  // Handle event editing (drag, resize)
  const handleEventChange = async (changeInfo) => {
    const timeBlockData = {
      id: parseInt(changeInfo.event.id),
      name: changeInfo.event.title,
      description: changeInfo.event.extendedProps.description,
      start_time: changeInfo.event.start,
      end_time: changeInfo.event.end
    };

    try {
      await dispatch(editTimeblockThunk(timeBlockData));
      await dispatch(setAllTimeblocksThunk());
    } catch (err) {
      setError('Failed to update time block');
    }
  };

  // Handle event clicking for update/delete
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    
    const action = window.confirm(
      `Do you want to edit "${event.title}"?\n` +
      "Click OK to edit, Cancel to delete"
    );

    if (action) {
      // Update
      setModalData({
        id: parseInt(event.id),
        name: event.title,
        description: event.extendedProps.description,
        start_time: event.start,
        end_time: event.end
      });
      setShowModal(true);
    } else {
      // Delete
      if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
        handleDelete(parseInt(event.id));
      }
    }
  };

  // Handle delete
  const handleDelete = async (timeblockId) => {
    try {
      await dispatch(deleteTimeblockThunk(timeblockId));
      await dispatch(setAllTimeblocksThunk());
    } catch (err) {
      setError('Failed to delete time block');
    }
  };

  // Handle modal submit
  const handleModalSubmit = async (data) => {
    try {
      if (data.id) {
        // Update
        await dispatch(editTimeblockThunk(data));
      } else {
        // Create
        await dispatch(createTimeblockThunk(data));
      }
      await dispatch(setAllTimeblocksThunk());
      setShowModal(false);
      setError('');
    } catch (err) {
      setError('Failed to save time block');
    }
  };

  return (
    <div className="daily-scheduler">
      {!sessionUser ? (
        <div className="login-warning">Please log in to manage your time blocks</div>
      ) : (
        <>
          {error && <div className="error-banner">{error}</div>}
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            initialDate={selectedDate}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'timeGridDay'
            }}
            slotMinTime="05:00:00"
            slotMaxTime="22:00:00"
            height="auto"
            expandRows={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={convertTimeblocksToEvents(timeblockObj)}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            editable={true}
            dragScroll={true}
            dayHeaderFormat={{ 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            }}
            allDaySlot={false}
            slotDuration="01:00:00"
            slotLabelInterval="01:00:00"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
          {showModal && (
            <TimeBlockModal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                setError('');
              }}
              onSubmit={handleModalSubmit}
              onDelete={handleDelete}
              timeblock={modalData.id ? modalData : null}
              initialTimeSlot={!modalData.id ? modalData : null}
              error={error}
            />
          )}
        </>
      )}
    </div>
  );
};
