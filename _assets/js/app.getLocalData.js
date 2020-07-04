(function() {

    window.srly = window.srly || {};




    /**
     * GLOBAL VARS
     */
     var API_URL = '//weather-backend.srly.io/v1/location';





    /**
     * Get local data like city, geo locaiton, etc based on IP
     *
     * @param {object} [arg] Optional. Object containing either ip or lat and lng
     * variables to base our location. If no argument is suplied an ip autodetect
     * will be used to get location.
     *
     * @since 0.0.1
     *
     * @return {XMLHttpRequest}
     */
    window.srly.getLocalData = function(arg) {

        var param = {};

        if ('lang' in arg) {
            param.lang = arg.lang;
        }

        if ('ip' in arg) {
            param.ip = arg.ip;
            param = JSON.stringify(param);
        } else if ('lat' in arg && 'lng' in arg) {
            if (arg.lat !== '' && arg.lng !== '') {
                param.lat = arg.lat;
                param.lng = arg.lng;
                param = JSON.stringify(param);
            }
        } else {
            param = (Object.keys(param).length > 0) ? JSON.stringify(param) : null;
        }

        var oReq = new XMLHttpRequest();

        oReq.open(param ? 'POST' : 'GET', API_URL);
        oReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
        oReq.send(param);

        return oReq;
    };

})();
