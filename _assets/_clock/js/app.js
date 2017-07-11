(function() {
    /**
     * Month and day names in english,
     *
     * @since 0.0.1
     */

    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"
    ];

    var dayNames = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];



    /**
     * DOM elements
     *
     * @since 0.0.1
     */
    var html = document.querySelector("html");
    var clockDom = document.getElementById('digits');
    var dateDom = document.getElementById('date');



    /**
     * Checktime
     * Changes DOM clock, date and weather the time is "ante meridiem"
     *
     * @since 0.0.1
     */
    function checkTime() {

        var date = new Date();
        var hour = date.getHours();
        var minutes = date.getMinutes();

        clockDom.innerHTML = hour + '<i>:</i>' + (minutes < 10 ? '0' + minutes : minutes);

        dateDom.innerHTML = dayNames[date.getDay()] + ' ' + date.getDate() + ', ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
    }



    checkTime();
    setInterval(checkTime, 1000);
})();
