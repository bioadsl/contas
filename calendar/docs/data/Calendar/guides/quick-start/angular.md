# Getting Started with Bryntum Calendar in Angular

## Try Angular demos

Bryntum Calendar is delivered with a variety of Angular demo applications showing its functionality.
All demo applications have been verified to be compatible with Node 16.

<div class="b-card-group-2">
<a href="https://bryntum.com/products/calendar/examples/?framework=angular" class="b-card"><i class="fas b-fa-globe"></i>View online Angular demos</a>
<a href="#Calendar/guides/integration/angular/guide.md#build-and-run-local-demos" class="b-card"><i class="fab b-fa-angular"></i>Build and run Angular demos</a>
</div>

## Create Angular application 

To get started, the broad steps are as follows:

1. [Access to npm registry](##access-to-npm-registry)
2. [Create Application](##create-application)
3. [Install component](##install-component)
4. [Add component to Application](##add-component-to-application)
5. [Apply styles](##apply-styles)
6. [Run Application](##run-application)

The application we are about to build together is pretty simple, and will look like the illustration below:

<img src="Calendar/getting-started-result.png" class="b-screenshot" alt="Getting Started on Bryntum Calendar with Angular Result">

## Access to npm registry

The quickest way to use our products is to use npm (Node Package Manager). If you do not have npm installed on your
computer, please visit [nodejs.org](https://nodejs.org).

Bryntum packages are hosted in a private Bryntum registry. Run the following command to locate the registry:

```shell
$ npm config set "@bryntum:registry=https://npm.bryntum.com"
```

You will then need to login into the registry using authentication details. Please note that these details differ
depending on if you are running the **trial** or the **licensed** version. Please choose the appropriate option below:

Run the following command to login:

<div class="docs-tabs" data-name="npm">
<div>
    <a>NPM v6, v7, v8</a>
    <a>NPM v9</a>
</div>
<div>

```shell
$ npm login --registry=https://npm.bryntum.com
```

</div>
<div>

```shell
npm login --auth-type=legacy --registry=https://npm.bryntum.com
```

<div class="note">

Bryntum repository does not support new login protocol used by NPM v9. Please use <code>--auth-type=legacy</code>
option to authenticate

</div>
</div>
</div>

You will be required to provide a username, password and email address.

<div class="docs-tabs" data-name="licensed">
<div>
    <a>Trial version</a>
    <a>Licensed Version</a>
</div>
<div>

```shell
Username: user..yourdomain.com
Password: trial
Email: (this IS public) user@yourdomain.com
```

<div class="note">

As username, use your email address, but make sure you replace <code>@</code> with <code>..</code> (double dot). Use <code>trial</code> as password.

</div>

<p>
Please note that after the trial period or as soon as you are ready to go on production, you will be required to acquire
a commercial license from the <a href="https://customerzone.bryntum.com">Bryntum Customer Zone</a>. You will then be
required to re-login to the Bryntum private registry with your customer details.
</p>

</div>
<div>

```shell
Username: user..yourdomain.com
Password: 
Email: (this IS public) user@yourdomain.com
```

<div class="note">

As username, use your Bryntum <strong>Customer Zone email</strong> but make sure you replace <code>@</code> with <code>..</code> (double dot).
Use your <strong>Bryntum Customer Zone</strong> password.

</div>
</div>
</div>

For more information, visit our [Npm Repository Guide](#Calendar/guides/npm-repository.md).

## Create Application

Similarly to all the examples shipped with the distribution, we will be using [Angular CLI](https://cli.angular.io/) to
build Angular applications.

Type the following command to install Angular CLI:

```shell
$ npm install -g @angular/cli
```

We will then create a basic application with Angular CLI using Typescript:

```shell
$ ng new my-app
```

* To the question `Would you like to add Angular routing? (y/N)` answer `Yes`, unless you prefer adding it later.

* To the question `Which stylesheet format would you like to use?`, you can choose either `CSS` or `SCSS`. This quick
  start guide will show you how to use both options.

<div class="note">

Please feel free to change <code>my-app</code> to your preferred application name

</div>

You can then move to your application folder:

```shell
$ cd my-app
```

## Install component

From your terminal, update project dependencies using the following commands:

<div class="docs-tabs" data-name="licensed">
<div>
    <a>Trial version</a>
    <a>Licensed version</a>
</div>
<div>

```shell
$ npm install @bryntum/calendar@npm:@bryntum/calendar-trial@5.5.2 
$ npm install @bryntum/calendar-angular@5.5.2
```

</div>
<div>

```shell
$ npm install @bryntum/calendar@5.5.2 
$ npm install @bryntum/calendar-angular@5.5.2
```
</div>
</div>

## Add component to Application

Edit the **src/app/app.module.ts** file and **add** the following import:

```typescript
import { BryntumCalendarModule } from '@bryntum/calendar-angular';

@NgModule({
    imports : [
        BryntumCalendarModule
    ]
})
```

Then, edit the **src/app/app.component.ts** file and replace the content with the following:

```typescript
import { Component, ViewChild } from '@angular/core';
import { BryntumCalendarComponent, BryntumProjectModelComponent } from '@bryntum/calendar-angular';
import { calendarConfig, projectConfig } from './app.config';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent {

    resources = [
        {
            id         : 1,
            name       : 'Default Calendar',
            eventColor : 'green'
        }
    ];

    events = [
        {
            id         : 1,
            name       : 'Meeting',
            startDate  : '2022-01-01T10:00:00',
            endDate    : '2022-01-01T11:00:00',
            resourceId : 1
        }
    ];

    calendarConfig = calendarConfig;
    projectConfig = projectConfig;

    @ViewChild('calendar') calendarComponent!: BryntumCalendarComponent;
    @ViewChild('project') projectComponent!: BryntumProjectModelComponent;

}
```

If you prefer using CSS styling then replace `'./app.component.scss'` with `'./app.component.css'`.

Create **src/app/app.config.ts** file with the following content:

```typescript
import { CalendarConfig, ProjectModelConfig } from '@bryntum/calendar';

export const projectConfig: Partial<ProjectModelConfig> = {
    // Empty project config
};

export const calendarConfig: Partial<CalendarConfig> = {
    date : new Date(2022, 0, 1)
};
```

And finally, edit the **src/app/app.component.html** file and replace the content with the following:

```html
<bryntum-project-model
    #project
    [events] = "events"
    [resources] = "resources"
></bryntum-project-model>

<bryntum-calendar
    #calendar
    [date] = "calendarConfig.date!"
    [project] = "project"
></bryntum-calendar>
```

## Apply styles

### Stylesheet

A theme is required to render the Bryntum Calendar correctly.

The following CSS files are provided with the Bryntum npm packages or in the `/build` folder of the distribution:

| File                        | Contents            |
|-----------------------------|---------------------|
| `calendar.classic-dark.css`  | Classic-Dark theme  |
| `calendar.classic.css`       | Classic theme       |
| `calendar.classic-light.css` | Classic-Light theme |
| `calendar.material.css`      | Material theme      |
| `calendar.stockholm.css`     | Stockholm theme     |

You'll need to reference the selected CSS file into your project.

<div class="docs-tabs" data-name="stylesheet">
<div>
    <a>CSS</a>
    <a>SCSS</a>
</div>
<div>

You'll need to copy the selected CSS file into your project, let's say in the <strong>src/app</strong> folder.

<div class="note">

We also recommend you to copy onto your application the <code>.css.map</code> file paired with the css file you selected.

</div>

You'll also need to <strong>copy</strong> the <strong>font</strong> folder next to the CSS file.

Edit the <strong>src/app/app.component.ts</strong> file and <strong>add</strong> a reference the CSS file location as follows:

```typescript
styleUrls : ['./app.component.css','./calendar.material.css']
```

</div>
<div>

Edit the <strong>src/styles.scss</strong> and <strong>add</strong> the following: 

```scss
@import "~@bryntum/calendar/calendar.material.css";
```
</div>
</div>

### Sizing the component

By Default, the Component is configured to take `100%` of the parent DOM element with a min-height of `10em`.

For your application to show the Component with the appropriate size, you can for example make parent components take
the full height of the screen.

<div class="docs-tabs" data-name="stylesheet">
<div>
    <a>CSS</a>
    <a>SCSS</a>
</div>
<div>

In your <strong>src/styles.css</strong> file, add the following:

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

```css
app-root {
    flex : 1 1 100%;
}
```

</div>
<div>

In your <strong>src/styles.scss</strong> file, add the following:

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

```css
app-root {
    flex : 1 1 100%;
}
```
</div>
</div>

There are many other solutions depending on the situation. Feel free to adapt the code above regarding your application
layout. For more information on the topic, see this guide 
[Sizing the component](https://bryntum.com/products/grid/docs/guide/Grid/basics/sizing).

## Run Application

From your terminal:

```shell
$ ng serve
```

Your application is now available under [http://localhost:4200](http://localhost:4200).

## Troubleshooting

Please refer to this [Troubleshooting guide](#Calendar/guides/integration/angular/troubleshooting.md).

## What to do next?

### Further on integration with Angular

Do you want to know more about how `Bryntum Calendar` integrates with Angular and starts to customize your application?
We provide you with a [complete Angular guide here](#Calendar/guides/integration/angular/guide.md).

### Learn about Data

Bryntum components often use multiple collections and entities.

The [Data guide](#Grid/guides/data/displayingdata.md) guide explains how they all fit together.



<p class="last-modified">Last modified on 2023-08-30 8:52:26</p>