# grunt-tail-wait

> Allows grunt to tail a file and wait for a speciic line before continuing to the next task.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-tail-wait --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-tail-wait');
```

## The "tail_wait" task

### Overview
In your project's Gruntfile, add a section named `tail_wait` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  tail_wait: {

    fileName: 'path/to/your/file.log',  // Required, this is the file to tail.
    regex: 'keyword',                   // Required, this is keyword/phrase you are waiting for.

    timeout: 1    // defaults to 30 seconds,
    lineSeparator // defaults to '\n'
  },
});
``

### Usage Examples

#### Custom Options

In this example, we are tailing a log file to look for a phrase before continuing. Here we are waiting for an application to report that the initialisation is complete.

Once this phrase has been found then grunt will continue to the next task.

```js
grunt.initConfig({
  tail_wait: {

    fileName: path.join('dist/message.log'), // Watch a messages log file
    regex: 'init complete',                  // Wait for the initialisation to complete.

    timeout: 10000 ,      // Wait for 10secs, set in m.,
    lineSeparator: "\r\n" // Use exotic line endings for the tail.
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
