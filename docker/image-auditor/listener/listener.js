var musicienTable = new Map();
var soudToInstrument = new Map();
soudToInstrument.set("ti-ta-ti", "piano");
soudToInstrument.set("pouet", "trumpet");
soudToInstrument.set("trulu", "flute");
soudToInstrument.set("gzi-gzi", "violin");
soudToInstrument.set("boum-boum", "drum");

var protocol = require('./instruments-protocol');
var dgram = require('dgram');
var dateFormat = require('dateformat');

/* -------------------------------------------
 * Server use TCP connection  
 */
var net = require('net');
var PORT = 2205;

// create server tcp and return the list of instrument 
var tcpServer = net.createServer(function(socket) { 
  console.log('[CLIENT REQUEST] on :' + socket.remotePort);

  var reply = [];
  musicienTable.forEach(function(inst, clé) {

	var instrumentASerialiser = {
		uuid: clé,
		instrument: soudToInstrument.get(inst.sound),
		activeSince: dateFormat(inst.activeSince, "isoDateTime")
	}
	
	reply.push(instrumentASerialiser);

}, musicienTable)
  var payload = JSON.stringify(reply); 
  socket.write(payload);
  socket.write('\n');
  
  // message when socket close
 socket.on('close', function(data) {
        console.log('[INFO] Connection closed on : ' + socket.remoteAdress + ':' + socket.remotePort);	
  });
  
  // kill socket
  socket.end();
   
}).listen(PORT);

console.log('[INFO] tcpServer started listening on :'+PORT);

/* end server */



/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by musicien 
 */
var s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("[INFO] Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/* 
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {

	try {
		var date = Date.now();
		var tmp = JSON.parse(msg);
		var instrument = {
			uuid: tmp.uuid,
			sound: tmp.sound,
			date: date,
			activeSince: date
		};
		var ancienInstrument = musicienTable.get(instrument.uuid);

		//si l'instrument n'était pas enregistré
		if(ancienInstrument == undefined)
		{
			console.log("[INFO] adding // uuid: " + instrument.uuid + "sound: " + instrument.sound + " source port: " + source.port);
			musicienTable.set(instrument.uuid, instrument);
		}
		else
		{
			ancienInstrument.date = date;
		}	

		musicienTable.forEach(function(inst, clé) {
			if((date - inst.date) > 8000)
			{
				console.log("[INFO] removing // uuid: " + inst.uuid + "sound: " + inst.sound);
				musicienTable.delete(inst.uuid);
			}
		}, musicienTable)
	
	} catch (ex) {
	  console.error(ex);
	}
});

