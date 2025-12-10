import React, { useContext } from 'react'; // ⭐️ Import useContext
import { CalendarContext } from '../context/CalendarContext'; // ⭐️ Import Context
import '../pages/css/Calendar.css'; 

const CalendarToolbar = (toolbar) => {
    // ⭐️ Consume the context
    const { searchText, setSearchText } = useContext(CalendarContext);

    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToCurrent = () => toolbar.onNavigate('TODAY');
    const goToView = (view) => toolbar.onView(view);

    return (
        <div className="custom-toolbar">
            <div className="toolbar-top-row" style={{ justifyContent: 'space-between', width: '100%' }}>
                <div className="search-bar" style={{ width: '300px' }}>
                    <span className="search-icon"></span>
                    {/* ⭐️ Connect Input to State */}
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <div className="view-switcher">
                    <button className={toolbar.view === 'month' ? 'active' : ''} onClick={() => goToView('month')}>Month</button>
                    <button className={toolbar.view === 'week' ? 'active' : ''} onClick={() => goToView('week')}>Week</button>
                    <button className={toolbar.view === 'day' ? 'active' : ''} onClick={() => goToView('day')}>Day</button>
                </div>
            </div>
            
            <div className="toolbar-nav-row" style={{ marginTop: '15px' }}>
                <div className="nav-group">
                    <button onClick={goToCurrent}>Today</button>
                    <button onClick={goToBack}>Back</button>
                    <button onClick={goToNext}>Next</button>
                </div>
                <span className="rbc-toolbar-label" style={{ fontSize: '20px' }}>
                    {toolbar.view === 'day' ? toolbar.label.replace(/([a-zA-Z]+)\s([a-zA-Z]+)/, '$1, $2') : toolbar.label}
                </span>
            </div>
        </div>
    );
};

export default CalendarToolbar;