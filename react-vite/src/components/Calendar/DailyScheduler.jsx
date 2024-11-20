// DailyScheduler.jsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './DailyScheduler.css';

export const DailyScheduler = ({ selectedDate }) => {
  // const [events, setEvents] = useState([
  //   // Initial example event
  //   {
  //     id: '1',
  //     title: 'Example Event',
  //     start: '2024-11-19T10:00:00',
  //     end: '2024-11-19T12:00:00',
  //   }
  // ]);

  const [events, setEvents] = useState([])

  // Handle event creation from clicking on time slot
  const handleDateSelect = (selectInfo) => {
    const title = prompt('Please enter a title for your event:');
    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setEvents([...events, newEvent]);
    }
    selectInfo.view.calendar.unselect();
  };

  // Handle event editing (drag, resize, or click to edit)
  const handleEventChange = (changeInfo) => {
    const updatedEvents = events.map(event =>
      event.id === changeInfo.event.id
        ? {
            id: event.id,
            title: changeInfo.event.title,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr,
          }
        : event
    );
    setEvents(updatedEvents);
  };

  // Handle event clicking
  const handleEventClick = (clickInfo) => {
    if (window.confirm(`Do you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      setEvents(events.filter(event => event.id !== clickInfo.event.id));
    }
  };

  return (
    <div className="daily-scheduler">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        initialDate={selectedDate}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'timeGridDay'
        }}
        slotMinTime="05:00:00" // Start at 5 AM
        slotMaxTime="22:00:00" // End at 10 PM
        height="auto"
        expandRows={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
        editable={true}
        dragScroll={true}
        dayHeaderFormat={{ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }}
        allDaySlot={false}
        slotDuration="01:00:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  );
};
