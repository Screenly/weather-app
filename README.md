# Screenly Weather App

![Weather App Screenshot](https://github.com/Screenly/standalone-app-store/blob/master/_assets/img/app-weather.jpg?raw=true)

This is an example asset for Screenly as part of the [Screenly Playground](https://github.com/Screenly/playground).

You can view the live demo at [weather.srly.io](https://weather.srly.io/).

When running on a Screenly device with [asset metadata enabled](https://github.com/Screenly/playground/blob/master/asset-metadata/README.md), the location will automatically be set. If not, you can [this wizard](https://app-store.srly.io/weather/) to set your location.

## Requirements

Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

```bash
$ npm install -g wrangler
```

Login to Cloudflare

```bash
$ wrangler login
```

Run the project in dev mode

```bash
$ wrangler dev
```

Publish worker

```bash
$ wrangler publish --env [environment name]
```
