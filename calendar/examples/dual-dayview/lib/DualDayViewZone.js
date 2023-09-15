import Base from '../../../lib/Core/Base.js';

export default class DualDayViewZone extends Base {
    static get configurable() {
        return {
            view : null,

            zones : {
                $config : ['nullify'],
                value   : []
            }
        };
    }

    updateView(view) {
        // Create sub zones for any already existent views.
        // If project had static data, they will be generated at config time.
        view.eachView(view => {
            this.onDualDayViewViewCreate({ view });
        });

        // If data is loaded async, they will be created when Resources arrive.
        view.ion({
            viewCreate : 'onDualDayViewViewCreate',
            thisObj    : this
        });
    }

    onDualDayViewViewCreate({ view }) {
        const
            me    = this,
            {
                zones,
                owner
            }     = me,
            modes = owner.client.constructor.Modes,
            type  = owner.getViewZoneType(modes.resolveType(view.type));

        type && zones.push(owner.createZone(type, {
            view,
            ...view.dragZoneConfig
        }));
    }

    changeZones(zones, oldZones) {
        if (oldZones?.length && !zones) {
            for (let i = 0, { length } = oldZones; i < length; i++) {
                oldZones[i].destroy();
            }
        }
        return zones;
    }
}
