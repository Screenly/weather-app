(function() {

    window.srly = window.srly || {};

    /**
     * Get local data like city, geo locaiton, etc based on IP
     *
     * @param {string} [ip] Required. The ip to base our location.
     * @since 0.0.1
     *
     * @return {XMLHttpRequest}
     */
    window.srly.getLocalData = function(ip) {

        if (!ip)  {
            console.warn('srly.getLocal: IP parameter is required');
            return;
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
        });

        oReq.open('POST', 'http://localhost:5000/v1/location', true);
        oReq.setRequestHeader("Content-type", "application/json; charset=utf-8");
        oReq.send(JSON.stringify({ ip: ip }));

        return oReq;
    };

})();
