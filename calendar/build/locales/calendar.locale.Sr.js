/*!
 *
 * Bryntum Calendar 5.5.2 (TRIAL VERSION)
 *
 * Copyright(c) 2023 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
(function(s,i){var t=typeof exports=="object";if(typeof define=="function"&&define.amd)define([],i);else if(typeof module=="object"&&module.exports)module.exports=i();else{var p=i(),m=t?exports:s;for(var u in p)m[u]=p[u]}})(typeof self<"u"?self:void 0,()=>{var s={},i={exports:s},t=Object.defineProperty,p=Object.getOwnPropertyDescriptor,m=Object.getOwnPropertyNames,u=Object.prototype.hasOwnProperty,v=(e,a,o)=>a in e?t(e,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[a]=o,j=(e,a)=>{for(var o in a)t(e,o,{get:a[o],enumerable:!0})},g=(e,a,o,r)=>{if(a&&typeof a=="object"||typeof a=="function")for(let n of m(a))!u.call(e,n)&&n!==o&&t(e,n,{get:()=>a[n],enumerable:!(r=p(a,n))||r.enumerable});return e},k=e=>g(t({},"__esModule",{value:!0}),e),b=(e,a,o)=>(v(e,typeof a!="symbol"?a+"":a,o),o),c={};j(c,{default:()=>P}),i.exports=k(c);var d=class{static mergeLocales(...e){let a={};return e.forEach(o=>{Object.keys(o).forEach(r=>{typeof o[r]=="object"?a[r]={...a[r],...o[r]}:a[r]=o[r]})}),a}static trimLocale(e,a){let o=(r,n)=>{e[r]&&(n?e[r][n]&&delete e[r][n]:delete e[r])};Object.keys(a).forEach(r=>{Object.keys(a[r]).length>0?Object.keys(a[r]).forEach(n=>o(r,n)):o(r)})}static normalizeLocale(e,a){if(!e)throw new Error('"nameOrConfig" parameter can not be empty');if(typeof e=="string"){if(!a)throw new Error('"config" parameter can not be empty');a.locale?a.name=e||a.name:a.localeName=e}else a=e;let o={};if(a.name||a.locale)o=Object.assign({localeName:a.name},a.locale),a.desc&&(o.localeDesc=a.desc),a.code&&(o.localeCode=a.code),a.path&&(o.localePath=a.path);else{if(!a.localeName)throw new Error(`"config" parameter doesn't have "localeName" property`);o=Object.assign({},a)}for(let r of["name","desc","code","path"])o[r]&&delete o[r];if(!o.localeName)throw new Error("Locale name can not be empty");return o}static get locales(){return globalThis.bryntum.locales||{}}static set locales(e){globalThis.bryntum.locales=e}static get localeName(){return globalThis.bryntum.locale||"En"}static set localeName(e){globalThis.bryntum.locale=e||d.localeName}static get locale(){return d.localeName&&this.locales[d.localeName]||this.locales.En||Object.values(this.locales)[0]||{localeName:"",localeDesc:"",localeCoode:""}}static publishLocale(e,a){let{locales:o}=globalThis.bryntum,r=d.normalizeLocale(e,a),{localeName:n}=r;return!o[n]||a===!0?o[n]=r:o[n]=this.mergeLocales(o[n]||{},r||{}),o[n]}},l=d;b(l,"skipLocaleIntegrityCheck",!1),globalThis.bryntum=globalThis.bryntum||{},globalThis.bryntum.locales=globalThis.bryntum.locales||{},l._$name="LocaleHelper";var y={localeName:"Sr",localeDesc:"Srpski",localeCode:"sr",Object:{Yes:"Da",No:"Ne",Cancel:"Otkaži",Ok:"OK",Week:"Nedelja"},ColorPicker:{noColor:"Без боје"},Combo:{noResults:"Nema rezultata",recordNotCommitted:"Rezultati nisu mogli biti dodati",addNewValue:e=>`Dodaj ${e}`},FilePicker:{file:"Datoteka"},Field:{badInput:"Neispravna vrednost polja",patternMismatch:"Vrednost treba da odgovara određenom šablonu",rangeOverflow:e=>`Vrednost mora biti manja ili jednaka ${e.max}`,rangeUnderflow:e=>`Vrednost mora biti veća ili jednaka ${e.min}`,stepMismatch:"Vrednost treba da odgovara koraku",tooLong:"Vrednost treba da je kraća",tooShort:"Vrednost treba da je duža",typeMismatch:"Potrebno je da vrednost bude određenog formata",valueMissing:"Ovo polje je potrebno",invalidValue:"Neispravna vrednost polja",minimumValueViolation:"Minimalna vrednost prekršaja",maximumValueViolation:"Maksimalna vrednost prekršaja",fieldRequired:"Ovo polje je potrebno",validateFilter:"Vrednost mora da bude izabrana sa liste"},DateField:{invalidDate:"Neispravni unos datuma"},DatePicker:{gotoPrevYear:"Idi na prethodnu godinu",gotoPrevMonth:"Idi na prethodni mesec",gotoNextMonth:"Idi na sledeći mesec",gotoNextYear:"Idi na sledeću godinu"},NumberFormat:{locale:"sr",currency:"RSD"},DurationField:{invalidUnit:"Neispravna jedinica"},TimeField:{invalidTime:"Neispravan unos vremena"},TimePicker:{hour:"Sat",minute:"Minut",second:"Sekunda"},List:{loading:"Učitavanje...",selectAll:"Odaberi sve"},GridBase:{loadMask:"Učitavanje...",syncMask:"Promene se čuvaju, molim sačekajte..."},PagingToolbar:{firstPage:"Idi na prvu stranu",prevPage:"Idi na prethodnu stranu",page:"Strana",nextPage:"Idi na sledeću stranu",lastPage:"Idi na poslednju stranu",reload:"Ponovo učitaj trenutnu stranu",noRecords:"Nema zapisa za prikaz",pageCountTemplate:e=>`od ${e.lastPage}`,summaryTemplate:e=>`Prikazuju se zapisi ${e.start} - ${e.end} od ${e.allCount}`},PanelCollapser:{Collapse:"Skupi",Expand:"Raširi"},Popup:{close:"Zatvori iskačući prozor"},UndoRedo:{Undo:"Opozovi",Redo:"Ponovi",UndoLastAction:"Opozovi poslednju radnju",RedoLastAction:"Ponovi poslednju opozvanu radnju",NoActions:"Nema stavki u redu za opoziv"},FieldFilterPicker:{equals:"jednako",doesNotEqual:"nije jednako",isEmpty:"je prazno",isNotEmpty:"nije prazno",contains:"sadrži",doesNotContain:"ne sadrži",startsWith:"počinje sa",endsWith:"završava sa",isOneOf:"je jedan od",isNotOneOf:"nije jedan od",isGreaterThan:"je veći od",isLessThan:"je manji od",isGreaterThanOrEqualTo:"je veći ili jednak od",isLessThanOrEqualTo:"je manji ili jednak od",isBetween:"je između",isNotBetween:"nije između",isBefore:"je pre",isAfter:"je posle",isToday:"je danas",isTomorrow:"je sutra",isYesterday:"je juče",isThisWeek:"je ove nedelje",isNextWeek:"je sledeće nedelje",isLastWeek:"je prošle nedelje",isThisMonth:"je ovog meseca",isNextMonth:"je sledećeg meseca",isLastMonth:"je prošlog meseca",isThisYear:"je ove godine",isNextYear:"je sledeće godine",isLastYear:"je prošle godine",isYearToDate:"je od početka godine do danas",isTrue:"je tačan",isFalse:"je netačan",selectAProperty:"Izaberite svojstvo",selectAnOperator:"Izaberite operatora",caseSensitive:"Osetljivo na mala i velika slova",and:"i",dateFormat:"D/M/YY",selectOneOrMoreValues:"Izaberite jednu ili više vrednosti",enterAValue:"Unesite vrednost",enterANumber:"Unesite broj",selectADate:"Izaberite datum"},FieldFilterPickerGroup:{addFilter:"Dodajte filter"},DateHelper:{locale:"sr",weekStartDay:1,nonWorkingDays:{0:!0,6:!0},weekends:{0:!0,6:!0},unitNames:[{single:"milisekund",plural:"milisekundi",abbrev:"ms"},{single:"sekunda",plural:"sekunde",abbrev:"s"},{single:"minut",plural:"minuta",abbrev:"min"},{single:"sat",plural:"sati",abbrev:""},{single:"dan",plural:"dana",abbrev:"d"},{single:"nedelja",plural:"nedelje",abbrev:"ned"},{single:"mesec",plural:"meseci",abbrev:"mes"},{single:"kvartal",plural:"kvartala",abbrev:"kv"},{single:"godina",plural:"godine",abbrev:"god"},{single:"dekada",plural:"dekade",abbrev:"dek"}],unitAbbreviations:[["ms"],["s","sek"],["m","min"],["sat","sati"],["d"],["ned","ned"],["mes","mes","mes"],["kv","kv","kv"],["g","god"],["dek"]],parsers:{L:"D.M.YYYY",LT:"HH:mm",LTS:"HH:mm:ss A"},ordinalSuffix:e=>e+"."}},E=l.publishLocale(y),h=new String,S={localeName:"Sr",localeDesc:"Srpski",localeCode:"sr",ColumnPicker:{column:"Kolona",columnsMenu:"Kolone",hideColumn:"Sakrij kolonu",hideColumnShort:"Sakrij",newColumns:"Nove kolone"},Filter:{applyFilter:"Primeni filter",filter:"Filter",editFilter:"Uredi filter",on:"Uključeno",before:"Pre",after:"Posle",equals:"Jednako",lessThan:"Manje od",moreThan:"Više od",removeFilter:"Ukloni filter",disableFilter:"Onemogući filter"},FilterBar:{enableFilterBar:"Prikaži traku sa filterima",disableFilterBar:"Sakrij traku sa filterima"},Group:{group:"Grupiši",groupAscending:"Grupiši uzlazno",groupDescending:"Grupiši silazno",groupAscendingShort:"Uzlazno",groupDescendingShort:"Silazno",stopGrouping:"Prekini grupisanje",stopGroupingShort:"Stani"},HeaderMenu:{moveBefore:e=>`Pomeri pre "${e}"`,moveAfter:e=>`Pomeri posle "${e}"`,collapseColumn:"Skupi kolonu",expandColumn:"Proširi kolonu"},ColumnRename:{rename:"Preimenuj"},MergeCells:{mergeCells:"Spoj ćelije",menuTooltip:"Spoj ćelije sa istim vrednostima sortirane prema ovoj koloni"},Search:{searchForValue:"Pretraži vrednost"},Sort:{sort:"Sortiraj",sortAscending:"Sortiraj uzlazno",sortDescending:"Sortiraj silazno",multiSort:"Višestruko sortiranje",removeSorter:"Ukloni sortiranje",addSortAscending:"Dodaj uzlazno sortiranje",addSortDescending:"Dodaj silazno sortiranje",toggleSortAscending:"Promeni u uzlazno",toggleSortDescending:"Promeni u sliazno",sortAscendingShort:"Uzlazno",sortDescendingShort:"Silazno",removeSorterShort:"Ukloni",addSortAscendingShort:"+ Uzlazno",addSortDescendingShort:"+ Silazno"},Split:{split:"Podeljeno",unsplit:"Nepodeljeno",horizontally:"Horizontalno",vertically:"Vertikalno",both:"Oboje"},Column:{columnLabel:e=>`${e.text?`${e.text} kolone. `:""}SPACE za kontekstni meni${e.sortable?", ENTER za sortiranje":""}`,cellLabel:h},Checkbox:{toggleRowSelect:"Naizmenični izbor reda",toggleSelection:"Naizmenični izbor kompletnog seta podataka"},RatingColumn:{cellLabel:e=>{var a;return`${e.text?e.text:""} ${(a=e.location)!=null&&a.record?`ocena : ${e.location.record.get(e.field)||0}`:""}`}},GridBase:{loadFailedMessage:"Učitavanje podataka nije uspelo!",syncFailedMessage:"Sinhronizacija podataka nije uspela!",unspecifiedFailure:"Neodređena greška",networkFailure:"Greška mreže",parseFailure:"Raščlanjivanje odgovora servera nije uspelo",serverResponse:"Odgovor servera:",noRows:"Nema zapisa za prikaz",moveColumnLeft:"Pomeri u levi odeljak",moveColumnRight:"Pomeri u desni odeljak",moveColumnTo:e=>`Pomeri kolonu u ${e}`},CellMenu:{removeRow:"Obriši"},RowCopyPaste:{copyRecord:"Kopiraj",cutRecord:"Iseci",pasteRecord:"Umetni",rows:"redova",row:"red"},CellCopyPaste:{copy:"Kopiraj",cut:"Iseci",paste:"Umetni"},PdfExport:{"Waiting for response from server":"Čeka se na odgovor servera...","Export failed":"Izvoz nije uspeo","Server error":"Greška servera","Generating pages":"Generišem stranice...","Click to abort":"Otkaži"},ExportDialog:{width:"40em",labelWidth:"12em",exportSettings:"Izvezi podešavanja",export:"Izvezi",exporterType:"Kontrola straničenja",cancel:"Otkaži",fileFormat:"Format datoteke",rows:"Redovi",alignRows:"Poravnaj redove",columns:"Kolone",paperFormat:"Format papira",orientation:"Orijentacija",repeatHeader:"Ponovi zaglavlje"},ExportRowsCombo:{all:"Svi redovi",visible:"Vidljivi redovi"},ExportOrientationCombo:{portrait:"Upravno",landscape:"Položeno"},SinglePageExporter:{singlepage:"Jedna strana"},MultiPageExporter:{multipage:"Više strana",exportingPage:({currentPage:e,totalPages:a})=>`Izvos stranice ${e}/${a}`},MultiPageVerticalExporter:{multipagevertical:"Više strana (uspravno)",exportingPage:({currentPage:e,totalPages:a})=>` Izvos stranice ${e}/${a}`},RowExpander:{loading:"Učitavanje",expand:"Raširi",collapse:"Skupi"},TreeGroup:{group:"Grupiši po",stopGrouping:"Prekini grupisanje",stopGroupingThisColumn:"Prekini grupisanje ove kolone"}},N=l.publishLocale(S),D={localeName:"Sr",localeDesc:"Srpski",localeCode:"sr",Object:{newEvent:"Novi dogđaj"},ResourceInfoColumn:{eventCountText:e=>e+" dogđaj"+(e!==1?"događaji":"i")},Dependencies:{from:"Od",to:"Do",valid:"Ispravan",invalid:"Neispravan"},DependencyType:{SS:"PP",SF:"PK",FS:"KP",FF:"KK",StartToStart:"Od početka do početka",StartToEnd:"Od početka do kraja",EndToStart:"Od kraja do početka",EndToEnd:"Od kraja do kraja",short:["PP","PK","KP","KK"],long:["Od početka do početka","Od početka do kraja","Od kraja do početka","Od kraja do kraja"]},DependencyEdit:{From:"Od",To:"Do",Type:"Tip",Lag:"Kašnjenje","Edit dependency":"Uredi zavisnost",Save:"Sačuvaj",Delete:"Obriši",Cancel:"Otkaži",StartToStart:"Od početka do početka",StartToEnd:"Od početka do kraja",EndToStart:"Od kraja do početka",EndToEnd:"Od kraja do kraja"},EventEdit:{Name:"Ime",Resource:"Resurs",Start:"Početak",End:"Kraj",Save:"Sačuvaj",Delete:"Obriši",Cancel:"Otkaži","Edit event":"Uredi događaj",Repeat:"Ponovi"},EventDrag:{eventOverlapsExisting:"Događaj preklapa postojeći događaj za ovaj resurs",noDropOutsideTimeline:"Događaj možda nije u potpunosti spušten izvan vremenske linije"},SchedulerBase:{"Add event":"Dodaj događaj","Delete event":"Obriši događaj","Unassign event":"Poništi dodelu događaja",color:"Boja"},TimeAxisHeaderMenu:{pickZoomLevel:"Zumiranje",activeDateRange:"Opseg datuma",startText:"Početni datum",endText:"Krajnji datum",todayText:"Danas"},EventCopyPaste:{copyEvent:"Kopiraj događaj",cutEvent:"Iseci događaj",pasteEvent:"Umetni događaj"},EventFilter:{filterEvents:"Filtriraj zadatke",byName:"Po imenu"},TimeRanges:{showCurrentTimeLine:"Prikaži trenutnu vremensku liniju"},PresetManager:{secondAndMinute:{displayDateFormat:"ll LTS",name:"Sekundi"},minuteAndHour:{topDateFormat:"ddd D.M., hA",displayDateFormat:"ll LST"},hourAndDay:{topDateFormat:"ddd D.M.",middleDateFormat:"LST",displayDateFormat:"ll LST",name:"Dan"},day:{name:"Dan/sati"},week:{name:"Nedelja/sati"},dayAndWeek:{displayDateFormat:"ll LST",name:"Nedelja/dana"},dayAndMonth:{name:"Mesec"},weekAndDay:{displayDateFormat:"ll LST",name:"Nedelja"},weekAndMonth:{name:"Nedelja"},weekAndDayLetter:{name:"Nedelja/radnih dana"},weekDateAndMonth:{name:"Meseci/nedelja"},monthAndYear:{name:"Meseci"},year:{name:"Godina"},manyYears:{name:"Više godina"}},RecurrenceConfirmationPopup:{"delete-title":"Brisanje događaja","delete-all-message":"Da li želišda obrišeš sva pojavljivanja ovog događaja?","delete-further-message":"Da li želiš da obrišeš ovaj i sva sledeća pojavljivanja ovog događaja, ili samo odabrano pojavljivanje?","delete-further-btn-text":"Obriši sve buduće događaje","delete-only-this-btn-text":"Obriši samo ovaj događaj","update-title":"Izmena događaja koji se ponavlja","update-all-message":"Da li želiš da promeniš sva pojavljivanja ovog događaja?","update-further-message":"Da li želiš da promeniš samo ovo pojavljivanje događaja, ili ovo i svako buduće pojavljivanje? ","update-further-btn-text":"Sve buduće događaje","update-only-this-btn-text":"Samo ovaj događaj",Yes:"Da",Cancel:"Otkaži",width:600},RecurrenceLegend:{" and ":" i ",Daily:"Dnevno","Weekly on {1}":({days:e})=>`Svake nedelje u ${e}`,"Monthly on {1}":({days:e})=>`Svakog meseca u ${e}`,"Yearly on {1} of {2}":({days:e,months:a})=>`Svake godine u ${e} u ${a}`,"Every {0} days":({interval:e})=>`Svakih ${e} dana`,"Every {0} weeks on {1}":({interval:e,days:a})=>`Svakih ${e} nedelja u ${a}`,"Every {0} months on {1}":({interval:e,days:a})=>`Svakih ${e} meseci u ${a}`,"Every {0} years on {1} of {2}":({interval:e,days:a,months:o})=>`Svakih ${e} godina na ${a} u ${o}`,position1:"prvi",position2:"drugi",position3:"treći",position4:"četvrti",position5:"peti","position-1":"poslednji",day:"dan",weekday:"radni dan","weekend day":"dan vikenda",daysFormat:({position:e,days:a})=>`${e} ${a}`},RecurrenceEditor:{"Repeat event":"Ponovi događaj",Cancel:"Otkaži",Save:"Sačuvaj",Frequency:"Frekvencija",Every:"Svaki(h)",DAILYintervalUnit:"dan(a)",WEEKLYintervalUnit:"nedelje(e)",MONTHLYintervalUnit:"mesec(a)",YEARLYintervalUnit:"godina(e)",Each:"Svake","On the":"Na","End repeat":"Kraj ponavljanja","time(s)":"put(a)"},RecurrenceDaysCombo:{day:"dan",weekday:"radni dan","weekend day":"dan vikenda"},RecurrencePositionsCombo:{position1:"prvi",position2:"drugi",position3:"treći",position4:"četvrti",position5:"peti","position-1":"poslednji"},RecurrenceStopConditionCombo:{Never:"Nikad",After:"Nakon","On date":"Na dan"},RecurrenceFrequencyCombo:{None:"Bez ponavljanja",Daily:"Dnevno",Weekly:"Nedeljno",Monthly:"Mesečno",Yearly:"Godišnje"},RecurrenceCombo:{None:"Nema",Custom:"Prilagođeno…"},Summary:{"Summary for":e=>`Pregled na ${e}`},ScheduleRangeCombo:{completeview:"Kompletan raspored",currentview:"Vidljiv raspored",daterange:"Opseg datuma",completedata:"Kompletan raspored (za sve događaje)"},SchedulerExportDialog:{"Schedule range":"Opseg rasporeda","Export from":"Od","Export to":"Do"},ExcelExporter:{"No resource assigned":"Nema pridruženih resursa"},CrudManagerView:{serverResponseLabel:"Odgovor servera:"},DurationColumn:{Duration:"Trajanje"}},z=l.publishLocale(D),f={localeName:"Sr",localeDesc:"Srpski",localeCode:"sr",EventEdit:{Calendar:"Kalendar","All day":"Ceo dan",day:"Dan",week:"Nedelja",month:"Mesec",year:"Godina",decade:"Decenija"},EventMenu:{duplicateEvent:"Dupliraj događaj",copy:"kopiraj"},Calendar:{Today:"Danas",next:e=>`Sledeći ${e}`,previous:e=>`Prethodni ${e}`,plusMore:e=>`+${e} više`,allDay:"Ceo dan",endsOn:e=>`Završava ${e}`,weekOfYear:([e,a])=>`Nedelja ${a}, ${e}`,loadFail:"Učitavanje podataka kalendara nije uspelo. Obratite se svom sistemskom administratoru"},CalendarDrag:{holdCtrlForRecurrence:"Držite CTRL za događaje koji se ponavljaju"},CalendarMixin:{eventCount:e=>`${e||"Nema"} događaj${e&&e>1?"e":""}`},EventTip:{"Edit event":"Uredi događaj",timeFormat:"LST"},ModeSelector:{includeWeekends:"Uključi vikende",weekends:"Vikendi"},AgendaView:{Agenda:"Rokovnik"},MonthView:{Month:"Mesec",monthUnit:"mesec"},WeekView:{weekUnit:"nedelja"},YearView:{Year:"Godina",yearUnit:"godina",noEvents:"Nema događaja"},EventList:{List:"Lista",Start:"Početak",Finish:"Kraj",days:e=>`${e>1?`${e} `:""}dan${e===1?"":"a"}`},DayView:{Day:"Dan",dayUnit:"dan",daysUnit:"dana",expandAllDayRow:"Proširi red ceo dan",collapseAllDayRow:"Skupi red ceo dan",timeFormat:"LST"},DayResourceView:{dayResourceView:"Dnevni resursi"},Sidebar:{"Filter events":"Filtriraj događaje"},WeekExpander:{expandTip:"Klkni da raširiš red",collapseTip:"Klikni da skupiš red"}},P=l.publishLocale(f);if(typeof i.exports=="object"&&typeof s=="object"){var O=(e,a,o,r)=>{if(a&&typeof a=="object"||typeof a=="function")for(let n of Object.getOwnPropertyNames(a))!Object.prototype.hasOwnProperty.call(e,n)&&n!==o&&Object.defineProperty(e,n,{get:()=>a[n],enumerable:!(r=Object.getOwnPropertyDescriptor(a,n))||r.enumerable});return e};i.exports=O(i.exports,s)}return i.exports});
