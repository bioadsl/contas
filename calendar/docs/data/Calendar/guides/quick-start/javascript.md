# Getting Started with Bryntum Calendar in JavaScript

## Try JavaScript demos

Bryntum Calendar is delivered with a variety of JavaScript demo applications showing its functionality.

<div class="b-card-group-2">
<a href="https://bryntum.com/products/calendar/examples/" class="b-card"><i class="fas b-fa-globe"></i>View online JS demos</a>
<a href="#Calendar/guides/download.md#javascript-demos" class="b-card"><i class="fab b-fa-js"></i>View local JS demos</a>
</div>

## Create JavaScript application

In this guide we will explain how to get started if you are not using npm. If you prefer to use npm,
[please visit the dedicated Quick Start here](#Calendar/guides/quick-start/javascript-npm.md).

To get started, the broad steps are as follows:

1. [Download Bryntum Calendar](##download)
2. [Create Application](##create-application)
3. [Bryntum bundles](##bryntum-bundles)
4. [Add component to Application](##add-component-to-application)
5. [Apply styles](##apply-styles)
6. [Run Application](##run-application)

The application we are about to build together is pretty simple, and will look like the live demo below:
<div class="external-example" data-file="Calendar/guides/readme/basic.js"></div>

## Download

Bryntum Calendar is a commercial product, but you can access our free trial archive with bundles and examples by
[downloading it here](https://bryntum.com/download/?product=calendar).

## Create Application

You can proceed as usual. The Bryntum Calendar Component is compliant with the most popular Javascript Standards.

You'll likely create a folder with an HTML page called `index.html` and a JavaScript file for your application, let's
say `app.js`.

## Bryntum bundles

The Bryntum Calendar distribution provides pre-build JavaScript bundles.
All bundles are transpiled with `chrome: 75` babel preset.

In distribution zip they are located under the **/build** folder.

| File                    | Contents                                                        |
|-------------------------|-----------------------------------------------------------------|
| `calendar.module.js`     | Modules format bundle without WebComponents                     |
| `calendar.lwc.module.js` | Modules format bundle with Lightning WebComponents (Salesforce) |
| `calendar.wc.module.js`  | Modules format bundle with WebComponents                        |
| `calendar.umd.js`        | UMD format bundle with WebComponents                            |

Typings for TypeScripts can be found in files with a `.d.ts` file extension.

Minified bundles are available for Licensed product version and delivered with `.min.js` suffix.

### Using EcmaScript module bundles

If you choose this option, **copy** the selected module file onto your application, in the root folder, for instance.

We recommend you load your application script(s) (for example **app.js**) at the end of the body section with the
following syntax.

```html
<body>
    <script type="module" src="app.js"></script>
</body>
```

From your script(s) (for example **app.js**) import the classes you need from the EcmaScript module bundle, you can then
use them as follows:

```javascript
import { Calendar } from './calendar.module.js';

const calendar = new Calendar({/*...*/ });
```

<div class="note">

We have copied the module directly from the <code>build</code> folder for simplicity in this code example. Consider
using your preferred build tool instead.

</div>

[More on EcmaScript modules...](#Calendar/guides/gettingstarted/es6bundle.md)

### Using `<script>` tag and UMD files

Please consider this solution as legacy and use it only for compatibility. If you choose this option, **copy** the
selected UMD file onto your application, in the root folder, for instance.

To include Bryntum Calendar on your page using a plain old script tag, add a `<script>` tag pointing to the UMD bundle
file in the `<HEAD>` of your HTML page. Example:

```html
<script src="calendar.umd.js"></script>
```

We recommend you load your application script(s) (for example **app.js**) at the end of the body section with the
following syntax.

```html
<body>
    <script src="app.js"></script>
</body>
```

Within your application script(s), you will be able to access Calendar classes in the global `bryntum` namespace as
follows:

```javascript
const calendar = new bryntum.calendar.Calendar({/*...*/ });
```

<div class="note">

We also recommend you to copy onto your application the <code>.js.map</code> file paired with the umd file you selected.

</div>

<div class="note">

We have copied the module directly from the <code>build</code> folder for simplicity in this code example. Consider
using your preferred build tool instead.

</div>

[Read more on script tag and UMD modules...](#Calendar/guides/gettingstarted/scripttag.md)

## Add component to Application

Assuming the use of an EcmaScript module bundle:

```javascript
import { Calendar } from './calendar.module.js';

const calendar = new Calendar({

    appendTo : document.body,

    resources : [
        {
            id         : 1,
            name       : 'Default Calendar',
            eventColor : 'green'
        }
    ],
    events : [
        {
            id         : 1,
            name       : 'Meeting',
            startDate  : '2022-01-01T10:00:00',
            endDate    : '2022-01-01T11:00:00',
            resourceId : 1
        }
    ]
});
```

Here data is provided inline, but feel free to use the most appropriate data store.
[Learn more on stores...](#Core/guides/data/storebasics.md)

Hundreds of companies covering various industries praise Bryntum products. However, not everyone uses them the same way,
so we have made them fully customizable.

If you want to discover how flexible the Bryntum Calendar Component is right now, please continue exploring the
documentation and visit the [API documentation](#Calendar/view/Calendar).

## Apply styles

### Stylesheet

A theme is required to render the Bryntum Calendar correctly.

You'll find a complete list of available CSS files in the `/build` folder of the distribution:

| File                        | Contents            |
|-----------------------------|---------------------|
| `calendar.classic-dark.css`  | Classic-Dark theme  |
| `calendar.classic.css`       | Classic theme       |
| `calendar.classic-light.css` | Classic-Light theme |
| `calendar.material.css`      | Material theme      |
| `calendar.stockholm.css`     | Stockholm theme     |

You'll need to copy the selected CSS file into your project, let's say in the root folder.

<div class="note">

We also recommend you to copy onto your application the <code>.css.map</code> file paired with the css file you selected.

</div>

The selected CSS file will need to be loaded from your HTML `<HEAD>` section as follows (Example inclusion of Stockholm
theme):

```html
<link rel="stylesheet" href="calendar.stockholm.css" id="bryntum-theme">
```

You'll also need to **copy** the **font** folder next to the CSS file.

### Sizing the component

Create a CSS file, let's say **main.css**, for instance.
This CSS file will need to be loaded from your HTML `<HEAD>` section as follows:

```html
<link rel="stylesheet" href="main.css">
```

By Default, the Component is configured to take `100%` of the parent DOM element with a min-height of `10em`.

For your application to show the Component with the appropriate size, you can for example make parent components take
the full height of the screen.

```css
body,
html {
    margin         : 0;
    display        : flex;
    flex-direction : column;
    height         : 100vh;
    font-family    : Poppins, "Open Sans", Helvetica, Arial, sans-serif;
    font-size      : 14px;
}
```

There are many other solutions depending on the situation. Feel free to adapt the code above regarding your application
layout. For more information on the topic, see this guide
[Sizing the component](https://bryntum.com/products/grid/docs/guide/Grid/basics/sizing).

## Run Application

Now you can start your JavaScript App as usual!

<div class="note">

Please note that if you have chosen to use EcmaScript module bundles, you will need to host your application on a web
server to avoid CORS policy errors. Surf to the page in your browser, likely using an URL similar to 
<code>http://localhost/calendar</code>.

</div>

## What to do next?

### Learn about Data

Bryntum components often use multiple collections and entities.

The [Data guide](#Grid/guides/data/displayingdata.md) guide explains how they all fit together.



<p class="last-modified">Last modified on 2023-08-30 8:52:26</p>