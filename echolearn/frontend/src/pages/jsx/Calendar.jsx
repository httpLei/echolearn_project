import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';
import CalendarToolbar from '../../components/CalendarToolbar'; 
import MiniCalendar from '../../components/MiniCalendar'; 
import '../css/Calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarContext } from '../../context/CalendarContext'; 

const localizer = momentLocalizer(moment);

const EventWrapper = ({ event, children }) => {
    let bg = '#E2852E'; 
    let textColor = 'white';
    if (event.resourceType === 'CLASS') bg = '#8b2e2e'; 
    if (event.resourceType === 'ASSIGNMENT') {
        bg = '#ABE0F0';
        textColor = '#7b542f';
    }

    return React.cloneElement(children, {
        style: { ...children.props.style, backgroundColor: bg, color: textColor, border: 'none', borderRadius: '4px' },
    });
};

function Calendar({ user, onLogout }) { 
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [searchText, setSearchText] = useState('');
    
    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // ⭐️ NEW: Delete Modal State
    
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [newEvent, setNewEvent] = useState({ 
        title: '', 
        date: '', 
        startTime: '', 
        endTime: '',
        location: '',    
        description: ''  
    });

    const fetchEvents = () => {
        if (!user?.id) return;
        axios.get(`/api/calendar/events?userId=${user.id}`)
            .then(res => {
                setEvents(res.data.map(e => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end)
                })));
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchEvents();
    }, [user]);

    const filteredEvents = useMemo(() => {
        if (!searchText) return events;
        return events.filter(event => {
            const title = event.title || ''; 
            return title.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [events, searchText]);

    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return events
            .filter(e => e.start >= now) 
            .sort((a, b) => a.start - b.start) 
            .slice(0, 4); 
    }, [events]);

    const resetForm = () => {
        setNewEvent({ title: '', date: '', startTime: '', endTime: '', location: '', description: '' });
        setIsEditMode(false);
        setEditId(null);
        setIsCreateModalOpen(false);
    };

    const handleEditClick = () => {
        if (!selectedEvent) return;
        const startDate = moment(selectedEvent.start);
        const endDate = moment(selectedEvent.end);
        
        setNewEvent({
            title: selectedEvent.title,
            date: startDate.format('YYYY-MM-DD'),
            startTime: startDate.format('HH:mm'),
            endTime: endDate.format('HH:mm'),
            location: selectedEvent.location || '',
            description: selectedEvent.description || ''
        });

        setIsEditMode(true);
        setEditId(selectedEvent.id);
        setSelectedEvent(null);
        setIsCreateModalOpen(true);
    };

    // ⭐️ NEW: Open Custom Modal instead of window.confirm
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
        // We keep 'selectedEvent' open in the background or close it, 
        // but keeping it lets us know WHICH event to delete.
    };

    // ⭐️ NEW: Actual Delete Action
    const confirmDelete = async () => {
        if (!selectedEvent) return;
        try {
            await axios.delete(`/api/calendar/delete/${selectedEvent.id}?userId=${user.id}`);
            setIsDeleteModalOpen(false); // Close delete modal
            setSelectedEvent(null);      // Close details modal
            fetchEvents();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete event.");
        }
    };

    const handleCreateOrUpdateEvent = async (e) => {
        e.preventDefault();
        const startDateTime = `${newEvent.date}T${newEvent.startTime || '00:00'}:00`;
        const endDateTime = `${newEvent.date}T${newEvent.endTime || '01:00'}:00`;

        const payload = {
            title: newEvent.title,
            date: startDateTime,
            endTime: endDateTime,
            reminderTime: startDateTime,
            location: newEvent.location,
            description: newEvent.description 
        };

        try {
            if (isEditMode && editId) {
                await axios.put(`/api/calendar/update/${editId}?userId=${user.id}`, payload);
            } else {
                await axios.post(`/api/calendar/create?userId=${user.id}`, payload);
            }
            resetForm();
            fetchEvents(); 
        } catch (error) {
            console.error("Failed to save event", error);
            alert("Failed to save event.");
        }
    };

    const { components } = useMemo(() => ({
        components: {
            toolbar: CalendarToolbar, 
            eventWrapper: EventWrapper,
        },
    }), []);

    return (
        <Layout user={user} onLogout={onLogout} activePage="calendar">
            <CalendarContext.Provider value={{ searchText, setSearchText }}>
                <div className="calendar-full-bleed">
                    <div className="cal-sidebar-panel">
                        <h1 className="cal-sidebar-title">Calendar</h1>
                        <button className="create-event-btn" onClick={() => { resetForm(); setIsCreateModalOpen(true); }}>
                            <span>+</span> New Event
                        </button>
                        <div className="mini-calendar-container">
                             <MiniCalendar />
                        </div>
                        <div className="upcoming-section">
                            <h3>Upcoming</h3>
                            {upcomingEvents.length === 0 ? (
                                <p className="no-upcoming">No upcoming events</p>
                            ) : (
                                upcomingEvents.map(evt => (
                                    <div key={evt.id} className="upcoming-card" onClick={() => setSelectedEvent(evt)}>
                                        <div className="upcoming-strip" style={{
                                            backgroundColor: evt.resourceType === 'CLASS' ? '#8b2e2e' :
                                                             evt.resourceType === 'ASSIGNMENT' ? '#ABE0F0' : '#E2852E'
                                        }}></div>
                                        <div className="upcoming-info">
                                            <span className="upcoming-title">{evt.title}</span>
                                            <span className="upcoming-date">
                                                {moment(evt.start).format('MMM D, h:mm A')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="cal-main-panel">
                        <BigCalendar
                            localizer={localizer}
                            events={filteredEvents} 
                            startAccessor="start"
                            endAccessor="end"
                            components={components}
                            defaultView='month'
                            onSelectEvent={(event) => setSelectedEvent(event)}
                            eventPropGetter={(event) => {
                                let style = {
                                    backgroundColor: '#E2852E',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    padding: '2px 4px'
                                };
                                if (event.resourceType === 'CLASS') {
                                    style.backgroundColor = '#8b2e2e';
                                }
                                if (event.resourceType === 'ASSIGNMENT') {
                                    style.backgroundColor = '#ABE0F0';
                                    style.color = '#7b542f';
                                }
                                return { style };
                            }}
                        />
                    </div>
                </div>
            </CalendarContext.Provider>

            {/* CREATE / EDIT MODAL */}
            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
                            <button className="modal-close-btn" onClick={resetForm}>×</button>
                        </div>
                        <form onSubmit={handleCreateOrUpdateEvent} className="create-class-form">
                            <div className="form-group">
                                <label>Event Title *</label>
                                <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required placeholder="e.g., Team Meeting" />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="e.g., Room 302" />
                            </div>
                            <div className="form-group">
                                <label>Invitees</label>
                                <input type="text" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="e.g., John, Mary..." />
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Start Time *</label>
                                    <input type="time" value={newEvent.startTime} onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>End Time *</label>
                                    <input type="time" value={newEvent.endTime} onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})} required />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn-create">{isEditMode ? 'Save Changes' : 'Create Event'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAILS MODAL */}
            {selectedEvent && !isDeleteModalOpen && (
                <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                    <div className="modal-content event-detail-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="event-detail-title">{selectedEvent.title}</h2>
                            <button className="modal-close-btn" onClick={() => setSelectedEvent(null)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        
                        <div className="event-detail-body">
                            <div className="event-detail-row">
                                <div className="detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                                <div className="detail-text">
                                    <span className="detail-label">Time</span>
                                    <span className="detail-value">{moment(selectedEvent.start).format('dddd, MMMM D')} <br/>{moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}</span>
                                </div>
                            </div>
                            {selectedEvent.location && (
                                <div className="event-detail-row">
                                    <div className="detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                                    <div className="detail-text"><span className="detail-label">Location</span><span className="detail-value">{selectedEvent.location}</span></div>
                                </div>
                            )}
                            {selectedEvent.description && (
                                <div className="event-detail-row">
                                    <div className="detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
                                    <div className="detail-text"><span className="detail-label">{selectedEvent.resourceType === 'ASSIGNMENT' ? 'Description' : 'Invitees'}</span><span className="detail-value">{selectedEvent.description}</span></div>
                                </div>
                            )}
                            <div className="event-detail-row">
                                <div className="detail-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg></div>
                                <div className="detail-text">
                                    <span className="detail-label">Type</span>
                                    <span className="detail-badge" style={{backgroundColor: selectedEvent.resourceType === 'CLASS' ? '#8b2e2e' : selectedEvent.resourceType === 'ASSIGNMENT' ? '#ABE0F0' : '#E2852E', color: selectedEvent.resourceType === 'ASSIGNMENT' ? '#7b542f' : 'white'}}>{selectedEvent.resourceType}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setSelectedEvent(null)}>Close</button>
                            {selectedEvent.resourceType === 'EVENT' && (
                                <>
                                    <button className="btn-delete-event" onClick={handleDeleteClick}>Delete</button>
                                    <button className="btn-create" onClick={handleEditClick}>Edit</button>
                                </>
                            )}
                            {selectedEvent.resourceType === 'ASSIGNMENT' && (
                                <button className="btn-create" onClick={() => navigate(`/assignments/${selectedEvent.id}`)}>View Assignment</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ⭐️ NEW: CUSTOM DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && (
                <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-content delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon-wrapper">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h3>Delete Event?</h3>
                        <p>Are you sure you want to delete <strong>"{selectedEvent?.title}"</strong>? This action cannot be undone.</p>
                        
                        <div className="modal-actions" style={{ justifyContent: 'center' }}>
                            <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Calendar;