<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
$versionRandom = '?v='.rand(0, 400);

include('lib/forecast.io.php');
$forecast = new ForecastIO('280b615c4a69fe34235855040fd4dccc');

/**
 * GET CURRENT CONDITIONS
 */
$condition = $forecast->getCurrentConditions('38.7130387', '-9.3395638'); // LISBON
$raw  = (object)$forecast->getRaw ();
$week = (array)$raw->daily->data;
$data = $week[0];
?>
<!DOCTYPE html>
    <html id="app" lang="en_UK" class="bg-day" data-sunset="<?php echo $data->sunsetTime ?>" data-sunrise="<?php echo $data->sunriseTime ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="chrome=1">
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <meta name="copyright" content="&copy; <?php echo date ('Y');?>">
        <link href='https://fonts.googleapis.com/css?family=Muli:300,300italic,400,400italic|Kanit:400,700,500,500italic,700italic,400italic,200italic,200,100' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="assets/css/style.css<?php echo $versionRandom;?>">
    </head>
    <body class="">

        <!-- HEADER -->
        <header></header>

        <!-- SECTION -->
        <section id="central">

            <div id="current-day" class="left">

                <!-- LOCATION & DATE -->
                <div id="location-today">
                    <span class="location"><?php echo substr($raw->timezone, strpos($raw->timezone, "/") + 1); ?>.</span> <span class="today">Mon 24</span>
                </div>

                <!-- TEMPERATURE - MAX MIN -->
                <div id="temperatures">
                    <h1 id="temp"><?php echo round($condition->getTemperature()); ?><sup>º</sup></h1>
                    <p id="temp-max"><?php echo round($data->apparentTemperatureMax); ?><sup>º</sup><b>high</b></p>
                    <p id="temp-min"><?php echo round($data->apparentTemperatureMin); ?><sup>º</sup><b>low</b></p>
                </div>

                <div id="weather">
                    <canvas id="icon_current" width="185" height="185" data-icon="<?php echo $raw->hourly->icon ?>"></canvas>
                    <b><?php echo $raw->currently->summary; ?></b>
                </div>
            </div>

            <div id="next-days" class="right">
                <ul>
                    <li><i class="wi wi-wind towards-sse"></i></li>
                    <li><b><?php echo date('D', $week[1]->time) ?></b><b><canvas id="icon_next_1" width="60" height="60" data-icon="<?php echo $week[1]->icon ?>"></canvas></b><b><?php echo round($week[1]->temperatureMax) ?>º</b></li>
                    <li><b><?php echo date('D', $week[2]->time) ?></b><b><canvas id="icon_next_2" width="60" height="60" data-icon="<?php echo $week[2]->icon ?>"></canvas></b><b><?php echo round($week[2]->temperatureMax) ?>º</b></li>
                    <li><b><?php echo date('D', $week[3]->time) ?></b><b><canvas id="icon_next_3" width="60" height="60" data-icon="<?php echo $week[3]->icon ?>"></canvas></b><b><?php echo round($week[3]->temperatureMax) ?>º</b></li>
                    <li><b><?php echo date('D', $week[4]->time) ?></b><b><canvas id="icon_next_4" width="60" height="60" data-icon="<?php echo $week[4]->icon ?>"></canvas></b><b><?php echo round($week[4]->temperatureMax) ?>º</b></li>
                </ul>
                <p id="app-name">Weather Forecast</p>
                <small id="poweredby">Weather data by Forecast.io</small>
            </div>

        </section>

        <!-- FOOTER -->
        <footer>
            <div class="left">
                <img src="assets/svg/screenly-logo-symbol.svg" class="logo" height="70" alt="Screenly App"/>
                <span>Screenly Apps - Weather Forecast. © <?php echo date('Y');?> Screenly, Inc.</span>
            </div>

            <div class="right">
                <span id="footer-clock">13:23</span>
            </div>
        </footer>

        <!-- SCRIPT APP WEATHER -->
        <script type="text/javascript" src="assets/js/vendors/vendors.js<?php echo $versionRandom;?>"></script>
        <script type="text/javascript" src="assets/js/app.js<?php echo $versionRandom;?>"></script>
    </body>
</html>
