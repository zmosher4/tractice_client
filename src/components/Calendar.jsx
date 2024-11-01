import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useShows } from '../state/ShowsContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './calendar.css';
import { useSessions } from '../state/SessionsContext';

export const Calendar = () => {
  const { myShows, getMyShows } = useShows();
  const { mySessions, refreshSessions } = useSessions();
  const navigate = useNavigate();

  useEffect(() => {
    getMyShows();
    refreshSessions();
  }, []);

  const showCalendarData = myShows.map((show) => ({
    date: new Date(show.performance_date).toISOString(),
    title: `Show: ${show.description}`,
    id: `show-${show.id}`,
    type: show,
  }));

  const sessionCalendarData = mySessions.map((session) => ({
    id: `session-${session.id}`,
    date: new Date(session.session_date).toISOString(),
    title: `Practice: ${session.notes}`,
    type: session,
  }));

  const handleEventClick = (e) => {
    const [type, id] = e.event.id.split('-');

    if (type === 'show') {
      navigate(`/show/${id}`);
    } else if (type === 'session') {
      navigate(`/session/${id}`);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={[...showCalendarData, ...sessionCalendarData]}
      eventClick={handleEventClick}
    />
  );
};
