import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import '../css/Calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// for react-big-calendar
const localizer = momentLocalizer(moment);

const EventWrapper = ({ event, children }) => {
    const style = {
        backgroundColor: event.completed ? '#4CAF50' : '#8b2e2e', // green for completed, red for pending
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '5px'
    };

    return React.cloneElement(children, {
        style: {
            ...children.props.style,
            ...style,
        },
    });
};

// accept props passed by the router
function Calendar({ user, onLogout }) { 
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.id) {
            setEvents([]);
            return;
        }

        axios.get(`/api/calendar/events?userId=${user.id}`)
            .then(response => {
        
                const formattedEvents = response.data.map(event => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.start), // ISO string to date
                    end: new Date(event.end),  
                    completed: event.completed,
                    resourceType: event.resourceType
                }));
                setEvents(formattedEvents);
            })
            .catch(err => {
                console.error("Error fetching calendar events:", err);
                setError("Failed to load events. Check if the Java API server is running (port 8080).");
            });
    }, [user, user.id]); 

    const { components } = useMemo(() => ({
        components: {
            eventWrapper: EventWrapper,
        },
    }), []);

    if (error) {
        return <div style={{ padding: 20 }}>Error: {error}</div>;
    }

    return (
        <Layout user={user} onLogout={onLogout} activePage="calendar">
            <div className="calendar-container">
                <h1 className="page-title">Academic Calendar</h1> 
                <div style={{ height: '700px' }}>
                    <BigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ margin: '50px' }}
                        components={components}
                        defaultView='month'
                    />
                </div>
            </div>
        </Layout>
    );
}

export default Calendar;