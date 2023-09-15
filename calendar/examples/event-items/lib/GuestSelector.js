import Combo from '../../../lib/Core/widget/Combo.js';

export default class GuestSelector extends Combo {
    static $name = 'GuestSelector';
    static type  = 'guestSelector';

    static configurable = {
        label        : 'Guests',
        displayField : 'name',
        multiSelect  : true,
        editable     : false
    };

    construct() {
        super.construct(...arguments);
        this.store = this.crudManager.getStore('guests');
    }
}

// Register this type with its factory
GuestSelector.initClass();
