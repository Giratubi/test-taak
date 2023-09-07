'use strict';

var methodsHelper = require('../../server/helpers/methods');
var app = require('../../server/server');

module.exports = function(Company) {


	var methodsToDisplay =  ['findById','find','create','deleteById'];
	methodsHelper.disableAllExcept(Company, methodsToDisplay);

	Company.find__ = async (id) => {	

		
		try
		{	
			var filter = {where:{id:id},include:["companytype","gateways"]}		
			var companies = await Company.find(filter)
			
			return companies;
		}
		catch(results) {
			throw(results);

		}
		
	};
	Company.remoteMethod(
		'find__', {
		  http: {
		    path: '/find__',
		    verb: 'get'
		  },
		  accepts: {arg: 'id', type: 'string',require:false, description:"Companies find__ ",root:true},
		  returns: {arg: 'results',type: ['Companies']},
		  description: "Find Companies with companytype"
	});
	Company.findNew_ = async (installationcompanyId) => {	
	    //console.log("CHIAMATA COMPANY FIND",installationcompanyId)
	    var Gateway = app.models.Gateway	
		let Companytype = app.models.Companytype;
		let Gatewaycompany = app.models.Gatewaycompany;		
		let filtergateway = {};
		let filtercompany = {};
		if(installationcompanyId){	
			filtercompany = {where:{id:installationcompanyId},include: ['companytype','gateways']}
			filtergateway = {where:{installationcompanyId:installationcompanyId}}
			//console.log('filtergateway',filtergateway);
		}else{
			filtercompany = {include: ['companytype','gateways']}
		}		
		try
		{	
			var companies = await Company.find(filtercompany)
			//console.log("companies",companies)			
			var gtwcom = await Gatewaycompany.find(filtergateway)				
			gtwcom = JSON.parse(JSON.stringify(gtwcom))
			companies = JSON.parse(JSON.stringify(companies))
			//console.log('gtwcom',gtwcom);
			let companyFulled =[] 
			for(var g of gtwcom){
				// console.log("G",g)
				var company = await Company.findById(g.companyId,{
					include:[{
						relation:"companytype"
					},{
						relation:'gateways'
					}]
				})
				company = JSON.parse(JSON.stringify(company))
				company['installationcompanyId']=g.installationcompanyId
				//console.log("company_iiiiiiiiiiiiiiiiiiiiiii",company);
				for(var c of companies){
					//console.log("COMPANY ID ",c.id)
					if(g.companyId == c.id){
						//finded = true,
						c['companytype'] = company.companytype
						c['gateways'] = company.gateways
						c['installationcompanyId'] = g.installationcompanyId
					}
				}
				//console.log("COMPANY ID DOPO")
				
			}
			//console.log("companyFulled",companyFulled);
			for(var x = 0;x<companies.length;x++){
				let c = companies[x]
				//console.log('gatewayc',c.gateways());
				//console.log('company',c);
				// if(c.hasOwnProperty('installationcompanyId')){
					// console.log("si ho propietà")
				// }
				c['gatewayproblems'] = false
				c['hasalarm'] = false
				c['nosignal'] = false
				var gtws = c.gateways
				// giro gli allarmi di ogni singolo gateway , se c'è l'allarme metto gatewaysproblem true per il triangolino nella list compnay
				for(var gs of gtws){	
					gs['hasalarm'] = false;
					gs['nosignal'] = false	
					var gtwalldata = await Gateway.find_(gs.id);
					// se cè un allarme oppure non c'è segnale					
					if(gtwalldata.hasalarm == true || gtwalldata.nosignal == true){
						c['gatewayproblems'] = true
					}
					if(gtwalldata.hasalarm == true ){
						c['hasalarm'] = true
						gs['hasalarm'] = true;
					}
					if(gtwalldata.nosignal == true ){
						c['nosignal'] = true
						gs['nosignal'] = true;
					}
				}
				//
				//console.log("GTWALL",gtwall)
				/*for(var gw of c.gateways() ){
					if(gw.error != null){						
						c.gatewayproblems = true
					}
				}*/
			} 
			let companytypeId2 = companies.filter(el=>{
				if(el.companytype.id == 2){
					return true
				}
				return false
			})
			if(companytypeId2.length>0){
				for(let c of companies){
					for(let c2 of companytypeId2){
						if(!c2.hasOwnProperty('child')){
							c2['child'] = []
						}
						if(c.installationcompanyId == c2.id){
							c2.child.push(c)
						}
					}
				}
				companies = companytypeId2;
			}
			
			
			return companies;
			
		}
		catch(results) {
			throw(results);

		}
		
	};
	Company.remoteMethod(
		'findNew_', {
		  http: {
		    path: '/findNew_',
		    verb: 'get'
		  },
		  accepts: {arg: 'installationcompanyId', type: 'string',require:false, description:"Companies find ",root:true},
		  returns: {arg: 'results',type: 'Companies_'},
		  description: "Find Companies with companytype"
	});	

	Company.find_ = async (installationcompanyId) => {	
		console.log("installationcompanyId",installationcompanyId);

	    var Gateway = app.models.Gateway	
		
		let Companytype = app.models.Companytype;

		let Gatewaycompany = app.models.Gatewaycompany;		

		let filtergateway = {};
		let filtercompany = {};

		if(installationcompanyId){			

			filtercompany = {where:{id:installationcompanyId},include: ['companytype','gateways']}
							
			filtergateway = {where:{installationcompanyId:installationcompanyId}}
		}else{
			console.log("sono qui undefined");
			filtercompany = {include: ['companytype','gateways']}
		}		
		
		
		try
		{	


			var companies = await Company.find(filtercompany)

			//console.log("companies",companies)			

			var gtwcom = await Gatewaycompany.find(filtergateway)				

				gtwcom = JSON.parse(JSON.stringify(gtwcom))

		
		   		   

			// for(var g of gtwcom){
			// 	var company = await Company.findById(g.companyId,{
			// 		include:[{
	        //             relation:"companytype"
	        //         },
	        //         {
	        //             relation:'gateways'
	        //         }]
	        //     })	            
	        //     var finded = false
	        //     for(var c of companies){
	        //     	console.log("COMPANY ID ",c.id)
	        //     	if(g.companyId == c.id){
	        //     		finded = true
	        //     	}
	        //     }
	        //     console.log("COMPANY ID DOPO")
	        //     if(!finded){
	        //     	companies.push(company);
	        //     }
			// }

			for(var c of companies){
				c['gatewayproblems'] = false
				c['hasalarm'] = false
				c['nosignal'] = false
				var gtws = c.gateways()
				// giro gli allarmi di ogni singolo gateway , se c'è l'allarme metto gatewaysproblem true per il triangolino nella list compnay
				for(var gs of gtws){	
					gs['hasalarm'] = false;
					gs['nosignal'] = false	
					var gtwalldata = await Gateway.find_(gs.id);
					// se cè un allarme oppure non c'è segnale					
					if(gtwalldata.hasalarm == true || gtwalldata.nosignal == true){
						c['gatewayproblems'] = true
					}
					if(gtwalldata.hasalarm == true ){
						c['hasalarm'] = true
						gs['hasalarm'] = true;
					}
					if(gtwalldata.nosignal == true ){
						c['nosignal'] = true
						gs['nosignal'] = true;
					}
				}
				//
				//console.log("GTWALL",gtwall)
				/*for(var gw of c.gateways() ){
					if(gw.error != null){						
						c.gatewayproblems = true
					}
				}*/
			} 
			return companies;
		}
		catch(results) {
			throw(results);
		}
	};
	Company.remoteMethod(
		'find_', {
		  http: {
		    path: '/find_',
		    verb: 'get'
		  },
		  accepts: {arg: 'installationcompanyId', type: 'string',require:false, description:"Companies find ",root:true},
		  returns: {arg: 'results',type: 'Companies'},
		  description: "Find Companies with companytype"
	});



	Company.updateAttributes = async (id,properties) => {
	 
   	    let results;
   	    try
   	    {
			var company = await Company.findById(id);

			if(company) {
				var updated = await company.updateAttributes(properties)
				results = updated;
				
				return results;	
			}else{
				throw new Error('Tipo di company non trovato');
			}		
		}
		catch(e) {
			throw e;
		}	

	};
	Company.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/updateAttributes/:id',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'string',required: true,description:'The id of MeintinanceType that you want change properties'},
		  			 {arg: 'properties', type:'Company' ,http: {source: 'body'},description:'Refer To Model and ModelSchema.Id must be removed'}
		  		   ],
		  returns: {arg: 'results ', type:'Company',root:true},
		  description: "Update Company. Admitted "
	});


	Company.delete_ = async (companyId) => {	


		console.log("companyId",companyId)


		var Gateway = app.models.Gateway

		var Gatewaycompany = app.models.Gatewaycompany

		var Gatewayradius = app.models.Gatewayradius

	  	var Gatewayspositions = app.models.Gatewayspositions

		var Connector = app.models.Connector

		var Rele = app.models.Rele

		var Relevalue = app.models.Relevalue

		var Sensorvalue = app.models.Sensorvalue	
		
		var Sensorcustomname = app.models.Sensorcustomname
		
		try
			{	

				var company = await Company.find({where:{id:companyId}})

				//console.log("COMANY",company)

				if(company.length > 0){

					var gatewaycompany = await Gatewaycompany.find({where:{companyId:company[0].id}})

					if(gatewaycompany.length >0){

						for(var gc of gatewaycompany){

							// DELETE GATEWAY COMPANY							

							var gateway = await Gateway.find({where:{id:gc.gatewayId}})							

							if(gateway.length >0){

								var connector = await Connector.find({where:{gatewayId:gateway[0].id}})

								if(connector.length >0){

									for(var co of connector){

										var sensorvalue = await Sensorvalue.find({where:{connectorId:co.id}})

										//console.log("SENVAL",sensorvalue)

										if(sensorvalue.length >0){											

											for(var sv of sensorvalue){

												// Delete dati Sensori 

												//console.log("CANCELLO SENSORVAUE",sv)

												var deletesenval = await Sensorvalue.deleteById(sv.id)

												//console.log("CANCELLATO SENSORI")
											}
										}

										var rele = await Rele.find({where:{connectorId:co.id}})

										//console.log("rele",rele)

										if(rele.length >0){												

											for(var re of rele){												

												var relevalue = await Relevalue.find({where:{releId:re.id}})

												//console.log("relevalue",relevalue)

												if(relevalue.length >0){

													// delete valori relè (aux connettore )

													for(var rev of relevalue){

														//console.log("REV",rev)
														var delrelval = await Relevalue.deleteById(rev.id)

														//console.log("CANCELLATO RELEVALUE")
													}

													var delauxconn = await Rele.deleteById(re.id)
												}

												

												//console.log("CANCELLATO RELE")
											}
										}

										var sensorcustomname = await Sensorcustomname.find({where:{connectorId:co.id}})

										if(sensorcustomname.length >0){

											for(var scn of sensorcustomname){
												var delsencname = await Sensorcustomname.deleteById(scn.id)
											}											
										}

										var delconn = await Connector.deleteById(co.id)
									}

								}

								var sensorvalueG = await Sensorvalue.find({where:{code:gateway[0].id}})
								if(sensorvalueG.length >0){									

									// DELETE DATI GATEWAY ( Voltaggio)

									for (var senv of sensorvalueG){

										var delsensvagtw = await Sensorvalue.deleteById(senv.id)
									}
								}

								var releG = await Rele.find({where:{gatewayId:gateway[0].id}})

								console.log("RELE G",releG)

								if(releG.length>0){

									// DELETE AUX GATEWAY

									for(var reg of releG){
										
										//console.log("reg",reg)

										var relevalueG = await Relevalue.find({where:{releId:reg.id}})

										//console.log("relevalueG",relevalueG)

										if(relevalueG.length > 0){
											// Delete valori aux gateway 

											for(var relvalg of relevalueG){
												var delrevalg = await Relevalue.deleteById(relvalg.id)
											}

											
										}
										var delauxgtw = await Rele.deleteById(reg.id)
									}
								}

								var gatewayposition = await Gatewayspositions.find({where:{gatewayId:gateway[0].id}})

								if(gatewayposition.length >0){									

									for(var gp of gatewayposition){
										// DELETE POSIZIONI GATEWAY
										var delgtwpos = await Gatewayspositions.deleteById(gp.id)

										
									}
								}

								var gatewayradius = await Gatewayradius.find({where:{gatewayId:gateway[0].id}})

								if(gatewayradius.length >0){									

									for(var gr of gatewayradius){										
										// Delete RADIUS GATEWAY 
										var delgtwrad = await Gatewayradius.deleteById(gr.id)

									}
								}

								

							}
							var delcompany = await Company.deleteById(company[0].id)
							var delgtw = await Gateway.deleteById(gc.gatewayId)
							var deletegtwcomp = await Gatewaycompany.deleteById(gc.id)
						}

					}else{
						var delcompany = await Company.deleteById(company[0].id)
					}

				}

					

			
			//return companies;
		}
		catch(results) {
			throw(results);

		}
		
	};
	Company.remoteMethod(
		'delete_', {
		  http: {
		    path: '/:companyId',
		    verb: 'delete'
		  },
		  accepts: {arg: 'companyId', type: 'number',require:false, description:"Companies find ",root:true},
		  returns: {arg: 'results',type: 'Company'},
		  description: "Delete Companies and all parameters"
	});



};
