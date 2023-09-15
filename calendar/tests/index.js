const
    Project = new Siesta.Project.Browser(),
    {
        isPR,
        isTC,
        isTrial,
        locales,
        examplesLocales,
        script,
        placeOnWindow
    }       = BryntumTestHelper;

Project.configure({
    title                   : document.location.host === 'lh' ? 'Calendar' : 'Bryntum Calendar Test Suite',
    isReadyTimeout          : 30000, // longer for memory profiling which slows things down
    testClass               : BryntumCalendarTest,
    runCore                 : 'sequential',
    disableCaching          : false,
    autoCheckGlobals        : false,
    keepResults             : false,
    enableCodeCoverage      : Boolean(window.IstanbulCollector),
    failOnResourceLoadError : true,
    forceDOMVisible         : isTC && bowser.safari,
    turboMode               : true,
    ignoreTimeouts          : [
        'scrollToVisibleStartTime',
        'syncCurrentTimeIndicator',
        'b-no-transitions'
    ],
    recorderConfig : {
        recordOffsets    : false,
        ignoreCssClasses : [
            'b-active',
            'b-icon',
            'b-hover',
            'b-hover-anim',
            'b-dirty',
            'b-focused',
            'b-contains-focus'
        ],
        shouldIgnoreDomElementId : id => /^b-/.test(id)
    }
});

