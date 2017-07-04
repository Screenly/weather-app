<?php
/**
 * Sentry PHP
 *
 * @since 0.0.1
 */
require_once 'lib/sentry-php-master/lib/Raven/Autoloader.php';
Raven_Autoloader::register();
$client = new Raven_Client('https://f74afa387cc249a1a12010e2c476bf38:30609d99ec9040c18f703f455251eaad@sentry.io/187325');
$error_handler = new Raven_ErrorHandler($client);
$error_handler->registerExceptionHandler();
$error_handler->registerErrorHandler();
$error_handler->registerShutdownFunction();



/**
 * Create version for assets
 *
 * @since 0.0.1
 */
$version = '?v=0.0.1';



/**
 * Get current weather conditions
 *
 * @since 0.0.1
 */
require_once 'forecast.php';

$raw  = (object)$forecast->getRaw();
$week = (array)$raw->daily->data;
$today = $week[1];

$geoName = !empty($geoInfo->name) ? $geoInfo->name : null;
if (empty($geoName) && !empty($geoInfo->adminName1)) {
    $geoName = $geoInfo->adminName1;
}
?>
<!DOCTYPE html>
    <html id="app" lang="en_UK" class="bg-day" data-timezone="<?php echo $raw->timezone ?>" data-today="<?php echo $today->time ?>" data-sunset="<?php echo $today->sunsetTime ?>" data-sunrise="<?php echo $today->sunriseTime ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="chrome=1">
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <link href='https://fonts.googleapis.com/css?family=Muli:300|Kanit:600,500,300,200,100' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="assets/css/style.css<?php echo $version?>">
    </head>
    <body>

        <!-- SECTION -->
        <section id="central">
            <div id="current-day" class="left">
                <!-- CURRENT DAY WITH LOCATION & DATE -->
                <div id="location-today" class="scale-font">
                    <?php if (!empty($geoName)) : ?>
                    <span class="location"><?php echo $geoName; ?>, </span>
                    <?php endif; ?>
                    <span class="today"><?php echo date('D j', $today->time);?></span>
                </div>
                <!-- TEMPERATURE - MAX MIN -->
                <div id="temperatures">
                    <h1 id="temp"><?php echo round($condition->getTemperature()); ?><sup>º</sup></h1>
                    <p id="temp-max"><?php echo round($today->apparentTemperatureMax); ?>º<b>high</b></p>
                    <p id="temp-min"><?php echo round($today->apparentTemperatureMin); ?>º<b>low</b></p>
                </div>
                <div id="weather">
                    <i id="icon_current" class="wi wi-forecast-io-<?php echo $raw->hourly->icon ?>"></i>
                    <b><?php echo $raw->currently->summary; ?></b>
                </div>
            </div>

            <!-- NEXT DAYS -->
            <div id="next-days" class="right">
                <ul>
                    <?php for($i=2;$i<=5;$i++): ?>
                    <li>
                        <b><?php echo date('D', $week[$i]->time) ?></b>
                        <b><i class="wi wi-forecast-io-<?php echo $week[$i]->icon ?>"></i></b>
                        <b><?php echo round($week[$i]->temperatureMax) ?>º</b>
                    </li>
                    <?php endfor; ?>
                </ul>
            </div>
        </section>

        <!-- FOOTER -->
        <footer>
            <div class="left">
                <img src="assets/img/screenly-logo-symbol.png<?php echo $version?>" class="logo">
                <span>© <?php echo date('Y');?> Screenly, Inc.</span>
                <span id="app-name">Weather Forecast powered by Dark Sky</span>
            </div>
            <div class="right">
                <span id="footer-clock">00:00</span>
            </div>
        </footer>

        <!-- FRONT-END SCRIPTS -->
        <script src="https://cdn.ravenjs.com/3.16.1/raven.min.js" crossorigin="anonymous"></script>
        <script type="text/javascript">
            Raven.config('https://f74afa387cc249a1a12010e2c476bf38@sentry.io/187325').install();
        </script>
        <script type="text/javascript" src="assets/js/vendors/vendors.js<?php echo $version?>"></script>
        <script type="text/javascript" src="assets/js/app.js<?php echo $version?>"></script>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', 'UA-37846380-1', 'auto');
          ga('send', 'pageview');
        </script>
    </body>
</html>
