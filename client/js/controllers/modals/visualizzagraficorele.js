angular.module('pdp',['angularFileUpload']).controller('visualizzaGraficoReleController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','$timeout','inputs','Relevalue',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,$timeout,inputs,Relevalue) {
               



    	console.log("VISUALIZZA GRAFICO RELE",inputs)
    	$scope.name = inputs.code;

    	$scope.isTemp = false
    	$scope.isUmidity = false;
    	$scope.isSwitch = false;

    	$scope.isFilterClicked = false

    	$scope.data = []

    	$scope.valuesfortable = null

    	$scope.actualvalue = null

    	

    	var actualvalue = null

    	initializate(inputs)


    	/*$scope.createPDF = function(){


    			var hours = []

    		    var values = []

    		    var total = []

    		    for (var d of $scope.valuesfortable){

    		    	var value = Object.keys(d)		    	

    		    	hours.push(d.hour.toString())
    		    	values.push(d[value[1]].toString())
    		    	
    		    }

    		    total.push(hours,values)

    		    console.log("TOTALE",total)

    			var docDefinition = {
				  content: [
				    {
				      layout: 'lightHorizontalLines', // optional
				      table: {
				        // headers are automatically repeated if the table spans over multiple pages
				        // you can declare how many rows should be treated as headers
				        headerRows: 1,
				        widths: [ '*', '*' ],

				        body: [
				          [ 'Ora', 'Valore', ],
				          [ total[0], total[1]  ],			          				         
				           
				        ]
				      }
				    }
				  ]
				};				

				pdfMake.createPdf(docDefinition).download("datatable.pdf");

    			

                html2canvas($('#dataTable'), {
                              
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL("image/svg", 1);
    					
                        console.log("DATA",data);
                        
                        var docDefinition = {
                            scale: 10,
                            dpi: 4800, 
                            quality: 99,
                            pageSize: 'A4',
                            pageMargins: [ 10, 10, 10, 10 ],
                                content: [{
                                    image:data,
                                    fit: [550, 550]
                                }]                            
                        };
                     
                        pdfMake.createPdf(docDefinition).download("datatable.pdf", function() { 
    
                        });
                    }
                });
    	}*/


    	function changeEpoch(notValidDate){
    		console.log("notValidDate",notValidDate);
    		if(new Date(notValidDate).getFullYear() == 1970){
				return new Date(notValidDate*1000).getMilliseconds()
			} else {
				return new Date(notValidDate/1000).getMilliseconds()
			}
    		
    	}


    	$scope.createPDF = function(){    		    

    		    var hours = []

    		    var value = []

    		    var total = []

    		    for (var data of $scope.valuesfortable){

    		    	hours.push(data.hour.toString())
    		    	if(data.on == 1){
    		    		value.push('On')
    		    	}

    		    	if(data.off == -1){
    		    		value.push('Off')
    		    	}
    		    	
    		    	
    		    }

    		    total.push(hours,value)

    		    console.log("TOTALE",total)

    			var docDefinition = {
				  content: [
				    {
				      layout: 'lightHorizontalLines', // optional
				      table: {
				        // headers are automatically repeated if the table spans over multiple pages
				        // you can declare how many rows should be treated as headers
				        headerRows: 1,
				        widths: [ '*', '*' ],

				        body: [
				          [ 'Ora', 'Stato', ],
				          [ total[0], total[1]  ],			          				         
				           
				        ]
				      }
				    }
				  ]
				};				

				pdfMake.createPdf(docDefinition).download("datatable.pdf");   			

    			
    	}


    	function renderData(code,from,to,releId){
    			/*if(from){
    				from = changeEpoch(Number(from));
    			}
    			if(to){
    				to = changeEpoch(Number(to));
    			}*/

    		if($scope.isFilterClicked == false){    				

    				
    				$("#bar-5").remove()
    		}


    		Relevalue.findByDate({code:code,from:from,to:to,releId:releId}).$promise.then(function(relevalues) {    

    			console.log("relevalues",relevalues);

    				var data = []

                     $scope.timingonoffcount = 'Stato Off:'+relevalues.results[0].hoursoff+' Stato On: '+ relevalues.results[0].hourson


    				$scope.data = relevalues 

    				console.log("$scope.data",$scope.data)

    				if($scope.isFilterClicked == false && $scope.data.results.length > 0){	    				

	    				actualvalue = $scope.data.results;

	    				$scope.actualvalue = actualvalue.reverse()[0].value;
	    				
	    			}

    				for(var s of $scope.data.results){    					

    					var valueOn = null

    					var valueOff = null

    					if(s.value == true){

    						valueOn = 1
    						//valueOff = 0
    					}
    					if(s.value == false){

    						//valueOn = 0
    						valueOff = -1
    					}

    					var miadata= new Date(Number(s.reciveddate));

		    				console.log("miadata",miadata);

		    				const hour = miadata.toLocaleTimeString('it-IT', {
							  // en-US can be set to 'default' to use user's browser settings
							  hour: '2-digit',
							  minute: '2-digit',
							});

    					    var obj = {hour:hour,
    							   on:valueOn,
    							   off:valueOff}


    				        data.push(obj)
    				}

	    			$scope.isSwitch = true; 

                       			

	    			//console.log("actualvalue",actualvalue);		    			   			

	    			$timeout(function(){

	    				var renderOptions = {
							    force: true, // forces redrawing
							    animate: true // redraws the UI component without animation
							}

	    				//console.log("data",data)

	    				  $scope.valuesfortable = data
		    		
		                  
		                  $("#bar-5").dxChart({
		                    dataSource: $scope.valuesfortable,
		                    render:renderOptions,
		                    commonSeriesSettings: {
		                      argumentField: "hour",
		                      type: "stackedbar",
		                    },
		                    series: [
		                      { valueField: "on", name: "Stato Attivo", color: "#118f11", type: 'bar' },
		                      { valueField: 'off', name: 'Stato Disattivato' ,color: "#c41919", type: 'bar'}, 		                      
		                    ],
		                    argumentAxis:{
			                      grid:{
			                        visible: true
			                      },
			                      visualRange: {
							        length: 10							        
							      },
			                },
			                zoomingMode: "all",
						    scrollingMode: "all",
						    scrollBar: {
					            visible: true,

					        },						        
						    zoomAndPan: {
						      argumentAxis: 'both',
						    },
		                    tooltip:{
		                      enabled: true,
		                    },
		                    title: "Andamento Sensore posizione",
		                    legend: {
		                      verticalAlignment: "bottom",
		                      horizontalAlignment: "center"
		                    },
		                    commonPaneSettings: {
		                      border:{
		                        visible: true,
		                        right: false
		                      }    
		                    }
		                  }).dxChart('instance');		                  
		            },500, false);      
	    		
	    		

    		}) 

    	}

    	function initializate(inputs){

    		


    		// data e orario odierna to timestamp e il from è un ora in meno del to

    		/*var to = Math.round(+new Date()/1000);

    		var tempTo = new Date(to * 1000)    		

    		var tempFrom = tempTo.setHours(tempTo.getHours() - 1);

    		var from = Math.round(+new Date(tempFrom)/1000);*/

    		var tempto = new Date()

    		var tomod = tempto.setHours(tempto.getHours() - 5);

    		var from = Number(tomod)

    		var to = Number(new Date())



    		renderData(inputs.code,from,to,inputs.id);
    	


    		

    	}




    	$scope.filterValues = function(){  

    			// Controlla i campi

    			$scope.isFilterClicked = true;

                $scope.valuesfortable = []

                $scope.timingonoffcount =''

    			if(!$scope.dateFrom){

    				return;
    			}
    			if(!$scope.dateTo){
    				return;
    			}
    			if(!$scope.hourFrom){
    				return;
    			}
    			if(!$scope.hourTo){
    				return;
    			}

    			$scope.dateFrom.setHours($scope.hourFrom.getHours()); 
    			$scope.dateFrom.setMinutes($scope.hourFrom.getMinutes());

    			$scope.dateTo.setHours($scope.hourTo.getHours()); 
    			$scope.dateTo.setMinutes($scope.hourTo.getMinutes());
    			

    			//var from = Math.round(+new Date($scope.dateFrom)/1000)
    			//var to = Math.round(+new Date($scope.dateTo)/1000)

    			var from = Number(new Date($scope.dateFrom))
    			var to = Number(new Date($scope.dateTo))


    			renderData(inputs.code,from,to,inputs.id);
    	

    	}



}])