const
    getItems                = mode => {
        const
            examples       = [
                {
                    pageUrl : '../examples/basic?test',
                    url     : 'examples/basic.t.js'
                },
                {
                    pageUrl    : '../examples/basic?test&rtl',
                    url        : 'examples/basic-rtl.t.js',
                    skipMonkey : true
                },
                {
                    pageUrl : '../examples/bigdataset?test',
                    url     : 'examples/bigdataset.t.js'
                },
                {
                    pageUrl : '../examples/calendar-scheduler?test',
                    url     : 'examples/calendar-scheduler.t.js'
                },
                {
                    pageUrl     : '../examples/calendar-taskboard',
                    keepPageUrl : true,
                    includeFor  : 'module'
                },
                {
                    pageUrl : '../examples/confirmation-dialogs',
                    url     : 'examples/confirmation-dialogs.t.js'
                },
                {
                    pageUrl : '../examples/custom-menus?develop',
                    url     : 'examples/custom-menus.t.js'
                },
                {
                    // Omit the ?develop query because we test the hints in this example test.
                    title   : 'Custom Rendering default theme',
                    pageUrl : '../examples/custom-rendering',
                    url     : 'examples/customrendering.t.js'
                },
                {
                    pageUrl : '../examples/event-items',
                    url     : 'examples/event-items.t.js'
                },
                {
                    // Omit the ?test query because we test the hints in this example test.
                    // But we are testing that the hints show up in the dark theme.
                    // url query param needed to make the URL unique.
                    title      : 'Custom Rendering Dark theme',
                    pageUrl    : '../examples/custom-rendering?theme=dark',
                    url        : 'examples/customrendering.t.js?dark-theme',
                    skipMonkey : true
                },
                'customized-resourcefilter',
                'date-resource',
                'day-time-ticks',
                'day-zoom',
                'docked-editor',
                {
                    pageUrl : '../examples/drag-onto-tasks',
                    url     : 'examples/drag-onto-tasks.t.js'
                },
                'dragfromgrid',
                {
                    pageUrl     : '../examples/esmodule?test',
                    keepPageUrl : true,
                    includeFor  : 'module'
                },
                {
                    pageUrl : '../examples/event-column?test',
                    url     : 'examples/event-column.t.js'
                },
                {
                    pageUrl : '../examples/eventedit?test',
                    url     : 'examples/eventedit.t.js'
                },
                {
                    pageUrl     : '../examples/exporttoics?test',
                    url         : 'examples/exporttoics.t.js',
                    keepPageUrl : true
                },
                {
                    pageUrl : '../examples/dual-dayview?test',
                    url     : 'examples/dual-dayview.t.js'
                },
                {
                    pageUrl : '../examples/filtering?test',
                    url     : 'examples/filtering.t.js'
                },
                'fit-hours',
                'list-range',
                {
                    pageUrl : '../examples/listview?test',
                    url     : 'examples/listview.t.js'
                },
                {
                    pageUrl : '../examples/load-on-demand?test'
                },
                {
                    pageUrl : '../examples/localization?test',
                    url     : 'examples/localization.t.js'
                },
                'megadataset',
                {
                    pageUrl : '../examples/multiassign?test',
                    url     : 'examples/multiassign.t.js'
                },
                'print',
                'recurrence',
                'responsive',
                'resource-avatars',
                {
                    pageUrl : '../examples/resourceview?develop',
                    url     : 'examples/resourceview.t.js'
                },
                {
                    // Skip testing. Config is here for sanity checks
                    pageUrl : '../examples/salesforce',
                    skip    : true
                },
                {
                    pageUrl     : '../examples/scripttag',
                    keepPageUrl : true
                },
                'shifted',
                'show-booking',
                {
                    pageUrl : '../examples/sidebar-customization?test',
                    url     : 'examples/sidebarcustomization.t.js'
                },
                'state',
                {
                    pageUrl : '../examples/tooltips?test',
                    url     : 'examples/tooltips.t.js'
                },
                {
                    pageUrl : '../examples/timeranges?test',
                    url     : 'examples/timeranges.t.js'
                },
                {
                    pageUrl                 : '../examples/timezone?test',
                    url                     : 'examples/timezone.t.js',
                    ignoreInputOverflowTest : true,
                    consoleFail             : ['error']
                },
                {
                    pageUrl : '../examples/undoredo?test',
                    url     : 'examples/undoredo.t.js'
                },
                {
                    pageUrl : '../examples/visible-hours?test',
                    url     : 'examples/visiblehours.t.js'
                },
                {
                    // Disable preloading module bundle for examples tests. Required for `bryntum.query(...)`
                    alsoPreload : [],
                    pageUrl     : '../examples/webcomponents?test',
                    url         : 'examples/webcomponents.t.js',
                    keepPageUrl : mode === 'umd'
                }
            ],

            // These examples are to be exempted from RTL monkey testing because they do not have
            // setup code which create the RTL environment.
            nonRTLExamples = {
                esmodule      : 1,
                scripttag     : 1,
                webcomponents : 1
            },

            frameworks     = [

                // ANGULAR

                'angular/angular-11',
                'angular/basic',
                'angular/bigdataset',
                {
                    pageUrl : 'angular/drag-from-grid',
                    url     : 'angular/angular-drag-from-grid.t.js'
                },
                'angular/eventedit',
                'angular/filtering',
                {
                    pageUrl : 'angular/inline-data',
                    url     : 'angular/angular-inline-data.t.js'
                },
                'angular/undoredo',
                'angular/visible-hours',

                // IONIC

                'ionic/ionic-4',

                // REACT - JAVASCRIPT

                'react/javascript/basic',
                'react/javascript/bigdataset',
                'react/javascript/eventedit',
                'react/javascript/filtering',
                {
                    pageUrl : 'react/javascript/inline-data',
                    url     : 'react/react-inline-data.t.js'
                },
                'react/javascript/test-cra',
                'react/javascript/undoredo',
                'react/javascript/visible-hours',

                // REACT - TYPESCRIPT

                {
                    pageUrl : 'react/typescript/basic',
                    url     : 'react/react-typescript-basic.t.js'
                },
                'react/typescript/test-cra',

                // VUE

                'vue/javascript/filtering',

                // VUE 3

                'vue-3/javascript/basic',
                'vue-3/javascript/bigdataset',
                'vue-3/javascript/calendar-scheduler',
                'vue-3/javascript/calendar-scheduler-inline',
                'vue-3/javascript/eventedit',
                {
                    pageUrl : 'vue-3/javascript/inline-data',
                    url     : 'vue-3/vue-3-inline-data.t.js'
                },
                'vue-3/javascript/undoredo',
                'vue-3/javascript/visible-hours',

                // WEBPACK

                {
                    pageUrl : 'webpack',
                    url     : 'webpack.t.js'
                }
            ],

            items          = [
                {
                    group   : 'Combination',
                    skip    : isPR,
                    // Don't pull in any classes from sources or bundles
                    preload : [
                        '../build/thin/core.stockholm.thin.css',
                        '../build/thin/grid.stockholm.thin.css',
                        '../build/thin/scheduler.stockholm.thin.css',
                        '../build/thin/calendar.stockholm.thin.css'
                    ],
                    includeFor : 'module',
                    items      : [
                        {
                            url     : 'combination/Scheduler.t.js',
                            keepUrl : true,
                            preload : preloads
                        },
                        {
                            url         : 'combination/thin-all.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/schedulerpro.stockholm.thin.css',
                                '../build/thin/gantt.stockholm.thin.css',
                                '../build/thin/calendar.stockholm.thin.css',
                                '../build/thin/taskboard.stockholm.thin.css'
                            ]
                        },
                        {
                            url         : 'combination/thin-calendar-gantt.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/gantt.stockholm.thin.css'
                            ]
                        },
                        {
                            url     : 'combination/thin-calendar-grid.t.js',
                            keepUrl : true
                        },
                        {
                            url     : 'combination/thin-calendar-scheduler.t.js',
                            keepUrl : true
                        },
                        {
                            url         : 'combination/thin-calendar-schedulerpro.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/schedulerpro.stockholm.thin.css'
                            ]
                        },
                        {
                            url         : 'combination/thin-calendar-taskboard.t.js',
                            keepUrl     : true,
                            alsoPreload : [
                                '../build/thin/taskboard.stockholm.thin.css'
                            ]
                        }
                    ]
                },
                {
                    group                  : 'Docs',
                    pageUrl                : '../docs/',
                    includeFor             : isTrial ? 'module,umd' : 'es6',
                    keepPageUrl            : true,
                    subTestTimeout         : 120000,
                    defaultTimeout         : 240000,
                    waitForTimeout         : 10000,
                    disableNoTimeoutsCheck : true,
                    alsoPreload            : bowser.firefox && preloadNoResizeObserver,
                    viewportHeight         : 500,
                    viewportWidth          : 1500,
                    items                  : [
                        {
                            isPR,
                            url            : 'docs/open-all-links.t.js',
                            subTestTimeout : 360000,
                            ignoreTopics   : [
                                'demos',
                                'engineDocs'
                            ],
                            ignoreClasses : [
                                'guides/data/displayingdata.md',
                                'guides/data/treedata.md'
                            ],
                            products               : ['Calendar'],
                            docsTitle              : 'Bryntum Calendar',
                            disableNoTimeoutsCheck : true
                        },
                        {
                            url                    : 'docs/verify-links-in-guides.t.js',
                            subTestTimeout         : 240000,
                            disableNoTimeoutsCheck : true,
                            ignoreLinks            : []
                        },
                        
                    ]
                },
                {
                    group     : 'layout',
                    collapsed : true,
                    items     : [
                        'layout/day/FluidDayLayout.t.js'
                    ]
                },
                {
                    group     : 'util',
                    collapsed : true,
                    items     : [
                        'util/EventSorter.t.js',
                        'util/DayTime.t.js'
                    ]
                },
                {
                    group     : 'widget',
                    collapsed : true,
                    items     : [
                        'widget/AgendaView.t.js',
                        'widget/CalendarRow.t.js',
                        'widget/DayView-dayShift.t.js',
                        'widget/DayView.t.js',
                        'widget/EventList.t.js',
                        'widget/MonthView.t.js',
                        'widget/ResourceView.t.js',
                        'widget/DayResourceView.t.js',
                        {
                            alsoPreload    : preloadLocales,
                            url            : 'widget/Sidebar.t.js',
                            defaultTimeout : 120000
                        },
                        'widget/WeekView.t.js',
                        'widget/YearView.t.js'
                    ]
                },
                {
                    group : 'view',
                    items : [
                        {
                            preloadFont : preloadPoppinsFont,
                            url         : 'view/Calendar.t.js'
                        },
                        'view/Calendar1.t.js',
                        'view/Calendar2.t.js',
                        'view/Calendar3.t.js',
                        'view/Calendar4.t.js',
                        {
                            alsoPreload : [
                                {
                                    type    : 'css',
                                    content : '.b-widget { font-family : Arial !important; }'
                                }
                            ],
                            url : 'view/CalendarResponsive.t.js'
                        },
                        'view/CalendarEmptyCellRenderer.t.js',
                        'view/CalendarAllDay.t.js',
                        'view/CalendarConfig.t.js',
                        'view/CalendarData.t.js',
                        'view/CalendarFiltering.t.js',
                        'view/CalendarProject.t.js',
                        'view/CalendarRecurrence.t.js',
                        'view/CalendarRendering.t.js',
                        'view/CalendarResourceView.t.js',
                        'view/CalendarSelection.t.js',
                        {
                            url         : 'view/Leaks.t.js',
                            consoleFail : ['error'],
                            includeFor  : 'es6'
                        },
                        'view/Rendering.t.js',
                        'view/Scrolling.t.js'
                    ]
                },
                {
                    group : 'features',
                    items : [
                        'features/AutoCreate.t.js',
                        'features/CalendarPrint.t.js',
                        'features/ContextMenus.t.js',
                        {
                            url            : 'features/EventEdit.t.js',
                            alsoPreload    : preloadLocales,
                            defaultTimeout : 60000
                        },
                        'features/EventTooltip.t.js',
                        'features/ExternalEventSource.t.js',
                        'features/LoadOnDemand.t.js',
                        'features/Recurrence.t.js',
                        'features/TimeRanges.t.js',
                        {
                            url         : 'features/TimeZone.t.js',
                            consoleFail : ['error']
                        },
                        'features/UndoRedo.t.js',
                        'features/WeekExpander.t.js',

                        {
                            group          : 'drag',
                            subTestTimeout : 120000,
                            items          : [
                                'features/CalendarDragCreateDay.t.js',
                                'features/CalendarDragCreateMonth.t.js',
                                'features/CalendarDragCreateWeek.t.js',
                                'features/CalendarDragCreateYear.t.js',
                                'features/CalendarDragMoveDay.t.js',
                                'features/CalendarDragMoveMonth.t.js',
                                'features/CalendarDragMoveWeek.t.js',
                                'features/CalendarDragMoveYear.t.js',
                                'features/CalendarDragResizeDay.t.js',
                                'features/CalendarDragResizeMonth.t.js',
                                'features/CalendarDragResizeWeek.t.js',
                                'features/CalendarDragResizeYear.t.js'
                            ]
                        }
                    ]
                },
                {
                    group : 'XSS',
                    skip  : !bowser.chrome,
                    items : [
                        'xss/CalendarXSS.t.js'
                    ]
                },
                
                {
                    group       : 'Localization',
                    alsoPreload : preloadLocales,
                    notUsedList : [
                        // Not used from Scheduler
                        'DependencyType',
                        'Dependencies',
                        'DependencyEdit',
                        ...((isPR || mode === 'es6') ? [
                            // Not used from Engine
                            'ConflictEffectDescription',
                            'ConstraintIntervalDescription',
                            'CycleEffectDescription',
                            'DateConstraintIntervalDescription',
                            'DeactivateDependencyCycleEffectResolution',
                            'DeactivateDependencyResolution',
                            'DependencyConstraintIntervalDescription',
                            'DisableManuallyScheduledConflictResolution',
                            'EmptyCalendarEffectDescription',
                            'ManuallyScheduledParentConstraintIntervalDescription',
                            'ProjectConstraintIntervalDescription',
                            'RemoveDateConstraintConflictResolution',
                            'RemoveDependencyCycleEffectResolution',
                            'RemoveDependencyResolution',
                            'Use24hrsEmptyCalendarEffectResolution',
                            'Use8hrsEmptyCalendarEffectResolution'
                        ] : [])
                    ],
                    items : [
                        
                        'localization/Localization.t.js',
                        'localization/features/EventEdit.t.js',
                        'localization/AgendaEventList.t.js',
                        {
                            url                            : 'localization/DatePickerLocalization.t.js',
                            disableWaitingForCSSAnimations : true,
                            includeFor                     : 'es6',
                            subTestTimeout                 : 180000,
                            defaultTimeout                 : 180000
                        }

                    ]
                },
                
                {
                    group       : 'Examples',
                    // Allow modules examples tests use helper classes from bundle published on window. Umd is published from namespace
                    alsoPreload : mode === 'module' ? script(
                        `import * as Module from "../../build/calendar.module.js";Object.assign(window, Module);`
                    ) : undefined,
                    // Filter out examples used for monkey tests only
                    items : examples.filter(example => example?.pageUrl != null && example?.url != null)
                },
                {
                    group          : 'Examples browser',
                    subTestTimeout : 120000,
                    defaultTimeout : 120000,
                    waitForTimeout : 15000,
                    items          : [
                        {
                            pageUrl                        : '../examples/?theme=material&test',
                            url                            : 'examples/browser/examplebrowser.t.js',
                            enablePageRedirect             : true,
                            exampleName                    : 'recurrence',
                            exampleTitle                   : 'Recurring Events',
                            offlineExampleName             : 'frameworks-ionic-ionic-4',
                            jumpSectionName                : 'Customization',
                            jumpExampleName                : 'customized-resourcefilter',
                            filterText                     : 'events',
                            filterCount                    : 4,
                            disableWaitingForCSSAnimations : true
                        },
                        {
                            pageUrl       : '../examples/?online&test',
                            url           : 'examples/browser/examplebrowser-links.t.js',
                            isPR,
                            isTrial,
                            viewportWidth : 1500,
                            config        : {
                                skipSanityChecks : true
                            },
                            skipHeaderCheck : [
                                'esmodule',
                                'scripttag'
                            ],
                            skipTrialCheck : [
                                'extjsmodern'
                            ],
                            skipTestSizeCheck : [
                                'megadataset'
                            ],
                            enablePageRedirect     : true,
                            // Demo browser opens module demos even if opened as umd when not run on an ancient
                            // browser (which we do not support), so no point in running this test for umd
                            includeFor             : 'es6',
                            disableNoTimeoutsCheck : true,
                            skip                   : isPR
                        }
                    ]
                },
                {
                    group : 'Monkey Tests for Examples',
                    items : BryntumTestHelper.prepareMonkeyTests({
                        items  : examples,
                        mode,
                        config : {
                            webComponent   : 'bryntum-calendar',
                            waitSelector   : '.b-calendar-cell',
                            targetSelector : '.b-calendar'
                        }
                    })
                },
                {
                    group : 'RTL Monkey Tests for Examples',
                    items : BryntumTestHelper.prepareMonkeyTests({
                        rtl    : true,
                        items  : examples,
                        mode,
                        config : {
                            webComponent   : 'bryntum-calendar',
                            waitSelector   : '.b-calendar-cell',
                            targetSelector : '.b-calendar'
                        },
                        itemFilter : item => {
                            if (item) {
                                const path = new URL(`http://${item.pageUrl || item}`).pathname.split('/');

                                return !Boolean(nonRTLExamples[path[path.length - 1]]);
                            }
                        }
                    })
                },
                {
                    group : 'Smart Monkey Tests for Examples',
                    items : BryntumTestHelper.prepareMonkeyTests({
                        items : [
                            ...examples,
                            { pageUrl : '../examples', waitSelector : '.image' }
                        ],
                        mode,
                        smartMonkeys : true,
                        config       : {
                            webComponent   : 'bryntum-calendar',
                            waitSelector   : '.b-calendar-cell',
                            targetSelector : '.b-calendar'
                        }
                    })
                },
                {
                    group      : 'Frameworks examples (npm build)',
                    includeFor : 'umd',
                    skip       : !(isTrial && bowser.chrome),
                    items      : [
                        'examples/frameworks-build.t.js'
                    ]
                },
                {
                    group      : 'Examples tests sanity',
                    includeFor : 'es6',
                    skip       : !bowser.chrome,
                    items      : [
                        'examples/examples-missing-tests.t.js'
                    ]
                },
                {
                    group          : 'Frameworks',
                    consoleFail    : ['error', 'warn'],
                    includeFor     : isTrial ? 'module,umd' : 'es6',
                    config         : { skipSanityChecks : true },
                    subTestTimeout : 120000,
                    defaultTimeout : 120000,
                    skip           : isTC && !isTrial,
                    items          : [
                        {
                            group : 'Frameworks examples',
                            items : BryntumTestHelper.prepareFrameworkTests(frameworks)
                        },
                        {
                            group : 'Monkey tests for Frameworks examples',
                            items : BryntumTestHelper.prepareFrameworkMonkeyTests({
                                items  : frameworks,
                                config : {
                                    waitSelector   : '.b-calendar-cell',
                                    targetSelector : '.b-calendar'
                                }
                            })
                        },
                        {
                            group : 'Smart Monkey tests for Frameworks examples',
                            items : BryntumTestHelper.prepareFrameworkMonkeyTests({
                                items        : frameworks,
                                smartMonkeys : true,
                                config       : {
                                    waitSelector   : '.b-calendar-cell',
                                    targetSelector : '.b-calendar'
                                }
                            })
                        }
                    ]
                }
            ];

        return BryntumTestHelper.prepareItems(items, mode);
    },
    // Preloads for tests. Usage example: alsoPreload : [preloadName]
    preloadFont             = {
        // want size to be as equal as possible on different platforms
        type    : 'css',
        content : 'body, button { font-family: Arial, Helvetica, sans-serif;  font-size: 14px; }'
    },
    preloadLocales          = {
        umd     : locales.map(l => `../build/locales/calendar.locale.${l}.js`),
        default : script(locales.map(l => `import "../lib/Calendar/localization/${l}.js";`))
    },
    preloadNoResizeObserver = {
        type    : 'js',
        content : 'window.ResizeObserver = null; window.onerror = function(err) { return /ResizeObserver/.test(err);};'
    },
    preloadTurbo            = {
        // To allow classes to have different config values in test execution
        type    : 'js',
        content : 'window.__applyTestConfigs = ' + String(Project.turboMode) + ';'
    },
    preloadCss              = '../build/calendar.material.css',
    preloads                = [
        preloadCss,
        preloadFont,
        preloadTurbo
    ],
    preloadPoppinsFont = {
        type    : 'css',
        content : `
            body, button { font-family: Arial, Helvetica, sans-serif;  font-size: 14px; }
            @font-face {
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 900;
                src: local(''),
                url('../../resources/fonts/poppins-v20-latin-900.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
                url('../../resources/fonts/poppins-v20-latin-900.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
            }
        `
    },
    groups                  = [];



groups.push({
    group   : 'Using module bundle',
    preload : [
        ...preloads,
        script(`
            import * as Module from "../build/${isPR ? 'calendar.module.min.js' : 'calendar.module.js'}";
            Object.assign(window, Module);
        `)
    ],
    isEcmaModule : true,
    mode         : 'module',
    items        : getItems('module')
});

groups.push({
    group   : 'Using umd bundle',
    preload : [
        ...preloads,
        isTrial ? '../build/calendar.umd.js' : '../build/calendar.umd.min.js'
    ],
    isEcmaModule : false,
    mode         : 'umd',
    items        : getItems('umd')

});

groups.forEach(group => group.product = 'calendar');

Project.start(groups);
