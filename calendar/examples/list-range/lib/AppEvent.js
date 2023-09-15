import EventModel from '../../../lib/Scheduler/model/EventModel.js';
import '../../../lib/Core/widget/TextAreaPickerField.js';
import DateHelper from '../../../lib/Core/helper/DateHelper.js';

// A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.
export default class AppEvent extends EventModel {

    // Add some extra fields to demonstrate the createColumnsFromModel option of ColumnPicker
    static fields = [{
        name : 'notes',

        // Provide defaults for when a column is autocreated for this field
        column : {
            width  : '20em',
            editor : {
                type : 'textareapickerfield'
            }
        }
    }, {
        name : 'important',
        type : 'boolean'
    }];

    // Define field getter to enable grouping by the start date *not including time portion*
    get eventStartDate() {
        return this.get('eventStartDate') || DateHelper.startOf(this.startDate);
    }
}
