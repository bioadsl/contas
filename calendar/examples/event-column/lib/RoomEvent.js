import EventModel from '../../../lib/Scheduler/model/EventModel.js';

// A custom Event class with an extra field.
// You can extend this to add any fields and methods you want.
export default class RoomEvent extends EventModel {

    // Add extra room field
    static fields = [
        { name : 'room', defaultValue : 'New room' }
    ];
}
