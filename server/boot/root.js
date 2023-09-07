// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';


module.exports = function(server) {
/*
  const aedes = require('aedes')();


  const server_ = require('net').createServer(aedes.handle)
  const port = 1883

  aedes.on('subscribe', function (subscriptions, client) {
           
            console.log('MQTT client \x1b[32m' + (client ? client.id : client) + '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
  })
  aedes.on('unsubscribe', function (subscriptions, client) {
            console.log('MQTT client \x1b[32m' + (client ? client.id : client) + '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
  })
  aedes.on('client', function (client) {
          console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })
  aedes.on('clientDisconnect', function (client) {
          console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
  })
  aedes.on('publish', async function (packet, client) {
          console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
  })

  server_.listen(port, function () {
    console.log('server started and listening on port ', port)
  })

  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  //router.get('/', server.loopback.status());
  
 // Install a "/ping" route that returns "pong"
  router.get('/test', function(req, res) {
    
    var packet = {
      qos: 0,
      retain: true,
      topic: 'v1/devices/me/telemetry',
      payload: 'ecco il test'
    }
    res.send(packet);
    
    aedes.publish(packet,function(sent){

    });
    
  
  });

  server.use(router);
  */
};
