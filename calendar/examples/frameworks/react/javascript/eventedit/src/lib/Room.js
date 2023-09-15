import { Model } from '@bryntum/calendar';

export default class Room extends Model {
    static get fields() {
        return [{
            name : 'name'
        }, {
            name : 'capacity',
            type : 'number'
        }];
    }
}
