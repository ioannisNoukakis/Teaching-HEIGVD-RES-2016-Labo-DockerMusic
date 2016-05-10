/*
 TODO: faire une exception si pas un instrument passé en paramètre

*/

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

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var s = dgram.createSocket('udp4');

/*
 * Let's define a javascript class for our thermometer. The constructor accepts
 * a location, an initial temperature and the amplitude of temperature variation
 * at every iteration
 */
function Instrument(instrument) {

  /*
   * We will simulate temperature changes on a regular basis. That is something that
   * we implement in a class method (via the prototype)
   */
	Instrument.prototype.update = function() {
	
		var pakage = {
			uuid: uniqueID,
			sound: instrumentToSound.get(instrument)
		};		

		var payload = JSON.stringify(pakage); 

/*
	   * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
	   * the multicast address. All subscribers to this address will receive the message.
	   */
		message = new Buffer(payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("[V1]Sending payload: " + message);
		});

	}

	setInterval(this.update.bind(this), 1000);

}

/*
 * Let's get the thermometer properties from the command line attributes
 * Some error handling wouln't hurt here...
 */
var sound = process.argv[2];

/*
 * Let's create a new thermoter - the regular publication of measures will
 * be initiated within the constructor
 */
var t1 = new Instrument(sound);
