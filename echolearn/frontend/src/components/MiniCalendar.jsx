import React, { useState } from 'react';
import moment from 'moment';
import '../pages/css/MiniCalendar.css'; // We will create this CSS next

const MiniCalendar = () => {
    const [currentDate, setCurrentDate] = useState(moment());

    const startDay = currentDate.clone().startOf('month').startOf('week');
    const endDay = currentDate.clone().endOf('month').endOf('week');
    const day = startDay.clone().subtract(1, 'day');
    const calendar = [];

    while (day.isBefore(endDay, 'day')) {
        calendar.push(
            Array(7).fill(0).map(() => day.add(1, 'day').clone())
        );
    }

    const prevMonth = () => setCurrentDate(currentDate.clone().subtract(1, 'month'));
    const nextMonth = () => setCurrentDate(currentDate.clone().add(1, 'month'));

    return (
        <div className="mini-calendar-wrapper">
            {/* Header */}
            <div className="mini-header">
                <span className="mini-label">{currentDate.format('MMMM YYYY')}</span>
                <div className="mini-nav">
                    <button onClick={prevMonth}>&lt;</button>
                    <button onClick={nextMonth}>&gt;</button>
                </div>
            </div>

            {/* Days of Week */}
            <div className="mini-weekdays">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="week-char">{d}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="mini-grid">
                {calendar.map((week, i) => (
                    <div key={i} className="mini-row">
                        {week.map((d) => (
                            <div 
                                key={d.format('DDMMYYYY')} 
                                className={`mini-day ${d.isSame(currentDate, 'month') ? '' : 'faded'} ${d.isSame(moment(), 'day') ? 'today' : ''}`}
                            >
                                {d.format('D')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiniCalendar;