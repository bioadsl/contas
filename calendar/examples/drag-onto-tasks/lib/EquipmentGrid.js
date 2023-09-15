import Grid from '../../../lib/Grid/view/Grid.js';
import '../../../lib/Grid/feature/FilterBar.js';
import StringHelper from '../../../lib/Core/helper/StringHelper.js';

export default class EquipmentGrid extends Grid {

    /**
     * Original class name getter. See Widget.$name docs for the details.
     */
    static $name = 'EquipmentGrid';

    // Factoryable type name
    static type = 'equipmentgrid';

    static configurable = {
        disableGridRowModelWarning : true,
        ui                         : 'toolbar',
        collapsible                : true,
        features                   : {
            filterBar : {
                compactMode : true
            },
            cellEdit : false
        },

        rowHeight : 100,

        columns : [{
            text       : 'Type to filter...',
            field      : 'name',
            htmlEncode : false,
            cellCls    : 'b-equipment',
            renderer   : ({ record }) => StringHelper.xss`<i class="b-equipment-icon ${record.iconCls}"></i>${record.name}`
        }]
    };
};

// Register this widget type with its Factory
EquipmentGrid.initClass();
