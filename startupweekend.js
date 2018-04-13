new (function() {
    var ext = this;
    var alarm_went_off = false; // This becomes true after the alarm goes off

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    /**
     * Coge una frase aleatoria dependiendo del día de semana y hora
     * @returns {string}
     */
    ext.get_phrase = function() {
		// TODO: Debug, completar cuando ya enganche todo
		return "Esto es un texto de prueba, cambiar por texto random";
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['r', 'Consejo Aleatorio', 'get_phrase']
        ]
    };

    // Register the extension
    ScratchExtensions.register('StartupWeekend', descriptor, ext);
})();