# Screenly Weather App

This app has been built with [Hono](https://github.com/honojs/hono/) for Cloudflare Workers.

## Requirements

Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

```bash
npm install -g wrangler
```

Login to Cloudflare

```bash
wrangler login
```

## Scripts

Run the project in dev mode

```bash
wrangler dev

or

npm run dev
```

Publish worker

```bash
wrangler publish --env [environment name]

or

npm run deploy // Deploy to dev env
```