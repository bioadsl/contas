import Calendar from '../../../lib/Calendar/view/Calendar.js';
import DateHelper from '../../../lib/Core/helper/DateHelper.js';
import StringHelper from '../../../lib/Core/helper/StringHelper.js';

// Render icons representing the equipment assigned to the task
const eventRenderer = ({ eventRecord }) => {
    return `<div class="b-event-name">${StringHelper.encodeHtml(eventRecord.name || '')}</div>
            <ul class="b-event-equipment-wrap">
                ${eventRecord.equipment.map(item => `<li data-btip="${StringHelper.encodeHtml(item.name)}" 
                class="${item.iconCls}"></li>`).join('')}
            </ul>
    `;
};

export default class MyCalendar extends Calendar {
    // Original class name getter. See Widget.$name docs for the details.
    static $name = 'MyCalendar';
    // Factoryable type name
    static type = 'mycalendar';

    static configurable = {
        modes : {
            agenda : null,
            day    : {
                eventRenderer
            },
            week : {
                eventRenderer
            }
        },
        features : {
            eventEdit : {
                // Add an extra combo box to the editor to select equipment
                items : {
                    equipment : {
                        type         : 'combo',
                        weight       : 900, // At end
                        editable     : false,
                        multiSelect  : true,
                        valueField   : 'id',
                        displayField : 'name',
                        ref          : 'equipment',
                        name         : 'equipment',
                        label        : 'Equipment',
                        // Will be populated with items on first show
                        items        : []
                    }
                }
            }
        }
    };

    construct(config) {
        super.construct(config);

        const equipmentCombo = this.features.eventEdit.editor.widgetMap.equipment;
        equipmentCombo.items = this.equipmentStore.chain();
    }
};

// Register this widget type with its Factory
Calendar.initClass();
