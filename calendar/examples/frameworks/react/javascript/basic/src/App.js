/**
 * Application
 */
import React, { useRef } from 'react';

import { BryntumCalendar, BryntumDemoHeader } from '@bryntum/calendar-react';

import { calendarConfig } from './AppConfig';

import './App.scss';

function App() {
    const calendar = useRef();

    return (
        <>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader />
            <BryntumCalendar
                ref={calendar}
                {...calendarConfig}
            />
        </>
    );
}

export default App;
