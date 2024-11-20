import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  setAllTimeblocksThunk,
  createTimeblockThunk,
  editTimeblockThunk,
  deleteTimeblockThunk
} from '../../redux/timeblocks';
import { TimeBlockModal } from './TimeBlockModal';
import './DailyScheduler.css';

export const DailyScheduler = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const timeblocks = useSelector(state => state.timeblocks.allTimeblocks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeblock, setSelectedTimeblock] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!sessionUser) {
      navigate('/login');
    }
  }, [sessionUser, navigate]);

  useEffect(() => {
    if (sessionUser) {
      dispatch(setAllTimeblocksThunk());
    }
  }, [dispatch, sessionUser]);

  const handleDateSelect = (selectInfo) => {
    if (!sessionUser) {
      setError('Please log in to create timeblocks');
      return;
    }

    setSelectedTimeSlot({
      start_time: selectInfo.startStr,
      end_time: selectInfo.endStr
    });
    setIsModalOpen(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo) => {
    if (!sessionUser) {
      setError('Please log in to edit timeblocks');
      return;
    }

    const timeblock = {
      id: clickInfo.event.id,
      name: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start_time: clickInfo.event.start.toISOString().replace('T', ' ').substring(0, 19),
      end_time: clickInfo.event.end.toISOString().replace('T', ' ').substring(0, 19)
    };
    setSelectedTimeblock(timeblock);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (!sessionUser) {
        setError('Please log in to modify timeblocks');
        return;
      }

      if (selectedTimeblock) {
        // Update existing timeblock
        const result = await dispatch(editTimeblockThunk({
          id: selectedTimeblock.id,
          user_id: sessionUser.id,
          ...formData
        }));
        if (result?.error) {
          setError(result.error);
          return;
        }
      } else {
        // Create new timeblock
        const newTimeblock = {
          ...formData,
          user_id: sessionUser.id,
          start_time: selectedTimeSlot?.start_time || formData.start_time,
          end_time: selectedTimeSlot?.end_time || formData.end_time
        };
        console.log('Creating timeblock with data:', newTimeblock);
        const result = await dispatch(createTimeblockThunk(newTimeblock));
        if (result?.error) {
          setError(result.error);
          return;
        }
      }
      handleModalClose();
    } catch (err) {
      setError('Failed to save timeblock');
      console.error('Error saving timeblock:', err);
    }
  };

  const handleEventDrop = async (dropInfo) => {
    try {
      if (!sessionUser) {
        dropInfo.revert();
        setError('Please log in to modify timeblocks');
        return;
      }

      const updatedTimeblock = {
        id: dropInfo.event.id,
        user_id: sessionUser.id,
        name: dropInfo.event.title,
        description: dropInfo.event.extendedProps.description,
        start_time: dropInfo.event.start.toISOString().replace('T', ' ').substring(0, 19),
        end_time: dropInfo.event.end.toISOString().replace('T', ' ').substring(0, 19)
      };
      
      const result = await dispatch(editTimeblockThunk(updatedTimeblock));
      if (result?.error) {
        setError(result.error);
        dropInfo.revert();
      }
    } catch (err) {
      setError('Failed to update timeblock');
      dropInfo.revert();
    }
  };

  const handleEventResize = async (resizeInfo) => {
    try {
      if (!sessionUser) {
        resizeInfo.revert();
        setError('Please log in to modify timeblocks');
        return;
      }

      const updatedTimeblock = {
        id: resizeInfo.event.id,
        user_id: sessionUser.id,
        name: resizeInfo.event.title,
        description: resizeInfo.event.extendedProps.description,
        start_time: resizeInfo.event.start.toISOString().replace('T', ' ').substring(0, 19),
        end_time: resizeInfo.event.end.toISOString().replace('T', ' ').substring(0, 19)
      };
      
      const result = await dispatch(editTimeblockThunk(updatedTimeblock));
      if (result?.error) {
        setError(result.error);
        resizeInfo.revert();
      }
    } catch (err) {
      setError('Failed to resize timeblock');
      resizeInfo.revert();
    }
  };

  const handleDelete = async (timeblockId) => {
    try {
      if (!sessionUser) {
        setError('Please log in to delete timeblocks');
        return;
      }

      const result = await dispatch(deleteTimeblockThunk(timeblockId));
      if (result?.error) {
        setError(result.error);
        return;
      }
      handleModalClose();
    } catch (err) {
      setError('Failed to delete timeblock');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTimeblock(null);
    setSelectedTimeSlot(null);
    setError(null);
  };

  if (!sessionUser) {
    return <div className="auth-message">Please log in to view your schedule</div>;
  }

  return (
    <div className="daily-scheduler">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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
        events={Object.values(timeblocks)
          .filter(timeblock => timeblock.user_id === sessionUser.id)
          .map(timeblock => ({
            id: timeblock.id,
            title: timeblock.name,
            description: timeblock.description,
            start: timeblock.start_time,
            end: timeblock.end_time,
            extendedProps: { ...timeblock }
          }))}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
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

      <TimeBlockModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onDelete={handleDelete}
        timeblock={selectedTimeblock}
        initialTimeSlot={selectedTimeSlot}
        error={error}
      />
    </div>
  );
};
