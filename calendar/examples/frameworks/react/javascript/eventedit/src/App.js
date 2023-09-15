/**
 * Application
 */
import React from 'react';
import { BryntumCalendar, BryntumDemoHeader } from '@bryntum/calendar-react';
import { calendarConfig } from './AppConfig';
import './App.scss';

function App() {

    return (
        <>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader themeCombo={false} />
            <BryntumCalendar
                {...calendarConfig}
            />
        </>
    );
}

export default App;
