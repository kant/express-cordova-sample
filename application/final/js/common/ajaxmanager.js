(function(mgr, $, undefined) {
    "use strict";

    mgr.common = mgr.common || {};

    mgr.common.AjaxManager = function() {

        var self = this;
        // "http://104.155.45.225/api/";
        self.baseURL = "http://localhost:8080/api/";

        self.ajaxCount = 0;

        self.$indicator = $('#loading-indicator');

        self.initialize();

    };

    // *** public funcs ***
    /**
     * Applique la configuration sur les gestionnaires d'event globaux jquery
     * @method initialize
     */
    mgr.common.AjaxManager.prototype.initialize = function() {
        var me = this;

        // Disable caching of AJAX responses
        // Cross domain
        $.ajaxSetup({
            cache: true,
            crossDomain: true
        });

        // gestion indicateur de chargement
        // plusieurs chargement en parallèle possibles
        $(document).ajaxSend(function(event, request, settings) {
            if (settings.url.indexOf("/api/") !== -1) {
                me.showIndicator.call(me);
            }
        });


        $(document).ajaxComplete(function(event, jqxhr, settings) {
            if (settings.url.indexOf("/api/") !== -1) {
                me.hideIndicator.call(me);
            }

        });

        // gestion des erreurs HTTP
        $(document).ajaxError(function(event, jqxhr, settings, exception) {
            alert('Une erreur http est survenue : ' + exception);
        });
    };

    /**
     * Masque l'indicateur de progès ajax
     * @method hideIndicator
     */
    mgr.common.AjaxManager.prototype.hideIndicator = function() {
        if (this.ajaxCount > 0) {
            this.ajaxCount -= 1;
        }

        // plus aucun appel en cours
        if (this.ajaxCount === 0) {
            this.$indicator.hide();
        }
    };

    /**
     * Affiche l'incidateur de progrès ajax
     * @method showIndicator
     */
    mgr.common.AjaxManager.prototype.showIndicator = function() {
        if (this.ajaxCount === 0) {
            this.$indicator.show();
        }

        this.ajaxCount += 1;
    };

    /**
     * Execute l'appel ajax avec config POST + JSON
     * et retourne l'objet jQuery XMLHttpRequest (jqXHR)
     * @method postJson
     * @param {String} url L'URL de la requète ajax
     * @param {Object} data Les données de la requête Ajax
     */
    mgr.common.AjaxManager.prototype.json = function(url, type, data) {
        var me = this;

        return $.ajax({
            url: this.baseURL + url,
            type: type,
            //timeout: 10000,
            contentType: 'application/json',
            // correction Bug IE8 JSON.stringify
            // to return "" instead of "null" avec IE8! ===> function (k, v) { return v === "" ? "" : v }
            data: JSON.stringify(data, function(k, v) {
                return v === "" ? "" : v;
            })
        });
    };

})(window.mgr = window.mgr || {}, $);