# Fetchr Plugin for Fluxible App
[![Build Status](https://travis-ci.org/yahoo/fluxible-plugin-fetchr.svg?branch=master)](https://travis-ci.org/yahoo/fluxible-plugin-fetchr) [![Dependency Status](https://david-dm.org/yahoo/fluxible-plugin-fetchr.svg)](https://david-dm.org/yahoo/fluxible-plugin-fetchr) [![Coverage Status](https://coveralls.io/repos/yahoo/fluxible-plugin-fetchr/badge.png?branch=master)](https://coveralls.io/r/yahoo/fluxible-plugin-fetchr?branch=master)

Provides isomorphic RESTful service access to your [Fluxible application](github.com/yahoo/fluxible-app) using [fetchr](github.com/yahoo/fetchr).

## Usage

```js
var FluxibleApp = require('fluxible-app');
var fetchrPlugin = require('fluxible-plugin-fetchr');
var app = new FluxApplication();

app.plug(fetchrPlugin({
    xhrPath: '/api' // Path for XHR to be served from
}));
```

Now, when calling the `createContext` method on the server, make sure to send in the request object:

```
app.createContext({
    req: req
});
```

## Fluxible Methods Added

### actionContext

 * `actionContext.service.read(resource, params, [config,] callback)`: Call the read method of a service. See [https://github.com/yahoo/fetchr](fetchr docs) for more information.
 * `actionContext.service.create(resource, params, body, [config,] callback)`: Call the create method of a service. See [https://github.com/yahoo/fetchr](fetchr docs) for more information.
 * `actionContext.service.update(resource, params, body, [config,] callback)`: Call the update method of a service. See [https://github.com/yahoo/fetchr](fetchr docs) for more information.
 * `actionContext.service.delete(resource, params, [config,] callback)`: Call the delete method of a service. See [https://github.com/yahoo/fetchr](fetchr docs) for more information.
 * `actionContext.getServiceMeta()`: The plugin will collect metadata for service responses and provide access to it via this method. This will return an array of metadata objects.

## Other Methods

The plugin also provides access to some internals and the options that were passed in.

```
var pluginInstance = fetchrPlugin({
    xhrPath: '/api'
});

pluginInstance.getXhrPath(); // returns '/api'
pluginInstance.getServiceClass(); // returns the fetchr instance used by the plugin
```

## Registering Your Services

Since the fetchr plugin is in control the fetchr class, we expose this through the `getServiceManager` method.

```js
pluginInstance.registerService(yourService);
```

Or if you need to do this from your application without direct access to the plugin

```js
app.getPlugin('FetchrPlugin').registerService(yourService);
```

## Exposing Your Services

Fetchr also contains an express/connect middleware that can be used as your access point from the client.

```js
var server = express();
server.use(pluginInstance.getXhrPath(), pluginInstance.getMiddleware());
```

## License

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/yahoo/fluxible-plugin-fetchr/blob/master/LICENSE.md
