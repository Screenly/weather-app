<?php
/**
 * Weather Forecast App for Screenly devices.
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 */


error_reporting(E_ALL);
ini_set('display_errors', 1);



/**
 * Get current location
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 */
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}
$geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$ip"));



/**
 * Get current weather conditions
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 */
include_once 'lib/forecast.io.php';

$forecast = new ForecastIO('280b615c4a69fe34235855040fd4dccc');
$condition = $forecast->getCurrentConditions($geo['geoplugin_latitude'], $geo['geoplugin_longitude']);
$raw  = (object)$forecast->getRaw ();
$week = (array)$raw->daily->data;
$data = $week[0];
date_default_timezone_set($raw->timezone);
?>
<!DOCTYPE html>
    <html id="app" lang="en_UK" class="bg-day" data-sunset="<?php echo $data->sunsetTime ?>" data-sunrise="<?php echo $data->sunriseTime ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="chrome=1">
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <meta name="copyright" content="&copy; <?php echo date ('Y');?>">
        <link href='https://fonts.googleapis.com/css?family=Muli:300|Kanit:500,100' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="assets/css/style.css">
    </head>
    <body >

        <!-- SECTION -->
        <section id="central">
            <div id="current-day" class="left">
                <!-- CURRENT DAY WITH LOCATION & DATE -->
                <div id="location-today">
                    <span class="location"><?php echo preg_replace('/[_]+/', ' ', substr($raw->timezone, strpos($raw->timezone, "/") + 1)); ?>.</span>
                    <span class="today"><?php echo date('D d', $data->time);?></span>
                </div>
                <!-- TEMPERATURE - MAX MIN -->
                <div id="temperatures">
                    <h1 id="temp"><?php echo round($condition->getTemperature()); ?><sup>º</sup></h1>
                    <p id="temp-max"><?php echo round($data->apparentTemperatureMax); ?>º<b>high</b></p>
                    <p id="temp-min"><?php echo round($data->apparentTemperatureMin); ?>º<b>low</b></p>
                </div>
                <div id="weather">
                    <i id="icon_current" class="wi wi-forecast-io-<?php echo $raw->hourly->icon ?>"></i>
                    <b><?php echo $raw->currently->summary; ?></b>
                </div>
            </div>

            <!-- NEXT DAYS -->
            <div id="next-days" class="right">
                <ul>
                    <?php for($i=1;$i<=4;$i++): ?>
                    <li>
                        <b><?php echo date('D', $week[$i]->time) ?></b>
                        <b><i class="wi wi-forecast-io-<?php echo $week[$i]->icon ?>"></i></b>
                        <b><?php echo round($week[$i]->temperatureMax) ?>º</b>
                    </li>
                    <?php endfor; ?>
                </ul>
                <p id="app-name">Weather Forecast</p>
                <small id="poweredby">Weather data by Forecast.io</small>
            </div>
        </section>

        <!-- FOOTER -->
        <footer>
            <div class="left">
                <svg class="logo" width="70" height="70">
                    <image xlink:href="assets/svg/screenly-logo-symbol.svg" src="assets/svg/screenly-logo-symbol.png" width="70" height="70" />
                </svg>
                <span>© <?php echo date('Y');?> Screenly, Inc. Screenly Apps - Weather Forecast.</span>
            </div>
            <div class="right">
                <span id="footer-clock">13:23</span>
            </div>
        </footer>

        <!-- FRONT-END SCRIPTS -->
        <script type="text/javascript" src="assets/js/vendors/vendors.js"></script>
        <script type="text/javascript" src="assets/js/app.js"></script>
    </body>
</html>
