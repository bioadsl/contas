/**
 * Application
 */
import React, { Fragment, FunctionComponent, useRef, useEffect } from 'react';
import { BryntumDemoHeader, BryntumCalendar } from '@bryntum/calendar-react';
import { calendarConfig } from './AppConfig';
import './App.scss';

const App: FunctionComponent = () => {
    const calendarRef = useRef<BryntumCalendar>(null);
    const calendarInstance = () => calendarRef.current?.instance;

    useEffect(() => {
        // This shows loading data
        // To load data automatically configure crudManager with `autoLoad : true`
        calendarInstance()?.crudManager.load();
    });

    return (
        <Fragment>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader />
            <BryntumCalendar
                ref = {calendarRef}
                {...calendarConfig}
            />
        </Fragment>
    );
};

export default App;
