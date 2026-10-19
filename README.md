[![Version](https://img.shields.io/github/v/release/Screenly/weather-app)](https://github.com/Screenly/weather-app/releases/latest)

# Screenly Weather App

![Weather App Preview](/screenshots/weather-app-1920x1080.webp)

## Getting Started

```bash
bun install
```

## Deployment

Create and deploy the Edge App:

```bash
screenly edge-app create --name my-weather --in-place
bun run deploy
screenly edge-app instance create
```

### Releasing

Pushes to `main` deploy to stage automatically. To release to production, tag a commit on `main` and push the tag (the workflow refuses tags not on `main`):

```bash
git checkout main && git pull
git tag v26.10.0
git push origin v26.10.0
```

Then publish a GitHub Release whose notes list the pull requests merged since the previous release. Add `--draft` to review the notes before publishing:

```bash
gh release create v26.10.0 --verify-tag --generate-notes --title v26.10.0
```

Use the `vYY.M.PATCH` scheme (e.g. `v26.10.0` for the first release in October 2026, `v26.10.1` for the next one that month).

## Configuration

The app accepts the following settings via `screenly.yml`:

| Setting                  | Description                                                                                                                                                   | Type               | Default |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------- |
| `display_errors`         | For debugging purposes to display errors on the screen.                                                                                                       | optional, advanced | `false` |
| `openweathermap_api_key` | OpenWeatherMap API key to access weather data and location information. Get your API key from the [OpenWeatherMap API](https://openweathermap.org/api)        | required           | -       |
| `override_coordinates`   | Comma-separated coordinates (e.g., `37.8267,-122.4233`) to override device location                                                                           | optional           | -       |
| `override_locale`        | Override the default locale with a supported language code                                                                                                    | optional           | `en`    |
| `override_timezone`      | Override the default timezone with a supported timezone identifier (e.g., `Europe/London`, `America/New_York`). Defaults to the system timezone if left blank | optional           | -       |
| `unit`                   | Measurement unit for temperature display: `auto` (automatically determined based on location), `metric` (Celsius), or `imperial` (Fahrenheit)                 | optional, advanced | `auto`  |

**Note:** When `unit` is set to `auto` (default), temperature units are automatically determined based on the device's location. The following countries use Fahrenheit: United States (US), Bahamas (BS), Cayman Islands (KY), Liberia (LR), Palau (PW), Federated States of Micronesia (FM), and Marshall Islands (MH). All other countries use Celsius.

## Development

```bash
bun install      # Install dependencies
bun run dev      # Start development server
```

## Testing

```bash
bun test
```

## Screenshots

Generate screenshots at all supported resolutions:

```bash
bun run screenshots
```

Screenshots are saved to the `screenshots/` directory.
