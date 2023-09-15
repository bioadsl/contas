import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import '../../../lib/Calendar/localization/Nl.js';

const locale = {

    localeName : 'Nl',
    localeDesc : 'Nederlands',
    localeCode : 'nl',

    App : {
        'Localization demo' : 'Lokalisatiedemo'
    },

    Button : {
        'Add column'          : 'Kolom toevoegen',
        'Remove column'       : 'Kolom verwijderen',
        'Display hints'       : 'Hints weergeven',
        'Show all day events' : 'Vis begivenheder hele dagen',
        'My button'           : data => `Min knap ${data}`,
        Apply                 : 'Еoepassen'
    },

    Checkbox : {
        'Auto apply'  : 'Automatisch toepassen',
        Automatically : 'Automatisch'
    },

    CodeEditor : {
        'Code editor'   : 'Code editor',
        'Download code' : 'Download code'
    },

    Column : {
        Name    : 'Naam',
        Company : 'Bedrijf'
    },

    Combo : {
        Theme    : 'Selecteer thema',
        Language : 'Selecteer landinstelling',
        Size     : 'Selecteer grootte'
    },

    EventType : {
        Meeting : 'Bijeenkomst',
        Phone   : 'Telefoon',
        Lunch   : 'Twaalfuurtje',
        Workout : 'Training'
    },

    EventColor : {
        Meeting : 'green',
        Phone   : 'red',
        Lunch   : 'blue',
        Workout : 'orange'
    },

    Shared : {
        'Full size'      : 'Volledige grootte',
        'Locale changed' : 'Taal is veranderd',
        'Phone size'     : 'Grootte telefoon'
    },

    Tooltip : {
        infoButton       : 'Klik om informatie weer te geven en van thema of land te wisselen',
        codeButton       : 'Klik om de ingebouwde code-editor te tonen',
        hintCheck        : 'Vink deze optie aan om automatisch hints weer te geven bij het laden van het voorbeeld',
        fullscreenButton : 'Volledig scherm'
    }

};

export default LocaleHelper.publishLocale(locale);
