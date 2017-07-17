(function() {

    window.srly = window.srly || {};



    /**
     * Searches for the query vars to find specific parameter given.
     *
     * @param {string} [name] Required. The var name to search for.
     * @param {string} [url] Optional. The URL where you want the search to be done.
     * @since 0.0.1
     *
     * @return {string}
     */
    window.srly.getQueryVar = function(name, url) {

        if (!name)  {
            console.warn('srly.getQueryVar: "name" parameter is required');
            return '';
        }

        if (!url) {
            url = window.location.href;
        }

        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);

        if (!results || !results[2]) {
            console.warn('srly.getQueryVar: "' + name + '" parameter not found');
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
})();
