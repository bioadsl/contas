# Source and demos

## Distribution

### Trial distribution

Please visit [Download Free Trial](https://bryntum.com/download/?product=calendar) page to request distribution zip with product
packages and demos for Bryntum Calendar.

### Licensed distribution

Licensed distribution zip with product packages, sources and demos for Bryntum Calendar can be downloaded from
[Bryntum Customer Zone](https://customerzone.bryntum.com/).

Bryntum Customer Zone contains nightly builds for Bryntum Calendar with the latest changes.

### Distribution archive

Distribution archive has the following folder structure:

| Folder       | Contents                                                                                                            |
|--------------|---------------------------------------------------------------------------------------------------------------------|
| `/build`     | Distribution folder, contains JS bundles, CSS themes, locales and fonts.                                            |
| `/docs`      | Documentation, open this in a browser (needs to be on a web server) to view guides & API docs.                      |
| `/examples`  | Demos, open this in a browser (needs to be on a web server)                                                         |
| `/lib`       | Source code, can be included in your ES6+ project using `import`.                                                   |
| `/resources` | SCSS files to build our themes or your own custom theme.                                                            |
| `/tests`     | Our complete test suite, including [Siesta Lite](https://bryntum.com/products/siesta/) to allow you to run them in a browser. |

## Bundles

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

## Themes

Distribution zip contains Bryntum Calendar themes which can be found in **/build** folder

| File                        | Contents            |
|-----------------------------|---------------------|
| `calendar.classic-dark.css`  | Classic-Dark theme  |
| `calendar.classic.css`       | Classic theme       |
| `calendar.classic-light.css` | Classic-Light theme |
| `calendar.material.css`      | Material theme      |
| `calendar.stockholm.css`     | Stockholm theme     |

## JavaScript demos

All vanilla JavaScript demos for Bryntum Calendar are located in the **/examples** folder in the distribution zip.

We recommend unzipping the package and configuring your preferred webserver to serve the contents of the unzipped
folder. For example you may configure your webserver to serve the Bryntum Calendar folder as 
[http://localhost](http://localhost).

When this is done you can view the demos in your browser locally at 
[http://localhost/examples/](http://localhost/examples/).

## Framework demos

Framework demos are located in the **/examples/frameworks** folder.

| Framework            | Demo folder location               |
|----------------------|------------------------------------|
| Angular              | /examples/frameworks/angular/      |
| Ionic (with Angular) | /examples/frameworks/ionic/        |
| React                | /examples/frameworks/react/        |
| React + NextJS       | /examples/frameworks/react-nextjs/ |
| React + Vite         | /examples/frameworks/react-vite/   |
| Vue 2                | /examples/frameworks/vue/          |
| Vue 3                | /examples/frameworks/vue-3/        |
| Vue 3 + Vite         | /examples/frameworks/vue-3-vite/   |

We recommend unzip package and configure your preferred webserver to serve the contents of unzipped folder.
For example you may configure webserver to serve Bryntum Calendar folder as [http://localhost](http://localhost).
When this is done you will see demos in your local browser at this URL
[http://localhost/examples/frameworks/](http://localhost/examples/frameworks/).

<div class="note">

Before viewing a demo it requires building. Please check the <strong>README.md</strong> file in each demo's folder for instructions.

</div>



<p class="last-modified">Last modified on 2023-08-30 8:52:26</p>