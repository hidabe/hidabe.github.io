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

    ext.get_phrase = function(count) {
		// TODO: Debug, completar cuando ya enganche todo
		return "Hola caracola";
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['b', 'frase sw', 'get_phrase', '1'],
            ['r', 'frase sw r', 'get_phrase', '1']
        ]
    };

    // Register the extension
    ScratchExtensions.register('StartupWeekend', descriptor, ext);
})();