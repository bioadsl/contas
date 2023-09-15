/**
 * The React App file
 */

// React libraries
import React, { Fragment } from 'react';

// Stylings
import './App.scss';

// Application components
import { BryntumDemoHeader } from '@bryntum/calendar-react';
import Calendar from './components/Calendar';

const App = () => {
    return (
        <Fragment>
            {/* BryntumDemoHeader component is used for Bryntum example styling only and can be removed */}
            <BryntumDemoHeader />
            <Calendar />
        </Fragment>
    );
};

export default App;
