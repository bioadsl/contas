import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import '../../../lib/Calendar/localization/De.js';

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',

    App : {
        'Localization demo' : 'Lokalisierungsdemo'
    },

    Button : {
        'Add column'          : 'Spalte hinzufügen',
        'Display hints'       : 'Tipps anzeigen',
        'Remove column'       : 'Spalte entfernen',
        'Show all day events' : 'Zeige alle tagesereignisse',
        'My button'           : data => `Mein knopf ${data}`,
        Apply                 : 'Anwenden'
    },

    Checkbox : {
        'Auto apply'  : 'Automatisch anwenden',
        Automatically : 'Automatisch'
    },

    CodeEditor : {
        'Code editor'   : 'Code-Editor',
        'Download code' : 'Code herunterladen'
    },

    Combo : {
        Theme    : 'Thema wählen',
        Language : 'Gebietsschema auswählen',
        Size     : 'Wähle die Größe aus'
    },

    EventColor : {
        Meeting : 'green',
        Phone   : 'red',
        Lunch   : 'blue',
        Workout : 'orange'
    },

    EventType : {
        Meeting : 'Session',
        Phone   : 'Telefon',
        Lunch   : 'Mittagessen',
        Workout : 'Trainieren'
    },

    Shared : {
        'Full size'      : 'Volle Größe',
        'Locale changed' : 'Sprache geändert',
        'Phone size'     : 'Telefongröße'
    },

    Tooltip : {
        infoButton       : 'Klicken Sie hier, um Informationen anzuzeigen und das Thema oder Gebietsschema zu wechseln',
        codeButton       : 'Klicken Sie hier, um den integrierten Code-Editor anzuzeigen',
        hintCheck        : 'Aktivieren Sie diese Option, um beim Laden des Beispiels automatisch Hinweise anzuzeigen',
        fullscreenButton : 'Ganzer Bildschirm'
    },

    FieldFilterPicker : {
        equals         : 'ist gleich',
        doesNotEqual   : 'ist nicht gleich',
        isEmpty        : 'ist leer',
        isNotEmpty     : 'ist nicht leer',
        contains       : 'enthält',
        doesNotContain : 'nicht enthält',
        startsWith     : 'beginnt mit',
        endsWith       : 'beginnt nicht mit',
        isOneOf        : 'ist eines von',
        isNotOneOf     : 'ist nicht eines von',

        isGreaterThan          : 'größer als',
        isLessThan             : 'kleiner als',
        isGreaterThanOrEqualTo : 'größer als oder gleich',
        isLessThanOrEqualTo    : 'kleiner als oder gleich',
        isBetween              : 'liegt zwischen',
        isNotBetween           : 'liegt nicht zwischen',

        isBefore     : 'ist vor',
        isAfter      : 'ist nach',
        isToday      : 'ist heute',
        isTomorrow   : 'ist morgen',
        isYesterday  : 'ist gestern',
        isThisWeek   : 'ist diese Woche',
        isNextWeek   : 'ist nächste Woche',
        isLastWeek   : 'ist letzte Woche',
        isThisMonth  : 'ist diesen Monat',
        isNextMonth  : 'ist nächsten Monat',
        isLastMonth  : 'ist letzten Monat',
        isThisYear   : 'ist dieses Jahr',
        isNextYear   : 'ist nächstes Jahr',
        isLastYear   : 'ist letztes Jahr',
        isYearToDate : 'ist im bisherigen Jahresverlauf',

        isTrue  : 'ist wahr',
        isFalse : 'ist falsch',

        selectAProperty  : 'Wählen einen Eigenschaft aus',
        selectAnOperator : 'Wählen einen Operator aus',
        caseSensitive    : 'Groß- und Kleinschreibung beachten',

        and : 'und',

        dateFormat : 'DD.MM.YYYY',

        selectOneOrMoreValues : 'Wählen einen oder mehrere Werte aus',
        enterAValue           : 'Einen Wert eingeben',
        enterANumber          : 'Eine Nummer eingeben',
        selectADate           : 'Wählen ein Datum'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Filter hinzufügen'
    },

    Filter : {
        applyFilter   : 'Filter anwenden',
        filter        : 'Filter',
        editFilter    : 'Filter redigieren',
        on            : 'Auf',
        before        : 'Vor',
        after         : 'Nach',
        equals        : 'Gleichen',
        lessThan      : 'Weniger als',
        moreThan      : 'Mehr als',
        removeFilter  : 'Filter entfernen',
        disableFilter : 'Filter deaktivieren'
    },

    HeaderMenu : {
        collapseColumn : 'Spalte verbergen',
        expandColumn   : 'Spalte aufklappen'
    },

    ColumnRename : {
        rename : 'Umbenennen'
    },

    RowCopyPaste : {
        copyRecord  : 'Kopieren',
        cutRecord   : 'Schnitt',
        pasteRecord : 'Einfügen',
        rows        : 'Zeilen',
        row         : 'Zeile'
    },

    CellCopyPaste : {
        copy  : 'Kopieren',
        cut   : 'Schnittn',
        paste : 'Einfügen'
    },

    PresetManager : {
        secondAndMinute : {
            name : 'Sekunden'
        },
        minuteAndHour : {
            topDateFormat : 'ddd DD.MM, HH:mm',
            name          : 'Minuten'
        },
        hourAndDay : {
            topDateFormat : 'ddd DD.MM',
            name          : 'Tag'
        },
        day : {
            name : 'Tag/stunden'
        },
        week : {
            name : 'Woche/stunden'
        },
        dayAndWeek : {
            name : 'Woche/tage'
        },
        dayAndMonth : {
            name : 'Monat'
        },
        weekAndDay : {
            displayDateFormat : 'HH:mm',
            name              : 'Woche'
        },
        weekAndMonth : {
            name : 'Wochen'
        },
        weekAndDayLetter : {
            name : 'Wochen/wochentage'
        },
        weekDateAndMonth : {
            name : 'Monate/wochen'
        },
        monthAndYear : {
            name : 'Monate'
        },
        year : {
            name : 'Jahre'
        },
        manyYears : {
            name : 'Mehrere Jahre'
        }
    },

    RecurrenceFrequencyCombo : {
        None    : 'Keine Wiederholung',
        Daily   : 'täglich',
        Weekly  : 'wöchentlich',
        Monthly : 'monatlich',
        Yearly  : 'jährlich'
    },

    Column : {
        Company : 'Firma',
        Name    : 'Name'
    },

    EventTip : {
        'Edit event' : 'Buchung redigieren',
        timeFormat   : 'LT'
    },

    ModeSelector : {
        includeWeekends : 'Wochenenden einbeziehen',
        weekends        : 'Wochenenden'
    },

    DayView : {
        Day               : 'Tag',
        collapseAllDayRow : 'Ganztägigen abschnitt reduzieren',
        dayUnit           : 'tag',
        daysUnit          : 'tage',
        expandAllDayRow   : 'Erweitern sie den ganztägigen bereich',
        timeFormat        : 'LT'
    },

    Calendar : {
        loadFail : 'Fehler beim Laden der Kalenderdaten. Bitte kontaktieren Sie Ihren Systemadministrator'
    }

};

export default LocaleHelper.publishLocale(locale);
