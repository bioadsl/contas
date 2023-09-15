/*!
 *
 * Bryntum Calendar 5.5.2 (TRIAL VERSION)
 *
 * Copyright(c) 2023 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
(function(s,a){var o=typeof exports=="object";if(typeof define=="function"&&define.amd)define([],a);else if(typeof module=="object"&&module.exports)module.exports=a();else{var g=a(),p=o?exports:s;for(var m in g)p[m]=g[m]}})(typeof self<"u"?self:void 0,()=>{var s={},a={exports:s},o=Object.defineProperty,g=Object.getOwnPropertyDescriptor,p=Object.getOwnPropertyNames,m=Object.prototype.hasOwnProperty,c=(e,t,r)=>t in e?o(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,v=(e,t)=>{for(var r in t)o(e,r,{get:t[r],enumerable:!0})},k=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of p(t))!m.call(e,l)&&l!==r&&o(e,l,{get:()=>t[l],enumerable:!(n=g(t,l))||n.enumerable});return e},y=e=>k(o({},"__esModule",{value:!0}),e),h=(e,t,r)=>(c(e,typeof t!="symbol"?t+"":t,r),r),u={};v(u,{default:()=>T}),a.exports=y(u);var d=class{static mergeLocales(...e){let t={};return e.forEach(r=>{Object.keys(r).forEach(n=>{typeof r[n]=="object"?t[n]={...t[n],...r[n]}:t[n]=r[n]})}),t}static trimLocale(e,t){let r=(n,l)=>{e[n]&&(l?e[n][l]&&delete e[n][l]:delete e[n])};Object.keys(t).forEach(n=>{Object.keys(t[n]).length>0?Object.keys(t[n]).forEach(l=>r(n,l)):r(n)})}static normalizeLocale(e,t){if(!e)throw new Error('"nameOrConfig" parameter can not be empty');if(typeof e=="string"){if(!t)throw new Error('"config" parameter can not be empty');t.locale?t.name=e||t.name:t.localeName=e}else t=e;let r={};if(t.name||t.locale)r=Object.assign({localeName:t.name},t.locale),t.desc&&(r.localeDesc=t.desc),t.code&&(r.localeCode=t.code),t.path&&(r.localePath=t.path);else{if(!t.localeName)throw new Error(`"config" parameter doesn't have "localeName" property`);r=Object.assign({},t)}for(let n of["name","desc","code","path"])r[n]&&delete r[n];if(!r.localeName)throw new Error("Locale name can not be empty");return r}static get locales(){return globalThis.bryntum.locales||{}}static set locales(e){globalThis.bryntum.locales=e}static get localeName(){return globalThis.bryntum.locale||"En"}static set localeName(e){globalThis.bryntum.locale=e||d.localeName}static get locale(){return d.localeName&&this.locales[d.localeName]||this.locales.En||Object.values(this.locales)[0]||{localeName:"",localeDesc:"",localeCoode:""}}static publishLocale(e,t){let{locales:r}=globalThis.bryntum,n=d.normalizeLocale(e,t),{localeName:l}=n;return!r[l]||t===!0?r[l]=n:r[l]=this.mergeLocales(r[l]||{},n||{}),r[l]}},i=d;h(i,"skipLocaleIntegrityCheck",!1),globalThis.bryntum=globalThis.bryntum||{},globalThis.bryntum.locales=globalThis.bryntum.locales||{},i._$name="LocaleHelper";var f={localeName:"No",localeDesc:"Norsk",localeCode:"no",Object:{Yes:"Ja",No:"Nei",Cancel:"Avbryt",Ok:"OK",Week:"Uke"},ColorPicker:{noColor:"Ingen farge"},Combo:{noResults:"Ingen treff",recordNotCommitted:"Kunne ikke legge til oppføringen",addNewValue:e=>`Legg til ${e}`},FilePicker:{file:"Fil"},Field:{badInput:"Ugyldig feltverdi",patternMismatch:"Verdien skal samsvare med et bestemt mønster",rangeOverflow:e=>`Verdien må være mindre eller lik ${e.max}`,rangeUnderflow:e=>`Verdien må være større eller lik ${e.min}`,stepMismatch:"Verdien skal passe til trinnet",tooLong:"Verdien skal være kortere",tooShort:"Verdien skal være lengre",typeMismatch:"Verdien skal være i et bestemt format",valueMissing:"Dette feltet er obligatorisk",invalidValue:"Ugyldig feltverdi",minimumValueViolation:"Minimumsverdibrudd",maximumValueViolation:"Maksimumsverdibrudd",fieldRequired:"Dette feltet er obligatorisk",validateFilter:"Verdien skal velges fra listen"},DateField:{invalidDate:"Ugyldig datoinntasting"},DatePicker:{gotoPrevYear:"Gå til forrige år",gotoPrevMonth:"Gå til forrige måned",gotoNextMonth:"Gå til neste måned",gotoNextYear:"Gå til neste år"},NumberFormat:{locale:"no",currency:"NOK"},DurationField:{invalidUnit:"Ugyldig enhet"},TimeField:{invalidTime:"Ugyldig tidsinntasting"},TimePicker:{hour:"Time",minute:"Minutt",second:"Sekund"},List:{loading:"Laster...",selectAll:"Velg alle"},GridBase:{loadMask:"Laster...",syncMask:"Lagrer endringer, vennligst vent..."},PagingToolbar:{firstPage:"Gå til første side",prevPage:"Gå til forrige side",page:"Side",nextPage:"Gå til neste side",lastPage:"Gå til siste side",reload:"Last inn gjeldende side på nytt",noRecords:"Ingen oppføringer å vise",pageCountTemplate:e=>`av ${e.lastPage}`,summaryTemplate:e=>`Viser oppføringer ${e.start} - ${e.end} av ${e.allCount}`},PanelCollapser:{Collapse:"Skjul",Expand:"Utvid"},Popup:{close:"Lukk popup"},UndoRedo:{Undo:"Angre",Redo:"Gjøre om",UndoLastAction:"Angre siste handling",RedoLastAction:"Gjøre om siste handling",NoActions:"Ingen elementer I angrekøen"},FieldFilterPicker:{equals:"er lik",doesNotEqual:"er ikke lik",isEmpty:"er tom",isNotEmpty:"er ikke tom",contains:"inneholder",doesNotContain:"inneholder ikke",startsWith:"begynner med",endsWith:"slutter med",isOneOf:"er et av",isNotOneOf:"er ikke et av",isGreaterThan:"er større enn",isLessThan:"er mindre enn",isGreaterThanOrEqualTo:"er større enn eller lik",isLessThanOrEqualTo:"er mindre enn eller lik",isBetween:"er mellom",isNotBetween:"er ikke mellom",isBefore:"er før",isAfter:"er etter",isToday:"er i dag",isTomorrow:"er i morgen",isYesterday:"er i går",isThisWeek:"er denne uken",isNextWeek:"er neste uke",isLastWeek:"er siste uke",isThisMonth:"er denne måneden",isNextMonth:"er neste måned",isLastMonth:"er siste måned",isThisYear:"er i år",isNextYear:"er neste år",isLastYear:"er i fjor",isYearToDate:"er år til dags dato",isTrue:"er sant",isFalse:"er falsk",selectAProperty:"Velg egenskap",selectAnOperator:"Velg operatør",caseSensitive:"Skille mellom store og små bokstaver",and:"og",dateFormat:"D/M/YY",selectOneOrMoreValues:"Velg én eller flere verdier",enterAValue:"Skriv inn en verdi",enterANumber:"Skriv inn et tall",selectADate:"Velg en dato"},FieldFilterPickerGroup:{addFilter:"Legg til filter"},DateHelper:{locale:"no",weekStartDay:1,nonWorkingDays:{0:!0,6:!0},weekends:{0:!0,6:!0},unitNames:[{single:"millisekund",plural:"ms",abbrev:"ms"},{single:"sekund",plural:"sekunder",abbrev:"s"},{single:"minutt",plural:"minutter",abbrev:"min"},{single:"time",plural:"timer",abbrev:"t"},{single:"dag",plural:"dager",abbrev:"d"},{single:"uke",plural:"uker",abbrev:"u"},{single:"måned",plural:"måneder",abbrev:"mån"},{single:"kvartal",plural:"kvartaler",abbrev:"k"},{single:"år",plural:"år",abbrev:"år"},{single:"tiår",plural:"tiår",abbrev:"tår"}],unitAbbreviations:[["mls"],["s","sek"],["m","min"],["t","t"],["d"],["u","uk"],["må","mån","mdr"],["k","kvart","kvt"],["å","år"],["dek"]],parsers:{L:"DD.MM.YYYY;",LT:"HH:mm",LTS:"HH:mm:ss A"},ordinalSuffix:e=>e}},L=i.publishLocale(f),S=new String,b={localeName:"No",localeDesc:"Norsk",localeCode:"no",ColumnPicker:{column:"Kolonne",columnsMenu:"Kolonner",hideColumn:"Skjul kolonne",hideColumnShort:"Skjul",newColumns:"Nye kolonner"},Filter:{applyFilter:"Bruk filter",filter:"Filter",editFilter:"Rediger filter",on:"På",before:"Før",after:"Etter",equals:"Lik",lessThan:"Mindre enn",moreThan:"Flere enn",removeFilter:"Fjern filter",disableFilter:"Deaktiver filter"},FilterBar:{enableFilterBar:"Vis filterlinje",disableFilterBar:"Skjul filterlinje"},Group:{group:"Gruppere",groupAscending:"Gruppere stigende",groupDescending:"Gruppere synkende",groupAscendingShort:"Stigende",groupDescendingShort:"Synkende",stopGrouping:"Stopp gruppering",stopGroupingShort:"Stopp"},HeaderMenu:{moveBefore:e=>`Flytt før "${e}"`,moveAfter:e=>`Flytt etter "${e}"`,collapseColumn:"Skjul kolonne",expandColumn:"Utvid kolonne"},ColumnRename:{rename:"Gi nytt navn"},MergeCells:{mergeCells:"Slå sammen celler",menuTooltip:"Slå sammen celler med samme verdi når de sorteres etter denne kolonnen"},Search:{searchForValue:"Søk for verdi"},Sort:{sort:"Sortere",sortAscending:"Sortere stigende",sortDescending:"Sortere synkende",multiSort:"Multisortere",removeSorter:"Fjerne sorterer",addSortAscending:"Legge til sorterer",addSortDescending:"Legg til synkende sorterer",toggleSortAscending:"Endre til stigende",toggleSortDescending:"Endre til synkende",sortAscendingShort:"Stigende",sortDescendingShort:"Synkende",removeSorterShort:"Fjern",addSortAscendingShort:"+ stigende",addSortDescendingShort:"+ synkende"},Split:{split:"Del",unsplit:"Ikke delt",horizontally:"Horisontalt",vertically:"Vertikalt",both:"Begge"},Column:{columnLabel:e=>`${e.text?`${e.text} kolonne. `:""}MELLOMROM for kontekstmenyen${e.sortable?", ENTER for å sortere":""}`,cellLabel:S},Checkbox:{toggleRowSelect:"Veksle radvalg",toggleSelection:"Veksle valg av hele datasettet"},RatingColumn:{cellLabel:e=>{var t;return`${e.text?e.text:""} ${(t=e.location)!=null&&t.record?`vurdering : ${e.location.record.get(e.field)||0}`:""}`}},GridBase:{loadFailedMessage:"Datainnlasting mislyktes!",syncFailedMessage:"Datasynkronisering mislyktes!",unspecifiedFailure:"Uspesifisert feil",networkFailure:"Nettverksfeil",parseFailure:"Klarte ikke å analysere serversvar",serverResponse:"Serversvar:",noRows:"Ingen oppføringer å vise",moveColumnLeft:"Flytt til venstre valg",moveColumnRight:"Flytt til høyre valg",moveColumnTo:e=>`Flytt kolonne til ${e}`},CellMenu:{removeRow:"Slett"},RowCopyPaste:{copyRecord:"Kopier",cutRecord:"Klipp ut",pasteRecord:"Lim",rows:"rader",row:"rad"},CellCopyPaste:{copy:"Kopier",cut:"Klipp",paste:"Lim inn"},PdfExport:{"Waiting for response from server":"Venter på svar fra server...","Export failed":"Eksport mislyktes","Server error":"Serverfeil","Generating pages":"Generer sider...","Click to abort":"Avbryt"},ExportDialog:{width:"40em",labelWidth:"12em",exportSettings:"Eksportinnstillinger",export:"Eksport",exporterType:"Kontrollere paginering",cancel:"Avbryt",fileFormat:"Filformat",rows:"Rader",alignRows:"Juster rader",columns:"Kolonner",paperFormat:"Papirformat",orientation:"Retning",repeatHeader:"Gjenta overskrift"},ExportRowsCombo:{all:"Alle rader",visible:"Synlige rader"},ExportOrientationCombo:{portrait:"Stående",landscape:"Liggende"},SinglePageExporter:{singlepage:"Enkel side"},MultiPageExporter:{multipage:"Flere sider",exportingPage:({currentPage:e,totalPages:t})=>`Eksporterer side ${e}/${t}`},MultiPageVerticalExporter:{multipagevertical:"Flere sider (vertikal)",exportingPage:({currentPage:e,totalPages:t})=>`Eksporterer side ${e}/${t}`},RowExpander:{loading:"Laster",expand:"Utvid",collapse:"Skjul"},TreeGroup:{group:"Grupper etter",stopGrouping:"Stopp gruppering",stopGroupingThisColumn:"Stopp gruppering av denne kolonnen"}},w=i.publishLocale(b),E={localeName:"No",localeDesc:"Norsk",localeCode:"no",Object:{newEvent:"Ny hendelse"},ResourceInfoColumn:{eventCountText:e=>e+" hendelse"+(e!==1?"r":"")},Dependencies:{from:"Fra",to:"Til",valid:"Gyldig",invalid:"Ugyldig"},DependencyType:{SS:"SS",SF:"SSl",FS:"SlS",FF:"SlSl",StartToStart:"Start-til-start",StartToEnd:"Start-til-slutt",EndToStart:"Slutt-til-start",EndToEnd:"Slutt-til-slutt",short:["SS","SSl","SlS","SlSl"],long:["Start-til-start","Start-til-slutt","Slutt-til-start","Slutt-til-slutt"]},DependencyEdit:{From:"Fra",To:"Til",Type:"Type",Lag:"Forsinkelse","Edit dependency":"Rediger avhengighet",Save:"Lagre",Delete:"Slett",Cancel:"Avbryt",StartToStart:"Start til start",StartToEnd:"Start til slutt",EndToStart:"Slutt til start",EndToEnd:"Slutt til slutt"},EventEdit:{Name:"Navn",Resource:"Ressurs",Start:"Start",End:"Slutt",Save:"Lagre",Delete:"Slett",Cancel:"Avbryt","Edit event":"Redigere hendelse",Repeat:"Gjenta"},EventDrag:{eventOverlapsExisting:"Hendelse overlapper eksisterende hendelse for denne ressursen",noDropOutsideTimeline:"Hendelsen kan ikke droppes helt utenfor tidslinjen"},SchedulerBase:{"Add event":"Legg til hendelse","Delete event":"Slett hendelse","Unassign event":"Opphev tilordningen av hendelsen",color:"Farge"},TimeAxisHeaderMenu:{pickZoomLevel:"Zoom",activeDateRange:"Datointervall",startText:"Startdato",endText:"Sluttdato",todayText:"I dag"},EventCopyPaste:{copyEvent:"Kopier hendelse",cutEvent:"Klipp ut hendelse",pasteEvent:"Lim inn hendelse"},EventFilter:{filterEvents:"Filtrer oppgaver",byName:"Etter navn"},TimeRanges:{showCurrentTimeLine:"Vi gjeldende tidslinje"},PresetManager:{secondAndMinute:{displayDateFormat:"ll LTS",name:"Sekunder"},minuteAndHour:{topDateFormat:"ddd DD.MM, H",displayDateFormat:"ll LST"},hourAndDay:{topDateFormat:"ddd DD.MM",middleDateFormat:"LST",displayDateFormat:"ll LST",name:"Dag"},day:{name:"Dag/timer"},week:{name:"Uke/timer"},dayAndWeek:{displayDateFormat:"ll LST",name:"Uke/dager"},dayAndMonth:{name:"Måned"},weekAndDay:{displayDateFormat:"ll LST",name:"Uke"},weekAndMonth:{name:"Uker"},weekAndDayLetter:{name:"Uker/ukedager"},weekDateAndMonth:{name:"Måneder/uker"},monthAndYear:{name:"Måneder"},year:{name:"År"},manyYears:{name:"Flere år"}},RecurrenceConfirmationPopup:{"delete-title":"Du sletter en hendelse","delete-all-message":"Vil du slette alle forekomster av denne hendelsen?","delete-further-message":"Vil du slette denne og alle fremtidige forekomster av denne hendelsen, eller bare den valgte forekomsten?","delete-further-btn-text":"Slett alle fremtidige hendelser","delete-only-this-btn-text":"Slett bare denne hendelsen","update-title":"Du endrer en gjentakende hendelse","update-all-message":"Vil du endre alle forekomster av denne hendelsen?","update-further-message":"Vil du endre bare denne forekomsten av hendelsen, eller denne og alle fremtidige forekomster?","update-further-btn-text":"Alle fremtidige hendelser","update-only-this-btn-text":"Bare denne hendelsen",Yes:"Ja",Cancel:"Avbryt",width:600},RecurrenceLegend:{" and ":" og ",Daily:"Daglig","Weekly on {1}":({days:e})=>`Ukentlig i ${e}`,"Monthly on {1}":({days:e})=>`Månedlig i ${e}`,"Yearly on {1} of {2}":({days:e,months:t})=>`Årlig i ${e} av ${t}`,"Every {0} days":({interval:e})=>`Årlig ${e} dager`,"Every {0} weeks on {1}":({interval:e,days:t})=>`Hver ${e} uke(r) i ${t}`,"Every {0} months on {1}":({interval:e,days:t})=>`Hver ${e} måned(er) i on ${t}`,"Every {0} years on {1} of {2}":({interval:e,days:t,months:r})=>`Hvert ${e} år i ${t} of ${r}`,position1:"den første",position2:"den andre",position3:"den tredje",position4:"den fjerde",position5:"den femte","position-1":"den siste",day:"dad",weekday:"ukedag","weekend day":"helgedag",daysFormat:({position:e,days:t})=>`${e} ${t}`},RecurrenceEditor:{"Repeat event":"Gjenta hendelse",Cancel:"Avbryt",Save:"Lagre",Frequency:"Hyppighet",Every:"Hver",DAILYintervalUnit:"dag(er)",WEEKLYintervalUnit:"uke(r)",MONTHLYintervalUnit:"måned (er)",YEARLYintervalUnit:"år",Each:"Hver","On the":"Den","End repeat":"Slutt gjentakelse","time(s)":"gang(er)"},RecurrenceDaysCombo:{day:"dag",weekday:"ukedag","weekend day":"helgedag"},RecurrencePositionsCombo:{position1:"første",position2:"andre",position3:"tredje",position4:"fjerde",position5:"femte","position-1":"siste"},RecurrenceStopConditionCombo:{Never:"Aldri",After:"Etter","On date":"På dato"},RecurrenceFrequencyCombo:{None:"Ingen gjentakelse",Daily:"Daglig",Weekly:"Ukentlig",Monthly:"Måndelig",Yearly:"Årlig"},RecurrenceCombo:{None:"Ingen",Custom:"Tilpasset..."},Summary:{"Summary for":e=>`Oppsummering for ${e}`},ScheduleRangeCombo:{completeview:"Fullstendig tidsplan",currentview:"Synlig tidsplan",daterange:"Datointervall",completedata:"Fullstendig tidsplan (for alle hendelser)"},SchedulerExportDialog:{"Schedule range":"Tidsplanintervall","Export from":"Fra","Export to":"Til"},ExcelExporter:{"No resource assigned":"Ingen ressurs tildelt"},CrudManagerView:{serverResponseLabel:"Serversvar:"},DurationColumn:{Duration:"Varighet"}},C=i.publishLocale(E),D={localeName:"No",localeDesc:"Norsk",localeCode:"no",EventEdit:{Calendar:"Kalender","All day":"Hele dagen",day:"Dag",week:"Uke",month:"Måned",year:"År",decade:"Tiår"},EventMenu:{duplicateEvent:"Duplikat hendelse",copy:"kopi"},Calendar:{Today:"I dag",next:e=>`Neste ${e}`,previous:e=>`Forrige ${e}`,plusMore:e=>`+${e} mer`,allDay:"Hele dagen",endsOn:e=>`Ender ${e}`,weekOfYear:([e,t])=>`Uke ${t}, ${e}`,loadFail:"Innlasting av kalenderdata mislyktes. Ta kontakt med systemadministratoren din"},CalendarDrag:{holdCtrlForRecurrence:"Hold CTRL for gjentakende hendelse"},CalendarMixin:{eventCount:e=>`${e||"Ingen"} hendelse${e&&e>1?"":"r"}`},EventTip:{"Edit event":"Redigere hendelse",timeFormat:"LST"},ModeSelector:{includeWeekends:"Inkluder helger",weekends:"Helger"},AgendaView:{Agenda:"Dagsorden"},MonthView:{Month:"Måned",monthUnit:"måned"},WeekView:{weekUnit:"uke"},YearView:{Year:"År",yearUnit:"år",noEvents:"Ingen hendelser"},EventList:{List:"Liste",Start:"Start",Finish:"Slutt",days:e=>`${e>1?`${e} `:""}dag${e===1?"":"er"}`},DayView:{Day:"Dag",dayUnit:"dag",daysUnit:"dager",expandAllDayRow:"Utvid hele dagens del",collapseAllDayRow:"Skjul hele dagens del",timeFormat:"LST"},DayResourceView:{dayResourceView:"Daglige ressurser"},Sidebar:{"Filter events":"Filtrere hendelser"},WeekExpander:{expandTip:"Klikk for å utvide rad",collapseTip:"Klikk for å skjule rad"}},T=i.publishLocale(D);if(typeof a.exports=="object"&&typeof s=="object"){var F=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of Object.getOwnPropertyNames(t))!Object.prototype.hasOwnProperty.call(e,l)&&l!==r&&Object.defineProperty(e,l,{get:()=>t[l],enumerable:!(n=Object.getOwnPropertyDescriptor(t,l))||n.enumerable});return e};a.exports=F(a.exports,s)}return a.exports});