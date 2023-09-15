import DragHelper from '../../../lib/Core/helper/DragHelper.js';
import Toast from '../../../lib/Core/widget/Toast.js';

export default class Drag extends DragHelper {
    static  configurable = {
        callOnFunctions      : true,
        // Don't drag the actual cell element, clone it
        cloneTarget          : true,
        // We size the cloned element using CSS
        autoSizeClonedTarget : false,

        // Only allow drops on calendar tasks
        dropTargetSelector : '.b-cal-event',
        // Drag only the icon inside the cell
        proxySelector      : 'i',
        // Only allow dragging cell elements inside on the equipment grid
        targetSelector     : '.b-grid-row:not(.b-group-row) .b-grid-cell'
    };

    // Listening to events using the onXXX notation, similar to this.on('dragStart', () => {})
    onDragStart({ event, context }) {
        // save a reference to the equipment so we can access it later
        context.equipment = this.grid.getRecordFromElement(context.grabbed);

        // Prevent tooltips from showing while dragging
        this.calendar.features.eventTooltip.disabled = true;
    }

    // In the onDrop, we instruct the drag helper to transition the drag proxy element to an approximate destination
    // before updating the event record (done in onDropFinalized)
    async onDrop({ context, target }) {
        if (context.valid) {
            const
                equipmentItem = context.equipment,
                eventRecord   = this.calendar.resolveEventRecord(target);

            if (eventRecord.equipment.includes(equipmentItem)) {
                context.valid = false;
                Toast.show(`${equipmentItem.name} is already assigned to ${eventRecord.name}`);
            }
            else {
                const
                    equipmentWrap = target.closest('.b-cal-event').querySelector('.b-event-equipment-wrap'),
                    animTarget    = equipmentWrap && (equipmentWrap.lastElementChild || equipmentWrap);

                if (animTarget) {
                    await this.animateProxyTo(animTarget, {
                        align  : equipmentWrap.lastElementChild ? 'l0-r4' : 'l0-l10',
                        offset : [7, 3]
                    });
                }
                eventRecord.equipment = eventRecord.equipment.concat(equipmentItem);
                Toast.show(`Added ${equipmentItem.name} to ${eventRecord.name}`);
            }
        }

        this.calendar.features.eventTooltip.disabled = false;
    }
};
