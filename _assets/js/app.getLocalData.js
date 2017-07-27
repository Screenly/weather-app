(function() {

    window.srly = window.srly || {};




    /**
     * GLOBAL VARS
     */
     var API_URL = '//weather-backend-stage.srly.io/v1';





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
            param = null;
        }

        var oReq = new XMLHttpRequest();

        oReq.addEventListener("progress", function(e) {
            if (!e.lengthComputable) {
                console.warn('srly.getLocal: Unable to compute progress information since the total size is unknown');
            }
        });

        oReq.addEventListener("error", function(e) {
            console.error("srly.getLocal: An error occurred.");
        });

        oReq.addEventListener("abort", function(e) {
            console.warn("srly.getLocal: Transfer canceled by the user.");
        });

        oReq.addEventListener("load", function(e) {
            console.log("srly.getLocal: Transfer complete.");
            console.log(JSON.parse(e.target.response));
        });

        oReq.open(param ? 'POST' : 'GET', API_URL + '/location');
        oReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
        oReq.send(param);

        return oReq;
    };

})();
