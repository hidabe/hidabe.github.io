/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

new (function() {
    var ext = this;
    var connected = false;
    var connection;
    var mess_recv = false;
    var speed = 50;  // speed default value.
    var voice = "english"
    var textListen = "";
    var textTouch = "";
    var textFace = "";
    var faceCoord_x = 0;
    var faceCoord_y = 0;

    //    var touch_left = false, touch_right = false;

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.connect = function(ipAddr, port, callback) {
	
	if ('WebSocket' in window){
	    // WebSocket is supported. You can proceed with your code
	    console.log('WEB socket supported');
	    connection = new WebSocket('ws://' + ipAddr + ':' + port);
	    //connection = new WebSocket('ws://127.0.0.1:51717/');
	    connection.onopen = function(){
  		//Send a small message to the console once the connection is established 
		connected= true;			
		console.log('Connection open!');
		connection.send('Hey server, whats up?');
		//	setInterval ( function() { connection.send('get status'); }, 1000 );
		callback();
	    }
	    connection.onmessage = function(e){
		var server_message = e.data;
	
		console.log('server response: ' + server_message);
		if (server_message.startsWith("Text:")) {
		    textListen = server_message.substr(6, server_message.length);
		    textListen = textListen.substr(0, textListen.length);
		    console.log('TEXTLISTEN: ' + textListen);
		}
		if (server_message.startsWith("Touch:")) {
		    textTouch = server_message.substr(7, server_message.length);
		    textTouch = textTouch.substr(0, textTouch.length);
		    console.log('TEXTTOUCH: ' + textTouch);
		}
		if (server_message.startsWith("Face:")) {
		    textFace = server_message.substr(6, server_message.length);
		    var res = textFace.split(",");
		    faceCoord_x = parseInt(res[0]);
		    faceCoord_y = parseInt(res[1]);
		    console.log('faceCoord: ' + faceCoord_x + ',' + faceCoord_y);
		}
	    }
	} 
	else {
	    //WebSockets are not supported. Try a fallback method like long-polling etc
	    connected = false;		
	    console.log('WEB socket NOT supported');
	    callback();	
	}
    };
    
    ext.rotate = function(direction, degrees, callback) {
	// from degrees to position
	var position;
	    
	switch (direction) {
	case 'up':
	    position = parseInt(degrees / 0.29 + 550);
	    connection.send('-c servo -x 2 -a ' + position + ' -s ' + speed);
	    break;
	case 'down':
	    position = parseInt(-degrees / 0.29 + 550);
	    connection.send('-c servo -x 2 -a ' + position + ' -s ' + speed);
	    break;
	case 'left':
	    position = parseInt(-degrees / 0.29 + 511);
	    connection.send('-c servo -x 1 -a ' + position + ' -s ' + speed);
	    break;
	case 'right':
	    position = parseInt(degrees / 0.29 + 511);
	    connection.send('-c servo -x 1 -a ' + position + ' -s ' + speed);
	    break;
	default:
	    break;
	}
	callback();
    };

    ext.relative_movement = function(direction, degrees, callback) {
	// from degrees to position
	var position = parseInt(degrees / 0.29);

	switch (direction) {
	case 'up':
	    connection.send('-c move_rel -x 2 -a ' + position);
	    break;
	case 'down':
	    connection.send('-c move_rel -x 2 -a -' + position);
	    break;
	case 'left':
	    connection.send('-c move_rel -x 1 -a -' + position);
	    break;
	case 'right':
	    connection.send('-c move_rel -x 1 -a ' + position);
	    break;
	default:
	    break;
	}
	callback();
    };

    ext.set_rotate_speed = function(speed_value, callback) {
	speed = speed_value;
	callback();
    };
    
    ext.say = function(text, callback) {
	connection.send('-c say -t "' + text + '"');
	callback();
    };

    ext.nose_color = function(text, callback) {
	connection.send('-c nose -co ' + text);
	callback();
    };
    
    ext.mouthExpression = function(expression, callback) {
	connection.send('-c mouth -e ' + expression);
	console.log('mouth: ' + expression);
	callback();
    };

    ext.futbol1 = function(equipoNombre, callback) {
	var teamNumber = 0;    
	connection.send("-c say -t 'Buscando jugadores de "+equipoNombre+"'");
	if (equipoNombre == "Cordoba") {
		teamNumber = 295;
	} else if (equipoNombre == "Barcelona") {
		teamNumber = 303;
	} else if (equipoNombre == "Madrid") {
		connection.send("-c say -t 'ohhhhh lo siento'");
	}
	$.ajax({
	    beforeSend: function(request) {
		request.setRequestHeader("X-Auth-Token", '8adec10f2e6e49d286550bb0e7307859');
	    },
	    dataType: "json",
	    url: "http://api.football-data.org/v1/teams/"+teamNumber+"/players",
	    success: function(data) {
		connection.send("-c say -t 'He encontrado "+data.count+" jugadores.'");
		for (i = 0; i < data.count; i++) {
			var number = i+1;
			connection.send("-c say -t 'Con el dorsal "+data.players[i].jerseyNumber+": "+data.players[i].name+"'");
		}
	    }
	});
    };
	
    ext.luz = function(colorLuz, brilloLuz, token, callback) {
	   
	connection.send("-c say -t 'el brillo es "+brilloLuz+" y el token es "+token+"'");
	if (colorLuz == "blue") {
		connection.send("-c say -t 'Ok, te lo podré en Azul'");
	} else if (colorLuz == "green") {
		connection.send("-c say -t 'Ok, te lo podré en Verde'");
	} else if (colorLuz == "red") {
		connection.send("-c say -t 'Ok, te lo podré en Rojo'");
	}
	
	brilloLuzReal=brilloLuz--
	
	if ( brilloLuzReal > 0 && brilloLuzReal < 100 ) {
		
		if ( brilloLuzReal > 80 ) {
			connection.send("-c say -t 'Ojo, esto te va a doler'");
		}
	    $.ajax({
	    method:"PUT",
	    data:{ color: colorLuz },
	    beforeSend: function(request) {
		request.setRequestHeader("Authorization", "'Bearer '+token");
	    },
	    url: "https://api.lifx.com/v1/lights/all/state",
	});
		
	} else {
		connection.send("-c say -t 'Pon un valor entre el 1 y el 100'");
	}
	
    };
	
  ext.traducir = function(palabra, idiomaOrigen, idiomaDestino, callback) {
  var teamNumber = 0;    
  connection.send("-c say -t 'Traduciemdo "+palabra+"'");
  $.ajax({
      beforeSend: function(request) {
    request.setRequestHeader("X-Auth-Token", '5c1d825a');
      },
      dataType: "json",
      url: "https://od-api.oxforddictionaries.com:443/api/v1/entries/"+idiomaOrigen+ "/change/translations="+idiomaDestino,
      success: function(data) {
    connection.send("-c say -t 'He encontrado la traduccion "+data.results[0].lexicalEntries[0].senses[0].subsenses[0].translations[0].text,+".'");
      }
  });
    };



    ext.voice = function(text, callback) {
	connection.send('-c voice -l ' + text);
	callback();
    };
    
    ext.is_connected = function(callback) {
	return connected;
    }; 

    ext.when_listen = function(text) {
	if (text == textListen) {
	    textListen = "";
	    return true;
	}
	return false;
    };
    
    ext.when_seeFace = function() {
	if (faceCoord_x != 0 || faceCoord_y != 0) {
	    faceCoord_x = 0;
	    faceCoord_y = 0;
	    console.log("face DETECTED!")
	    return true;
	}
	return false;
    };
    
    ext.is_touch = function(zone) {
	if (textTouch == zone) {
	    textTouch = "";
	    return true;
	}
	
	
	return false;
    };

    
    ext.message_received = function() {
	if (mess_recv) {
	    mess_recv = false;
	    return true;
	}
	return false;
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'Connect ip: %s port: %n', 'connect', 'robot.local', 51717],
	    ['w', 'Say %s', 'say', 'I am connected!'],
	    ['w', 'Nose color: %m.noseColor', 'nose_color', 'red'],
	    ['w', 'Voice: %m.voice', 'voice', 'english'],
	    ['w', 'rotate direction:%m.motorDirection degrees:%nº', 'rotate', 'right', 511],
	    ['w', 'relative movement:%m.motorDirection degrees:%nº', 'relative_movement', 'right', 0],
	    ['w', 'set rotate speed %n', 'set_rotate_speed', 100],
	    ['w', 'Mouth: %m.expression', 'mouthExpression', 'smile'],
	    ['w', 'Jugadores de %m.equipo', 'futbol1', 'Cordoba'],
            ['w', 'Luz de color %m.colorLuz brilloLuz:%n token:%n', 'luz', 'blue', 50, 'TOKEN-HERE'],
	    ['w', 'La palabra %s en el idioma %m.idioma se traduce al %m.idioma', 'traducir', 'Hello'],
	    ['b', 'is connected', 'is_connected'],
	    ['h', 'when touch %m.touchZone', 'is_touch', 'up'],
	    ['h', 'when listen %s', 'when_listen', 'hello'],
	    ['h', 'when see a face', 'when_seeFace'],
	    ['h', 'when message received', 'message_received']
	],
	menus: {
            motorDirection: ['left', 'right', 'up', 'down'],
            touchZone: ['left', 'right', 'up'],
	    noseColor: ['red', 'green', 'blue'],
	    expression: ['smile', 'sad', 'serious', 'love'],
	    voice: ['english', 'spanish'],        	
	    lessMore: ['<', '>'],
            eNe: ['=','not ='],
	    equipo: ['Cordoba', 'Madrid', 'Barcelona'],
	    colorLuz: ['blue', 'green', 'red'],
            idioma: ['es','en','pt']
    	},
    	url: 'https://github.com/LLK/scratchx/wiki#blocks'
    };

    // Register the extension
    ScratchExtensions.register('Robot remote control', descriptor, ext);
})();
