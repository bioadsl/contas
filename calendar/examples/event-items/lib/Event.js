import EventModel from '../../../lib/Scheduler/model/EventModel.js';

// A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.
export default class Event extends EventModel {

    static $name = 'Event';

    static fields = [{
        name     : 'guests',
        internal : true
    }];

    static defaults = {
        guests : []
    };
}
