angular.module('pdp',['angularFileUpload']).controller('dettagliAziendaController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Connector',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Connector) {
               

    console.log("inputs",inputs)

    $scope.name = inputs.name;
    $scope.email = inputs.email;
    $scope.description = inputs.description;
    $scope.address = inputs.address;
    $scope.vatnumber = inputs.vatnumber;

  	

    $scope.hasgateway = false; // parametro per mostrare la tabella gateway se l'azienda ne ha 

    var opts = {
					"closeButton": true,
					"debug": false,
					"positionClass": "toast-bottom-right",
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "5000",
					"extendedTimeOut": "1000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut"
				};


	initializate()


	function initializate(){

		AuthService.getCurrentUser(function(currentUser){

			Companytype.find().$promise.then(function(companytype) { 

				var actualcompanytype = []

				actualcompanytype = companytype.filter(el=>{

					if(el.id == inputs.companytypeId){
						return true
					}
					return false

				})
	             
	            $scope.companytype = companytype
	            $scope.companytypeselected = actualcompanytype[0] 

	            /*if(inputs.gateways.length >0){
            	

	            	$scope.gateways = []

	            	for(var g of inputs.gateways){

	            		Gateway.find_({id:g.id}).$promise.then(function(gtw) {

	            			$scope.gateways.push(gtw.results)

	            		});

	            	}


	            	$timeout(function(){ 

	            		$("#showgateways").dataTable({

		                    retrieve: true,	 
		                    aLengthMenu: [
		                      [ 25, 50, 100, -1], [ 25, 50, 100, "Tutti"]
		                    ],
		                    language: {
		                           info: "Mostra pagina _PAGE_ of _PAGES_",
		                           lengthMenu: "Mostra _MENU_ records per riga",
		                           paginate: {
		                                  previous: "Indietro",
		                                  next:"Avanti",
		                                  first:"Prima pagina",
		                                  last:"Ultima pagina"
		                                 },
		                      search: "Cerca"
		                        }
		                  }).yadcf([
		                    {column_number : 0 , filter_type: 'text',filter_default_label: "Nome"},
		                    {column_number : 1 , filter_type: 'text',filter_default_label: "Descrizione"},
		                    {column_number : 2, filter_type: 'text',filter_default_label: "Hardware version"},
		                    {column_number : 3, filter_type: 'text',filter_default_label: "Software version"},
		                    {column_number : 4, data: [{value:'true',label:'Attivo'},{value:'false',label:'Disattivato'}], filter_default_label: "Seleziona Stato"},
		                    {column_number : 5, filter_type: 'text',filter_default_label: "Errori"},
		                    {column_number : 6, filter_type: 'text',filter_default_label: "Nr.Connettori"}

		                  ]);
		            }, 150, true);

	            	    

	            } */                

	        });
        });

	}
	

	$scope.updateGateway = function(row,deleteerror){

			console.log("deleteerror",deleteerror)

			if(row.name == null || row.name.length <= 0){
    			 toastr.error("Non è stato inserito un nome gateway", "Avviso",opts);
                 return;
    		}

    		if(row.description == null || row.description.length <= 0){
    			 toastr.error("Non è stato inserita una descrizione gateway", "Avviso",opts);
                 return;
    		}

    		if(row.error == null || row.error.length <= 0){
    			 row.error = null
    		} 

    		if(deleteerror == true){
    			row.error = null
    		}

    		var obj = {
        		name:row.name,        				        		      		
        		description:row.description,
        		error: row.error,
        		state: row.state
        		
        	} 

        	console.log("OGGETTO",obj)       	

        	Gateway.updateAttributes({id:row.id},obj).$promise.then(function(gtw){        		
        		
        		console.log("FATTO",gtw)

        		toastr.success("Tipo allarme aggiornato correttamente", "Avviso",opts);        		

        	});	

	}


	$scope.updateCompany = function(){

		if($scope.name == null || $scope.name.length <= 0){
			 toastr.error("Non è stato inserito un nome azienda", "Avviso",opts);
             return;
		}

		if($scope.address == null || $scope.address.length <= 0){
			 toastr.error("Non è stato inserito un indirizzo azienda", "Avviso",opts);
             return;
		}

		if($scope.vatnumber == null ){

			 toastr.error("Non è stato inserita la p.iva azienda in modo corretto", "Avviso",opts);
             return;
		}    		

		if($scope.email == null || $scope.email.length <= 0){
			 toastr.error("Non è stato inserita la mail azienda", "Avviso",opts);
             return;
		}

		

		$scope.isdisabled = true;

		var obj = {name:$scope.name,
				  address:$scope.address,
				  vatnumber:$scope.vatnumber,
				  email: $scope.email,
				  description:$scope.description
				 }	

		Company.updateAttributes({id:inputs.id},obj).$promise.then(function(company){        		

        		$scope.name = '';
        		$scope.address = '';
        		$scope.email = '';		        		
        		$scope.description = '';
        		
        		close(200);

        		toastr.success("Azienda aggiornata correttamente", "Avviso",opts);      		

        		$scope.isdisabled = false;        		

        });	

	}


	$scope.updateConnector = function(row){

		if(row.name == null || row.name.length <= 0){
    			 toastr.error("Non è stato inserito un nome gateway", "Avviso",opts);
                 return;
    	}

    	var obj = {name:row.name}


		Connector.updateAttributes({id:row.id},obj).$promise.then(function(connector){        		

        		console.log("AGG CONNECTOR")

        		toastr.success("Azienda aggiornata correttamente", "Avviso",opts);      		

        		      		

        });


	}


	$scope.showGetawaysTable = function(){

		$('#companydetails').hide()
		$('#listofgateways').show()
		$('#showcompnaydetailsbtn').show()
		$('#showgatewaysbtn').hide()
		$('#listofconnectors').hide()

	}

	$scope.showCompanyDetails = function(){

		$('#companydetails').show()
		$('#listofgateways').hide()
		$('#showcompnaydetailsbtn').hide()
		$('#showgatewaysbtn').show()
	}

	$scope.gatewayDetails = function(gtw){

		$('#showgatewaysbtn').show()
		$('#listofgateways').hide()        
        $('#listofconnectors').show()
        $('#showcompnaydetailsbtn').hide()

        $scope.gtwname = gtw.name
		$scope.connectors = gtw.connectors


		$timeout(function(){ 

			$("#showconnectors").dataTable({

	            retrieve: true,	 
	            aLengthMenu: [
	              [ 25, 50, 100, -1], [ 25, 50, 100, "Tutti"]
	            ],
	            language: {
	                   info: "Mostra pagina _PAGE_ of _PAGES_",
	                   lengthMenu: "Mostra _MENU_ records per riga",
	                   paginate: {
	                          previous: "Indietro",
	                          next:"Avanti",
	                          first:"Prima pagina",
	                          last:"Ultima pagina"
	                         },
	              search: "Cerca"
	                }
	          }).yadcf([
	            {column_number : 0 , filter_type: 'text',filter_default_label: "Nome"},
	            {column_number : 1, filter_type: 'text',filter_default_label: "Hardware version"},
	            {column_number : 2, filter_type: 'text',filter_default_label: "Software version"}
	           

	          ]);
	    }, 150, true);

	}

	$scope.connectorsDetail = function(){

		$('#showgatewaysbtn').show()
		$('#listofconnectors').show()
		$('#listofsensors').hide();
		$('#showconnectorsbtn').hide();

	}

	$scope.showConnectorsDetail = function(con){

		console.log("CON",con)


		$('#showgatewaysbtn').hide()
		$('#listofgateways').hide()        
        $('#listofconnectors').hide()
        $('#showcompnaydetailsbtn').hide()
        $('#showconnectorsbtn').show();
        $('#listofsensors').show();

        $scope.conname = con.name
		$scope.sensors = con.sensorvalues


		$timeout(function(){ 

			$("#showsensors").dataTable({

	            retrieve: true,	 
	            aLengthMenu: [
	              [ 25, 50, 100, -1], [ 25, 50, 100, "Tutti"]
	            ],
	            language: {
	                   info: "Mostra pagina _PAGE_ of _PAGES_",
	                   lengthMenu: "Mostra _MENU_ records per riga",
	                   paginate: {
	                          previous: "Indietro",
	                          next:"Avanti",
	                          first:"Prima pagina",
	                          last:"Ultima pagina"
	                         },
	              search: "Cerca"
	                }
	          }).yadcf([
	            {column_number : 0 , filter_type: 'text',filter_default_label: "Codice"},
	            {column_number : 1, filter_type: 'text',filter_default_label: "Tipo Sensore"},
	            {column_number : 2, filter_type: 'text',filter_default_label: "Descrizione"}
	           

	          ]);
	    }, 150, true);

	}


	$scope.showMap = function(row){


		 var inputs = {inputs:row}

          ModalService.showModal({
                templateUrl: "../../../views/modals/mappagateway.html",
                controllerjs:"js/controllers/modals/mappagateway.js",
                controller: "mappaGatewayController",
                inputs:inputs

              }).then(function(modal)   {

                  modal.element.modal();
                  modal.close.then(function(result) { 

                  initializate();                                    
                  
                }); 
             }).catch(function(error) {
             console.log(error);        
            
          }); 

		
	}


}]);