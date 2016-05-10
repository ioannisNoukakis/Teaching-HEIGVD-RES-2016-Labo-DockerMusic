var protocol = require('./instruments-protocol'); 
var uuid = require('node-uuid')

// Generate a v4 (random) id
var uniqueID = uuid.v4();

var instrumentToSound = new Map();
instrumentToSound.set("piano", "ti-ta-ti");
instrumentToSound.set("trumpet", "pouet");
instrumentToSound.set("flute", "trulu");
instrumentToSound.set("violin", "gzi-gzi");
instrumentToSound.set("drum", "boum-boum");

var dgram = require('dgram');

var s = dgram.createSocket('udp4');

/*
class representing a musician
*/
function Instrument(instrument) {

	Instrument.prototype.update = function() {
	
		var pakage = {
			uuid: uniqueID,
			sound: instrumentToSound.get(instrument)
		};		

		var payload = JSON.stringify(pakage);

		message = new Buffer(payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("[V1]Sending payload: " + message);
		});

	}

	setInterval(this.update.bind(this), 1000);

}

if(process.argv.length != 2)
	throw err;
else
	var sound = process.argv[2];


var t1 = new Instrument(sound);
