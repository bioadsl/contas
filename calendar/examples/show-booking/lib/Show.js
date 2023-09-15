import ResourceModel from '../../../lib/Scheduler/model/ResourceModel.js';

export default class Show extends ResourceModel {
    static fields = [{
        name : 'minCost',
        type : 'number'
    }];
}
