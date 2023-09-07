'use strict';

const { find } = require('async');
const { fusiontables_v2 } = require('googleapis');
var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');
//var mixins = require('../../common/mixins/chilproc.js');
//const { fork } = require('child_process');

module.exports = function(Gateway) {

	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Gateway, methodsToDisplay);

	const myTimeout = setTimeout(startAedes, 10000);

	const controlTimeOutService =  setInterval( controlTimeOut, 180000);
	
    const myTiming = setInterval(serveHandler,1000);

	const mygatewayAlarm = setInterval(findAlarm,20000);

    const myTimingAux = setInterval(serveHandlerAux,500);


	var arrayqueue = [];
	var arrayqueueAux = []	 
	


    async function controlTimeOut(){

		var moment = require('moment'); 
    	var gtws = await Gateway.find();
    	for(var gtw of gtws){
    		

			//console.log("GTW",gtw)
    		
    		var a = moment();//now
			var b = moment(new Date(Number(gtw.reciveddate)));

			var alarm = ''
		
			if(a.diff(b, 'minutes')>10){
				
				await gtw.updateAttributes({nosignal:1});

				if(gtw.emailsent == 0){

			       	sendMail(gtw,null,null);

					console.log("MANDATO MAIL",gtw.name)

				    await Gateway.updateAttributes(gtw.id,{emailsent:1});				        	
				}
				
				
			}
			/*else{
				
				await gtw.updateAttributes({nosignal:0});
				
				if(gtw.emailsent == 0){

			       // sendMail(gtw,null,null);

				    await Gateway.updateAttributes(gtw.id,{emailsent:1});				        	
				}
				
			}*/
			
    	}
    }

	
	function startAedes(){
		const aedes = require('aedes')();
		const server_ = require('net').createServer(aedes.handle)
		const port = 1883
		  aedes.on('subscribe', function (subscriptions, client) {
		    console.log('MQTT client \x1b[32m' + (client ? client.id : client) + '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id)
		  })
		  aedes.on('unsubscribe', function (subscriptions, client) {
		       // console.log('MQTT client \x1b[32m' + (client ? client.id : client) + '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
		  })
		  aedes.on('client', function (client) {
		    	//console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
		  })
		  aedes.on('clientDisconnect', function (client) {
		       // console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
		  })
		  aedes.on('publish', async function (packet, client) {
				//console.log("client",client)
				//console.log("packet",packet)
				if(client){
					var obj = {packet:packet};
	 				console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
	 				arrayqueue.push(obj)
					arrayqueueAux.push(obj)
				}
		  })

		  server_.listen(port, function () {
		    console.log('server started and listening on port ', port)
		  })

	}

	var keymod1 = null;
	var keymod2 = null;

	var gatewayspositionsFinded = null;
	var gpsstep = 0 ;
	var processisfree = true;

	var processalarmisfree = true;

	async function serveHandler(){



				//console.log('START ELABORATING',arrayqueue);

		  		let Company = app.models.Company;
				let Gatewaycompany = app.models.Gatewaycompany;
				let Users = app.models.Users;		
				let Connectors = app.models.Connector;
				let Rele = app.models.Rele;
				let Relevalue = app.models.Relevalue;
				let Sensor = app.models.Sensorvalue;
				let Gatewayspositions = app.models.Gatewayspositions;

				  
				
				if(arrayqueue.length>0 && processisfree) {
					var startTime = performance.now()
					processisfree = false;

					var myobj = arrayqueue[0];
					
					arrayqueue.shift();
					
					var packet = myobj.packet;

					//console.log('packet',packet);
					//console.log('packet',packet.topic , new Date());


			        try{

			        
			        let packettopic = packet.topic


			        let packettopicarray = packettopic.split('/');

			     
			        let gatewaycode = "";

			

					
			        
			        if(packettopicarray[0].indexOf('$')==-1){

						gatewaycode = packettopicarray[0];

						//console.log('GATEWAY', gatewaycode);
			        	
				        let gatewayWithCode = await Gateway.findById(gatewaycode);

				        if(!gatewayWithCode){
				        	let newgateway = {id:gatewaycode,hwversion:'',swversion:'',name:gatewaycode,description:'',val:'',state:'0',error:'',lat:'0',lon:'',email:'',relename:'',receivedate:Date.now(),nosignal:0};
				        	gatewaycode = await Gateway.create(newgateway);
				        }else{
				        	await gatewayWithCode.updateAttributes({reciveddate:Date.now(),emailsent:0,nosignal:0})
				        }

				        var obj = JSON.parse(packet.payload.toString());
						
						var result = null;


						//console.log("packettopicarray[1]",gatewaycode +' '+ packettopicarray[1])


				        
				        if(packettopicarray[1] == 'HWVER'){
				        	result = await gatewayWithCode.updateAttributes({hwversion:obj.ver});
				        }
				        
				        if(packettopicarray[1] == 'SWVER'){
				        	
				        	result = await gatewayWithCode.updateAttributes({swversion:obj.ver});
				        }

				        if(packettopicarray[1] == 'ID1'){
				        	
				        	var key = Object.keys(obj)[0];

				        	//console.log(key);
				        	
				        	
				        	var companyFinded = await Company.find({where:{vatnumber:key}});
				        	//console.log('companyFinded',companyFinded);
				        	if(companyFinded.length == 0){
				        		var obj = {name:key,description:'',address:'',vatnumber:key,companytypeId:3}
				        		companyFinded = await Company.create([obj]);
				        	}	

				        	if(companyFinded.length>0) {
					        	var companyGatewayFinded = await Gatewaycompany.find({where:{gatewayId:gatewaycode}});
					        	//console.log('companyGatewayFinded',companyGatewayFinded);
					        	if(companyGatewayFinded.length == 0){
					        		var obj = {companyId:companyFinded[0].id,gatewayId:gatewaycode}
					        		companyGatewayFinded = await Gatewaycompany.create([obj]);
					        	}else{
					        		companyGatewayFinded[0].updateAttributes({companyId:companyFinded[0].id});
					        	}		
				        	}

				        }

				        if(packettopicarray[1] == 'ID2'){
				        	
				        	var key = Object.keys(obj)[0];

				        	//console.log('key2',key);
				        	
				        	
				        	var companyFinded = await Company.find({where:{vatnumber:key}});
				        	//console.log('companyFinded',companyFinded);
				        	if(companyFinded.length == 0){
				        		var obj = {name:key,description:'',address:'',vatnumber:key,companytypeId:2}
				        		companyFinded = await Company.create([obj]);
				        	}	

				        	if(companyFinded.length>0) {
				        		//console.log('installationcompanyFinded',companyFinded[0].id);
					        	var companyGatewayFinded = await Gatewaycompany.find({where:{gatewayId:gatewaycode}});

					        	//console.log('companyGatewayFinded2',companyGatewayFinded);
					        	if(companyGatewayFinded.length == 0){
					        		var obj = {installationcompanyId:companyFinded[0].id,gatewayId:gatewaycode}
					        		companyGatewayFinded = await Gatewaycompany.create([obj]);
					        	}else{
					        		companyGatewayFinded[0].updateAttributes({installationcompanyId:companyFinded[0].id});
					        	}	
				        	}



				        }


				        if(packettopicarray[1] == 'VAL'){
				        	var key = Object.keys(obj)[0];
				        
				        	result = await gatewayWithCode.updateAttributes({volt:key});	
				        	
				        	let newsensor = {code:gatewaycode,value:key,reciveddate:Date.now(),creationdate:Date.now(),connectorId:"",sensortypeId:4};
						    let sensorWithCode = await Sensor.create(newsensor);


				        	
				        }

				        /*if(packettopicarray[1] == 'AUX'){
				        	
				        	var key = Object.keys(obj)[0];

				        	console.log("SONO IN AUX",gatewaycode)
				        	
				        	var releExists = await Rele.find({where:{and:[{code:'AUX'},{gatewayId:gatewaycode}]}});
				        	
				        	if(releExists.length==0){
								releExists = await Rele.create([{name:'AUX',description:'Stato ausiliaria',code:'AUX',gatewayId:gatewaycode}]);
				        	}

				     
				        	let relevalue = {value:key,reciveddate:Date.now(),creationdate:Date.now(),releId:releExists[0].id};
						    let releWithCode = await Relevalue.create(relevalue);

				        }*/
						
	 				
				        if(packettopicarray[1] == 'GPS'){

							//console.log("GPS",packettopicarray[1])

							//console.log("GPS POSIZIOE",packettopicarray[2])
							
				        	if(packettopicarray[2] == 'POS'){

								//console.log("GPS POSIZIOE",packettopicarray[2])
				        	
								var key = Object.keys(obj)[0];
								var keysplitted =  key.split('_');

								var latitude =  keysplitted[0];
								var longitude =  keysplitted[1];
								var altitude =  keysplitted[2];
								var sat =  keysplitted[3];
								var speed = keysplitted[4];

								//console.log("latitude",latitude)

								//console.log("longitude",longitude)

								if(speed < 3){

									speed = 0 
								}

								
								var oldGateway = await Gatewayspositions.find({where:{gatewayId:gatewaycode},order: 'reciveddate DESC',limit:1})
								if(oldGateway.length > 0){
									var oldlat = oldGateway[0].latitude;
									var oldlng = oldGateway[0].longitude;
								
									var distance = await Gatewayspositions.distance(oldlat,oldlng,latitude,longitude,'K');
								}else{
									var distance = 0
								}
								

	 							var obj = {gatewayId:gatewaycode,latitude:latitude,longitude:longitude,sat:sat,reciveddate:Date.now(),altitude:altitude,speed:speed,distance:distance*1000};

								var gatewayspositionsFinded = await Gatewayspositions.create(obj);

								//console.log("gatewayspositionsFinded",gatewayspositionsFinded)

							}

				        
				        }


				        if(packettopicarray[1].indexOf('CON')==0){   

				        		//console.log('CON', packettopicarray[1]);

								//console.log('SSSSS', packettopicarray[2]);

								//console.log('GATEWAY', gatewaycode);


				        		var connectorId  = packettopicarray[1];
	 							let connectorWithCode = await Connectors.findById(connectorId);

						        if(!connectorWithCode){
						        	let newconnector = {id:connectorId,hwversion:'',swversion:'',macaddress:'',gatewayId:gatewaycode,name:connectorId};
						        	connectorWithCode = await Connectors.create(newconnector);
						        }

								
							
				        		if(packettopicarray[2].indexOf('S')==0){



								 	var key = Object.keys(obj)[0];
									var keysplitted =  key.split('_');
									
									var ts1 =  keysplitted[0];
									
									var sensortypeId = -1;
									var sensortypeId1 = -1;

									var mod1 =  keysplitted[1];
									var mod2 =  keysplitted[2];

									//console.log("ts1",ts1)

									//console.log("mod1",mod1)

									if(ts1 == 'I2C'){

										if(mod1 == 'TH1'){
			        						sensortypeId = 1;
			        						sensortypeId1 = 2;
				        				}
				        				
				        				if(mod1 == 'GA1'){
				        					sensortypeId = 6;

				        					sensortypeId1 = 7;
				        				}

				        				if(mod1 == 'LC1'){
				        					sensortypeId = 8;

				        					keysplitted[3] = Number(keysplitted[3]) / 1000

				        					keysplitted[3] = keysplitted[3].toString()

				        					//console.log("BILANCIA", keysplitted[3])
				        					
				        				}

									}

									if(ts1 == 'ADC'){

										if(mod1 == 'NT1'){
				        					sensortypeId = 1;
				        				}

									}									

 
								
									var val1 =  keysplitted[3];
									val1 = val1.replace(/\s/g,'')
									
									var val2 = keysplitted[4];
									val2 = val2.replace(/\s/g,'')

									var code1 =  packettopicarray[2] + '1';
									var code2 = packettopicarray[2] + '2'

									
									let newsensor = {code:code1,sensortypeId:sensortypeId,value:val1,reciveddate:Date.now(),creationdate:Date.now(),connectorId:packettopicarray[1],state:keysplitted[5]};
						        	
								
						        	let sensorWithCode = await Sensor.create(newsensor);

						        	if(ts1 == 'I2C'){

							        	let newsensor1 = {code:code2,sensortypeId:sensortypeId1,value:val2,reciveddate:Date.now(),creationdate:Date.now(),connectorId:packettopicarray[1],state:keysplitted[5]};
							        

							        	let sensorWithCode2 = await Sensor.create(newsensor1);

							        }

				        			
				        		}


				        }

						
				    }
 					processisfree = true;
					 var endTime = performance.now()
					 var timtotal = (endTime - startTime)/1000
					 console.log(`STOP ELABORATING WITH OK in ${timtotal.toFixed(2)} seconds`)
					 console.log('REMAINING QUEUE=>',arrayqueue.length)
					//console.log('STOP ELABORATING WITH OK');

			        }catch(ex){
 					    processisfree = true;
						console.log('STOP ELABORATING WITH KO');
			        	console.log('Errore =>',ex);

			        }
		        }

	}


	async function serveHandlerAux(){

		  		let Company = app.models.Company;
				let Gatewaycompany = app.models.Gatewaycompany;
				let Users = app.models.Users;		
				let Connectors = app.models.Connector;
				let Rele = app.models.Rele;
				let Relevalue = app.models.Relevalue;
				let Sensor = app.models.Sensorvalue;
				let Gatewayspositions = app.models.Gatewayspositions;				
				
				if(arrayqueueAux.length>0) {


					var myobj = arrayqueueAux[0];

					var packet = myobj.packet;

			        try{

			        
			        let packettopic = packet.topic


			        let packettopicarray = packettopic.split('/');

			     
			        let gatewaycode = "";

					
			        
			        if(packettopicarray[0].indexOf('$')==-1){

						gatewaycode = packettopicarray[0];
			        	
				        let gatewayWithCode = await Gateway.findById(gatewaycode);

				        if(!gatewayWithCode){
				        	let newgateway = {id:gatewaycode,hwversion:'',swversion:'',name:gatewaycode,description:'',val:'',state:'0',error:'',lat:'0',lon:'',email:'',relename:'',receivedate:Date.now(),nosignal:0};
				        	gatewaycode = await Gateway.create(newgateway);
				        }else{
				        	await gatewayWithCode.updateAttributes({reciveddate:Date.now()})
				        }

				        var obj = JSON.parse(packet.payload.toString());				       
						
						var result = null;

						//console.log("packettopicarray[1]",packettopicarray[1])

						if(packettopicarray[1] == 'AUX'){


				        	
				        	var key = Object.keys(obj)[0];				        	
				        	
				        	var releExists = await Rele.find({where:{and:[{code:'AUX'},{gatewayId:gatewaycode}]}});
				        	
				        	if(releExists.length==0){
								releExists = await Rele.create([{name:'AUX',description:'Stato ausiliaria',code:'AUX',gatewayId:gatewaycode}]);
				        	}

							//console.log("CAMBIATO STATO AUX ATEWAY")
				     
				        	let relevalue = {value:key,reciveddate:Date.now(),creationdate:Date.now(),releId:releExists[0].id};
						    let releWithCode = await Relevalue.create(relevalue);

				        }


				        if(packettopicarray[1].indexOf('CON')==0){ 				        		

				        		var connectorId  = packettopicarray[1];
	 							let connectorWithCode = await Connectors.findById(connectorId);

						        if(!connectorWithCode){
						        	let newconnector = {id:connectorId,hwversion:'',swversion:'',macaddress:'',gatewayId:gatewaycode,name:connectorId};
						        	connectorWithCode = await Connectors.create(newconnector);
						        }								
							
				        		if(packettopicarray[2].indexOf('AUX')==0){				        			

								 	var key = Object.keys(obj)[0];
						        	
						        	var releExists = await Rele.find({where:{and:[{code:'AUX'+connectorId},{connectorId:connectorId}]}});
						        	
						        	if(releExists.length==0){
										releExists = await Rele.create([{name:'AUX'+'-'+connectorId,description:'Stato ausiliaria',code:'AUX'+connectorId,connectorId:connectorId}]);
						        	}

						     
						        	let relevalue = {value:key,reciveddate:Date.now(),creationdate:Date.now(),releId:releExists[0].id};
								    let releWithCode = await Relevalue.create(relevalue);

				        			
				        		}


				        }

						
				    }
					arrayqueueAux.shift();


					var a =  Gateway.findAlarmAux();
			       
				

			        }catch(ex){
						arrayqueueAux.shift();
			        	//console.log('ex',ex);

			        }
		        }

	}

	async function findAlarm () {
		
		var array = [];

		//console.log('wantservealarm',new Date());
		//console.log('stateofqueue',processalarmisfree);

		if(processalarmisfree){
			
			//console.log('startedforalarm',new Date());
	
		    processalarmisfree = false

			let Company = app.models.Company;

			let Gatewaycompany = app.models.Gatewaycompany;

			let Sensorvaluelimit = app.models.Sensorvaluelimit;

			let Sensorvaluelimitrele = app.models.Sensorvaluelimitrele;

			let Gatewayradius = app.models.Gatewayradius;

			var gateways = await Gateway.find();

			
			for(var g of gateways){

				var companyGatewayFinded = await Gatewaycompany.find({where:{gatewayId:g.id}});
				
				var companies = [];	

				for(var cgf of companyGatewayFinded){
					
					var company = await Company.findById(cgf.companyId);
					companies.push(company);

				}


				var gwd = await Gateway.find_(g.id);


				//console.log('gwd',gwd);

				if(gwd.voltsensor.length >0){
						//console.log(' TEST INVIO 2',gwd.voltsensor[0].hasOwnProperty('sensorvaluelimits'))
					if(gwd.voltsensor[0].hasOwnProperty('sensorvaluelimits')==true){
						
						if(gwd.voltsensor[0].sensorvaluelimits){


							if(gwd.voltsensor[0].hasOwnProperty('sensorvaluelimits')==true){

								if(gwd.voltsensor[0].sensorvaluelimits.hasOwnProperty('hasalarm')==true){

									if(gwd.voltsensor[0].sensorvaluelimits.hasalarm==true){
										if(gwd.voltsensor[0].sensorvaluelimits.emailsent==0){
											//console.log("SONO DENTRO ALLARME VOLT")
											var alarm = {sensorvalue:gwd.voltsensor[0].value,sensortype:gwd.voltsensor[0].sensortype}
											sendMail(gwd,companies,alarm);
											await Sensorvaluelimit.updateAttributes(gwd.voltsensor[0].sensorvaluelimits.id,{emailsent:1});
										}
									
									}
								}

							}
						}
					}

					// quando la data di ricezione segnale gateway è 9 min inferiore all'attuale
					/*
					var today = Math.floor(Date.now() / 1000)

			        var reciveddate = Math.floor(gwd.reciveddate / 1000)			       

			        var calculate = today - reciveddate

			        var mindiff = ((calculate / 60000) *1000)			               

			        if(mindiff >= 9){			        	

			        	if(gwd.emailsent == 0){

			        		//sendMail(g,companies,alarm);

				        	//await Gateway.updateAttributes(gwd.id,{emailsent:1});				        	
				        }

			        }

			        if(mindiff < 9){

			        	if(gwd.emailsent == 1){

			        		//await Gateway.updateAttributes(gwd.id,{emailsent:0});	
			        	}

			        }
					*/
			       
					
				}



				for (var r of gwd.rele){

					if(r['sensorvaluelimits']){

						if(r.sensorvaluelimits.emailsent==0){
							
							if(r.sensorvaluelimits.hasalarm){

								var alarm = {sensorvalue:r.relevalues[0].value,sensortype:r.sensortype};

								sendMail(gwd,companies,alarm);

								await Sensorvaluelimit.updateAttributes(r.sensorvaluelimits.id,{emailsent:1});	

							}

						}
					}

				}
			
				for(var c of gwd.connectors){
						
					for(var s of c.sensorvalues	){
							
						for(var svl of s.sensorvaluelimits	){

							if(svl.hasalarm){

								if(svl.emailsent==0){
									var alarm = {sensorvalue:s.value,sensortype:s.sensortype}

									sendMail(gwd,companies,alarm);

									await Sensorvaluelimit.updateAttributes(svl.id,{emailsent:1});	

								}
							
								

							}
						}
							
					}
				}

				for(var gr of gwd.gatewayradius){

					if(gr.emailsent==0){

						if(gr.hasalarm){

							var name = ''
							var value = ''

							if(gr.radiustype=='A'){
								name = ' GPS Area di allarme '
								value = 'Fuori dalla zona indicata'
							}


							if(gr.radiustype=='V'){
								name = ' GPS Area vietata '
								value = 'Dentro area vietata'
							}

							var sensortype = {name:name,unitmeasure:''};


							var alarm = {sensorvalue:value,sensortype:sensortype}

							sendMail(gwd,companies,alarm);

							await Gatewayradius.updateAttributes(gr.id,{emailsent:1})

						
						}

					}
				}

			}
			console.log('stoppedforalarm',new Date());
			processalarmisfree = true;
		}

		return array;
	}



	Gateway.findAlarmAux = async()  => {

		    


			let Company = app.models.Company;

			let Gatewaycompany = app.models.Gatewaycompany;

			let Sensorvaluelimit = app.models.Sensorvaluelimit;

			let Sensorvaluelimitrele = app.models.Sensorvaluelimitrele;


			let Gatewayradius = app.models.Gatewayradius;

			var gateways = await Gateway.find();

			var array = [];

			for(var g of gateways){

				var companyGatewayFinded = await Gatewaycompany.find({where:{gatewayId:g.id}});
				
				var companies = [];	

				for(var cgf of companyGatewayFinded){
					
					var company = await Company.findById(cgf.companyId);
					companies.push(company);

				}


				var gwd = await Gateway.find_(g.id);			



				for (var r of gwd.rele){

					//console.log("Rrrrrrrrr",r)

					if(r['sensorvaluelimits']){

						if(r.sensorvaluelimits.emailsent==0){
							
							if(r.sensorvaluelimits.hasalarm){

								var alarm = {sensorvalue:r.relevalues[0].value,sensortype:r.sensortype};

								sendMail(r,companies,alarm);

								await Sensorvaluelimit.updateAttributes(r.sensorvaluelimits.id,{emailsent:1});	

							}

						}
					}

				}	

				

			}

			return array;
	}
	Gateway.remoteMethod(
		'findAlarmAux', {
		  http: {
		    path: '/findAlarmAux',
		    verb: 'get'
		  },
		  returns: {arg: 'results',type: ['object']},
		  description: "Find Gateway with companytype"
	});



	function sendMail(g,companies,alarm){

		console.log("SEND MAIL GATEWAY",g)
		
		
		var html = ''

		if(alarm==null){

			html = 'Attenzione il gateway '  + g.name + ' non comunica da almeno 10 minuti';
		
		}else{
		
			html = 'Attenzione <br> Dispositivo ' + g.name +  ' in allarme. E scattato allarme relativo al sensore: '+ alarm.sensortype.name +' Il valore rilevato è ' + alarm.sensorvalue + ' ' + alarm.sensortype.unitmeasure  +'<br> Nascondi testo citato. <br> Accedi alla tua console per verificare lo stato degli allarmi.'
		
		}

		
		var subject = 'Attenzione <br> Dispositivo ' + g.name +  'in allarme';

		var emailto = "";
		
		if(g.email){
			emailto += g.email
		}
			
		if(g.secondmail){
			emailto =  emailto + ";" + g.secondmail
		}
			

		if(companies){
			for(var c of companies){
				if(c.email){
					emailto = emailto  + ";" + c.email;
				}
			}
		}

		


		var email = {to:emailto,from:'alarm@taaak.it',subject:subject,html:html}

		
		
		
		app.models.Email.send(email,function(email_sent){
			
			console.log('email_sent',email_sent);
			
		});

	}



	Gateway.find_ = async (id) => {		

	    //console.log("ID GTW",id)	
		var Sensorvaluelimitrele = app.models.Sensorvaluelimitrele
		var Sensorvaluelimit = app.models.Sensorvaluelimit
		var Sensortype = app.models.Sensortype
		var Sensorvalue = app.models.Sensorvalue
		var Relevalue = app.models.Relevalue
		var Sensorcustomname = app.models.Sensorcustomname
		try	{	
			var gateways = await Gateway.findById(id,{
				include:[{
					relation:"connectors",
					scope:{
						include:[{
							relation:"sensorvalues",	                    			
								scope:{			                    			
									limit:300,	
									order: 'reciveddate DESC',                    			
									include:[{
										relation:"sensortype"
									}]
								},
							
						},{relation:'rele',
							scope:{
								include:[{
									relation:"relevalues",
									scope: {									     
										limit:300,
										order: 'reciveddate DESC',
									}
								}]
							}
						}]
					},
					
				},
				{
					relation:'gatewayspositions',
				},
				{
					relation:'gatewayradius'
				},
				{
					relation:'rele',
					scope:{
						include:[{
							relation:"relevalues",
							scope: {							      
								limit:300,
								order: 'reciveddate DESC',
							}
						}]
					},
				}]
			})

	        var gtw = JSON.parse(JSON.stringify(gateways))
	        // array di allarmi 
	        var listofalarms = []
	        // Allarme per voltaggio GATEWAY
	        var sensvolt = await Sensorvalue.find({where:{and:[{code:gtw.id}]},order: 'reciveddate DESC',limit:1})
	        for (var gr of gtw.gatewayradius){
				const circle = {
					name: gr.id.toString(),
					center: {
						// FLOAT NUMER 00.00000
						latitude:gr.latitude,
						// FLOAT NUMBER 00.00000
						longitude: gr.longitude,
					},
					// THIS IS METERS OUT FROM THE CENTER POINT
					radius: gr.radius
				}
	        	var actualposition = gtw.gatewayspositions[gtw.gatewayspositions.length-1]; 
	        	const check = pointInsideCircle({
  					latitude: actualposition.latitude,
  					longitude: actualposition.longitude
				},circle);
	        	if(gr.radiustype=='A'){
	        		if(!check){
	        			gr['hasalarm'] = true;
	        		}
	        	}
	        	if(gr.radiustype=='V'){
					if(check){
						gr['hasalarm'] = true;
	        		}
	        	}
	        }
	        //console.log("sensvolt",sensvolt)
	        gtw['voltsensor'] = []
	        gtw['hasalarm'] = false
	        if(sensvolt.length > 0){
	        	    var senvolttype = await Sensortype.find({where:{id:sensvolt[0].sensortypeId}})	       
			        var sensvoltlimits = await Sensorvaluelimit.find({where:{code:'VOLT'+gtw.id}})
			        var voltobj = {sensorvaluelimits:sensvoltlimits[0],sensortype:senvolttype[0],value:sensvolt[0].value,code:'VOLT'+gtw.id,lastsignal:sensvolt[0].reciveddate}
			        gtw.voltsensor.push(voltobj)
			        // se c'è un allarme sul voltaggio impostato 
			        if(sensvoltlimits.length >0){
			        	sensvoltlimits[0]['unitmeasure'] = 'Volt'
			        	sensvoltlimits[0]['sensortype'] = senvolttype[0].name
			        	//console.log("SONO NEL VOLTAGGIO")
			        	if(sensvoltlimits[0].min && sensvoltlimits[0].max){	
			        		//console.log("Number(sensvolt[0].value",Number(sensvolt[0].value))					
							if(Number(sensvolt[0].value) < Number(sensvoltlimits[0].min) || Number(sensvolt[0].value) > Number(sensvoltlimits[0].max) ){										
								sensvoltlimits[0]['hasalarm'] = true
							}else{
								sensvoltlimits[0]['hasalarm'] = false

								await Sensorvaluelimit.updateAttributes(sensvoltlimits[0].id,{emailsent:0});
							}
						}
			        	listofalarms.push(sensvoltlimits[0])
			        }

			        // se l'ultimo segnale è piu vecchio di 9 minuti non è connesso
			       /* var today = Math.floor(Date.now() / 1000)
			        var reciveddate = Math.floor(gtw.voltsensor[0].lastsignal / 1000)
			        //console.log("reciveddate",reciveddate)
			        var calculate = today - reciveddate
			        var mindiff = ((calculate / 60000) *1000)
			        //console.log("mindiff",mindiff)
			        //console.log("today",today)
			        //console.log("")
			        if(mindiff >= 3){
			        	//gtw.nosignal = true
			        }*/
	        }
	        // ALLARMI RELè
			for (var r of gtw.rele){
				var senvalire = await Sensorvaluelimitrele.find({where:{releId:r.id}})	
				var sentype = await Sensortype.find({where:{id:3}})			
				if(senvalire.length > 0){
					for(var s of senvalire){					
						var senslim = await Sensorvaluelimit.find({where:{id:s.sensorvaluelimitsId}})
					}
					//console.log("senslim",senslim)
					r['sensorvaluelimits'] = JSON.parse(JSON.stringify(senslim[0]));	
					r['sensortype'] = sentype[0]
					// inserisco nella lista allarmi 
					if(r.code == r.sensorvaluelimits.code){
						if(r.relevalues[0].value == r.sensorvaluelimits.value){
							//console.log("SONO NEL RELE")
							r.sensorvaluelimits['connector'] = r.name
							r.sensorvaluelimits['hasalarm'] = true
							r.sensorvaluelimits['sensortype'] = gtw.relename
						}else{
							r.sensorvaluelimits['connector'] = r.name
							r.sensorvaluelimits['hasalarm'] = false
							r.sensorvaluelimits['sensortype'] = gtw.relename
							await Sensorvaluelimit.updateAttributes(r.sensorvaluelimits.id,{emailsent:0});
						}
						listofalarms.push(r.sensorvaluelimits)	
					}
				}		
			}
			// valore sensore univoci per ogni connettore
			for(var c of gtw.connectors){
				//console.log("CCCCCC",c)
				var newsenval = []
				for(var se of c.sensorvalues){
					se['background'] = 'red'
					if(se.state==0){
						se['background'] = 'green'
					}
					//console.log("SE",se.sensortype)
					var finded = false	
					var checkcustomname = await Sensorcustomname.find({where:{and:[{gatewayId:gtw.id},{connectorId:c.id},{sensortypeId:se.sensortypeId}]}})
					//console.log("checkcustomname",checkcustomname)
					if(checkcustomname.length > 0 && checkcustomname[0].sensortypeId == se.sensortypeId){
						//console.log("se.sensortype",se.sensortype)
						se.sensortype['name'] = checkcustomname[0].name
					}
					for(var nval of newsenval){	
						//if(nval.sensortypeId == se.sensortypeId ){					
						if(nval.code == se.code ){							
							finded = true;
						}
					}
					if(!finded){
						newsenval.push(se)
					}
					//console.log("newsenval",newsenval)
					var ccc= c.id+'_'+se.code;
					//console.log("ccc",ccc)
					// relazione con i limiti sensore impostati in base al code
					var senslim_ = await Sensorvaluelimit.find({where:{code:c.id+'_'+se.code+'_'+se.sensortypeId}})
					//console.log("senslim_",senslim_)	
					se['sensorvaluelimits'] = senslim_
					var findedVal = false
					// metto in piano sul gateway tutti gli allarmi settati con tipo sensore e nome connettore
					for (var senfi of senslim_){
						senfi['connector'] = c.name
						senfi['sensortype'] = se.sensortype.name
						senfi['unitmeasure'] = se.sensortype.unitmeasure
						for(var val of newsenval){							
							var newsenficode = senfi.code.split('_')
							//console.log("VAL",val)	
							//console.log("newsenficode[2]",newsenficode)						
							if(val.code == newsenficode[1] && val.connectorId == newsenficode[0] && val.sensortypeId == newsenficode[2]){																				
								if(senfi.min && senfi.max){						
									if(Number(val.value) <= Number(senfi.min) || Number(val.value) >= Number(senfi.max) ){										
										senfi['hasalarm'] = true
									}else{
										senfi['hasalarm'] = false

										await Sensorvaluelimit.updateAttributes(senfi.id,{emailsent:0});
									}
								}
								if(senfi.min == null && senfi.max){															
									if(Number(val.value) >= Number(senfi.max) ){
										senfi['hasalarm'] = true
									}else{
										senfi['hasalarm'] = false

										await Sensorvaluelimit.updateAttributes(senfi.id,{emailsent:0});
									}
								}
								if(senfi.min == null && senfi.max == null){	
									var conversionvalue = null
									if(val.value == '0'){
										conversionvalue = false
									}
									if(val.value == '1'){
										conversionvalue = true
									}
									if(conversionvalue == senfi.value ){
										senfi['hasalarm'] = true
									}else{
										senfi['hasalarm'] = false
										await Sensorvaluelimit.updateAttributes(senfi.id,{emailsent:0});										
									}
								}
								if(senfi.min && senfi.max == null){	
									if(Number(val.value) < Number(senfi.min) ){
										senfi['hasalarm'] = true
									}else{
										senfi['hasalarm'] = false

										await Sensorvaluelimit.updateAttributes(senfi.id,{emailsent:0});
									}
								}
							}
						}
						for(var la of listofalarms){
							//console.log("LA",la.code)
							//console.log("SENFI CODE",senfi.code)
							if(senfi.code == la.code){
								findedVal = true
							}
							if(la.hasalarm == true){
								gtw.hasalarm = true
							}
							//console.log("LA",la)
						}
						if(!findedVal){
							listofalarms.push(senfi)
						}
					}
				}
				if(c.rele.length >0){
					for(var r of c.rele){
						var senvalire = await Sensorvaluelimitrele.find({where:{releId:r.id}})	
						var sentype = await Sensortype.find({where:{id:3}})			
						if(senvalire.length > 0){
							for(var s of senvalire){					
								var senslim = await Sensorvaluelimit.find({where:{id:s.sensorvaluelimitsId}})
							}
							//console.log("senslim",senslim)
							r['sensorvaluelimits'] = JSON.parse(JSON.stringify(senslim[0]));	
							r['sensortype'] = sentype[0]
							// inserisco nella lista allarmi 
							if(r.code == r.sensorvaluelimits.code){
								if(r.relevalues[0].value == r.sensorvaluelimits.value){
									//console.log("SONO NEL RELE")
									r.sensorvaluelimits['connector'] = r.name
									r.sensorvaluelimits['hasalarm'] = true
									r.sensorvaluelimits['sensortype'] = gtw.relename
								}else{
									r.sensorvaluelimits['connector'] = r.name
									r.sensorvaluelimits['hasalarm'] = false
									r.sensorvaluelimits['sensortype'] = gtw.relename
									await Sensorvaluelimit.updateAttributes(r.sensorvaluelimits.id,{emailsent:0});
								}
								listofalarms.push(r.sensorvaluelimits)	
							}
						}
						gtw.rele.push(r)
					}
				}
				c.sensorvalues = newsenval
			}
			gtw['listofalarms'] = listofalarms
			return gtw;
		}
		catch(results) {
			throw(results);
		}
	};
	Gateway.remoteMethod(
		'find_', {
		  http: {
		    path: '/find_',
		    verb: 'get'
		  },
		  accepts: {arg: 'id', type: 'string',require:false, description:"Gateway find ",root:true},
		  returns: {arg: 'results',type: 'Gateway'},
		  description: "Find Gateway with companytype"
	});





	Gateway.updateAttributes = async (id,properties) => {
   	    let results;
   	    try
   	    {
			var gateway = await Gateway.findById(id);
			if(gateway) {
				var updated = await gateway.updateAttributes(properties)
				results = updated;
				return results;	
			}else{
				throw new Error('Tipo di Gateway non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	
	};
	Gateway.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of Gateway that you want change properties'},
		  			 {arg: 'properties', type:'Gateway' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Gateway',root:true},
		  description: "Update Gateway. Admitted "
	});
	const toRadians = (val) => {
		return val * Math.PI / 180;
	}
	const toDegrees = (val) => {
	   return val * 180 / Math.PI;
	}
	// Calculate a point winthin a circle
	// circle ={center:LatLong, radius: number} // in metres
	const pointInsideCircle = (point, circle) => {
	    let center = circle.center;
	    let distance = distanceBetween(point, center);

	    return distance < circle.radius; // Use '<=' if you want to get all points in the border
	};
	const distanceBetween = (point1, point2) => {
	    var R = 6371e3; // metres
	    var φ1 = toRadians(point1.latitude);
	    var φ2 = toRadians(point2.latitude);
	    var Δφ = toRadians(point2.latitude - point1.latitude);
	    var Δλ = toRadians(point2.longitude - point1.longitude);

	    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
	            Math.cos(φ1) * Math.cos(φ2) *
	            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	    return R * c;
	}
};
