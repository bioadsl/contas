/**
 * Application
 */
import React, { useRef, useState } from 'react';

import { BryntumCalendar, BryntumDemoHeader, BryntumProjectModel } from '@bryntum/calendar-react';

import { calendarConfig } from './AppConfig';
import { projectData } from './AppData';

import './App.scss';

function App() {
    const calendar = useRef();
    const project = useRef();

    const [events] = useState(projectData.events);
    const [resources] = useState(projectData.resources);

    return (
        <>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader />
            <BryntumProjectModel
                ref={project}
                events={events}
                resources={resources}
            />
            <BryntumCalendar
                ref={calendar}
                project={project}
                {...calendarConfig}
            />
        </>
    );
}

export default App;
