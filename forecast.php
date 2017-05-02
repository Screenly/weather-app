<?php
/**
 * Weather Forecast App for Screenly devices.
 * 
 * PHP version 5
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
 * Sanitize GEO coordinate
 *
 * @param number $n Latitude or Longitude.
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 * @return   number Ensures that input is a floating number with dot seperation
 *           rather than comma.
 */
function sanitizeLatLng($n)
{
    if (empty($n)) {
        return 0;
    }

    $n = str_replace(',', '.', $n);
    $n = number_format($n, 7);
    return is_numeric($n)? $n : 0;
}




/**
 * Check for any GET vars containing GEO references
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 */
$lat = sanitizeLatLng(isset($_GET['lat'])? $_GET['lat'] : 0);
$lng = sanitizeLatLng(isset($_GET['lng'])? $_GET['lng'] : 0);



/**
 * If no coordinates provided or not complete then get current location by IP.
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 */
if ($lat==0 || $lng==0) {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    $geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$ip"));
    $lat = $geo['geoplugin_latitude'];
    $lng = $geo['geoplugin_longitude'];
}




/**
 * Let's get more detail regarding GEO coordinates. We can use either the
 * [toponymName] for local city or village name or we can jump right to the
 * nearest administration city [adminName1]
 *
 * @param number $lt Latitude.
 * @param number $lg Longitude.
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 *
 * @return json JSON value containing all data. For more info please review
 *         http://api.geonames.org/.
 */
function findNearbyPlaceName($lt, $lg)
{
    if (!empty($lt) && !empty($lg)) {
        $qUrl = "http://api.geonames.org/findNearbyPlaceNameJSON?";
        $qLat = "lat=$lt&";
        $qLng = "lng=$lg&";
        $qUser = "username=petermonte";
        $geoInfo = json_decode(file_get_contents($qUrl . $qLat . $qLng . $qUser));
        if (!empty($geoInfo->geonames[0])) {
            return $geoInfo->geonames[0];
        }
        return $geoInfo;
    }
    return json_encode(['error'=>'@findNearbyPlaceName - Please provide latitude and longitude params']);
}
$geoInfo = findNearbyPlaceName($lat, $lng);
define('LAT', $lat);
define('LNG', $lng);





/**
 * Check for any GET vars containing units.
 *
 * @param string $u Units value can be [auto, ca, uk2, us, si]
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 * @see      https://darksky.net/dev/docs/time-machine Documentation
 *
 * @return string Returns a string holding the unit.
 */
function sanitizeUnit($u)
{
    $u = filter_var($u, FILTER_SANITIZE_STRING);
    if (!empty($u) && in_array($u, ['auto', 'ca', 'uk2', 'us', 'si'])) {
        return $u;
    }
    return 'auto';
}
$units = sanitizeUnit(isset($_GET['units']) ? $_GET['units'] : '');
define('UNITS', $units);





/**
 * Check for any GET vars containing language code.
 *
 * @param string $l Language The country code.
 *
 * @category ScreenlyApps
 * @package  WeatherForecast
 * @author   Original Peter Monte <pmonte@screenly.io>
 * @license  https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html  GPLv2
 * @link     https://github.com/wireload
 * @since    0.0.1
 * @see      https://darksky.net/dev/docs/time-machine Documentation
 *
 * @return string Returns a string holding the language code.
 */
function sanitizeLang($l)
{
    $l = filter_var($l, FILTER_SANITIZE_STRING);
    return !empty($l)? $l : 'en';
}
$lang = sanitizeLang(isset($_GET['lang']) ? $_GET['lang'] : '');
define('LANG', $lang);







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
require_once 'lib/forecast.io.php';
// THE KEY NEEDS TO BE REPLACE WITH A SCREENLY KEY AND REMOVE FROM THIS FILE
$forecast = new ForecastIO('280b615c4a69fe34235855040fd4dccc');
$forecast->setUnits($units);
$forecast->setLanguage($lang);
$condition = $forecast->getCurrentConditions($lat, $lng);
?>
