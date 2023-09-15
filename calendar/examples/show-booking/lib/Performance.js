import EventModel from '../../../lib/Scheduler/model/EventModel.js';

export default class Performance extends EventModel {
    static fields = [{
        name : 'cost',
        type : 'number'
    }];
}
