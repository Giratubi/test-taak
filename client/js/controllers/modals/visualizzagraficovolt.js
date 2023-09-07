angular.module('pdp',['angularFileUpload']).controller('visualizzaGraficoVoltController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','$timeout','inputs','Sensorvalue',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,$timeout,inputs,Sensorvalue) {
               


    
    	$scope.isSwitch = false;

    	$scope.data = []

    	var data = []


    	$scope.isFilterClicked = false

    	initializate(inputs);


    	$scope.createPDF = function(){    		    

    		    var hours = []

    		    var voltage = []

    		    var total = []

    		    for (var data of $scope.voltageData){

    		    	hours.push(data.hour.toString())
    		    	voltage.push(data.voltage.toString())
    		    	
    		    }

    		    total.push(hours,voltage)

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
				          [ 'Ora', 'Voltaggio', ],
				          [ total[0], total[1]  ],			          				         
				           
				        ]
				      }
				    }
				  ]
				};				

				pdfMake.createPdf(docDefinition).download("datatable.pdf");
    			

    			/*$('#dataTable').css('height',4000)


                html2canvas($('#dataTable'), {
                	
                              
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL("image/svg", 1);
    					
                        console.log("DATA",data);
                        
                        var docDefinition = {
                            scale: 1,
                            dpi: 300, 
                            quality: 99,
                            pageSize: 'A4',
                            pageMargins: [ 10, 10, 10, 10 ],
                                content: [{
                                    image:data,
                                    fit: [500, 500]
                                }]                            
                        };
                     
                        pdfMake.createPdf(docDefinition).download("datatable.pdf", function() { 

                        	$('#dataTable').css('height',200)
    
                        });
                    }
                });*/
    	}


    	function changeEpoch(notValidDate){
    		console.log("notValidDate",notValidDate);
    		if(new Date(notValidDate).getFullYear() == 1970){
				return new Date(notValidDate*1000).getMilliseconds()
			} else {
				return new Date(notValidDate/1000).getMilliseconds()
			}
    		
    	}


    	function renderData(code,from,to){
    			/*if(from){
    				from = changeEpoch(Number(from));
    			}
    			if(to){
    				to = changeEpoch(Number(to));
    			}*/

    			console.log("GINO from",from)

    			console.log("GINO to",to)
    		
    		Sensorvalue.findVolt({code:code,from:from,to:to}).$promise.then(function(senval) {    

    			console.log("senval",senval);

    			$scope.data = senval


    		
		    

    					var data = [];

    					console.log("DATI GREZZI",$scope.data.results);
    			

    					

		    			for(var s of $scope.data.results){


		    				var miadata= new Date(Number(s.reciveddate));


							
		    				console.log("miadata",miadata);

		    				const hour = miadata.toLocaleTimeString('it-IT', {
							  // en-US can be set to 'default' to use user's browser settings
							  hour: '2-digit',
							  minute: '2-digit',
							});

							var obj = {hour:hour,
									   voltage:Number(s.value)}


						    data.push(obj)

						}
						data = data.sort(function(a,b){
							return a.hour-b.hour
						})

						console.log('MIEIDATI',data);
					
		    			
		    			$scope.isVoltage = true

		    			if($scope.isFilterClicked == false){

		    				$("#bar-3").remove();
		    				$('#gauge-1').remove()

		    			}

		    			
		          
		           		 $timeout(function(){
				           
		           		 	var renderOptions = {
							    force: true, // forces redrawing
							    animate: true // redraws the UI component without animation
							}

				            // grafico temperature 

				            var dataSource = data;
				            $scope.voltageData = data;
				           	$scope.$apply(() => {
				            	 $scope.voltageData; 
				            });

				            console.log('MIEIDATI', $scope.voltageData);
				                  
			              	$("#bar-3").dxChart({
			                    dataSource: $scope.voltageData,
			                    render:renderOptions,			                    
			                    commonSeriesSettings: {
			                      argumentField: "hour"
			                    },
			                    series: [
			                      { valueField: "voltage", name: "Voltaggio", color: "#40bbea" },
			                      
			                    ],
			                    argumentAxis:{
			                      grid:{
			                        visible: true,			                        
			                      },
			                      visualRange: {
							        length: 5							        
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
						        width:1000,
			                    tooltip:{
			                      enabled: true,
			                      customizeText: function () {                         
			                        return this.value + ' Volt' }

			                    },
			                    title: "Andamento Sensore Voltaggio",
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




			                 // temperatura attuale
			                 //console.clear();
			                // console.table(dataSource);
			                // console.log("MIA TEMPERATURA ATTUALE",Number(dataSource.reverse()[0].temperature));


			                  var gauge = $('#gauge-1').dxCircularGauge({
			                  	dataSource:  Number(dataSource.reverse()[0].voltage),
			                  	render:renderOptions,
			                    scale: {
			                      startValue: 0,
			                      endValue: 100,
			                      majorTick: {
			                        tickInterval: 10
			                      }
			                    },
			                    rangeContainer: {
			                      palette: 'pastel',
			                      ranges: [
			                        { startValue: 0, endValue: 30, color: '#8dc63f' },
			                        { startValue: 30, endValue: 60, color: '#ffba00' },
			                        { startValue: 60, endValue: 100, color: '#cc3f44' },
			                      ]
			                    },
			                    title: {
			                      text: 'Voltaggio Attuale',
			                      font: { size: 28 ,weight: 200}                     
			                    },
			                    value: Number(dataSource.reverse()[0].voltage)
			                  }).dxCircularGauge('instance');

		         		},500, false);
		    	})

    			

    	

    	}

    	function initializate(inputs){

    		

    		console.log(inputs);
    		// data e orario odierna to timestamp e il from è un ora in meno del to

    		/*var to = Math.round(+new Date()/1000);

    		var tempTo = new Date(to * 1000)    		

    		var tempFrom = tempTo.setHours(tempTo.getHours() - 1);

    		var from = Math.round(+new Date(tempFrom)/1000);*/

    		var tempto = new Date()

    		var tomod = tempto.setHours(tempto.getHours() - 5);

    		var from = Number(tomod)

    		var to = Number(new Date())



    		renderData(inputs.id,from,to);
    	


    		

    	}




    	$scope.filterValues = function(){  

    			// Controlla i campi

    			$scope.isFilterClicked = true

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
    			

    			var from = Number(new Date($scope.dateFrom))
    			var to = Number(new Date($scope.dateTo))


    			

    			renderData(inputs.id,from,to);
    	

    	}



}])