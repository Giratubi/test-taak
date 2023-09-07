angular.module('pdp',['angularFileUpload']).controller('visualizzaCoordinateController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','$timeout','inputs','Sensorvalue',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,$timeout,inputs,Sensorvalue) {
               

    	console.log("COORDINATE",inputs)
    
    	$scope.isSwitch = false;

    	$scope.data = []

    	var data = []

    	initializate(inputs);


    	/*$scope.createPDF = function(){

    			$('#dataTable').css('height',4000)


                html2canvas($('#dataTable'), {
                	
                              
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL("image/svg", 1);
    					
                        console.log("DATA",data);
                        
                        var docDefinition = {
                            scale: 100,
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
                });
    	}*/

    	$scope.createPDF = function(){    		    

    		    var latitude = []

    		    var longitude = []

    		    var altitude = []

    		    var distance = []

    		    var speed = []

    		    var total = []

				var date = []

    		    for (var data of $scope.gatewayspositions){

    		    	

    		    	latitude.push(data.latitude.toString())
    		    	longitude.push(data.longitude.toString())
    		    	altitude.push(data.altitude.toString())
    		    	distance.push(Number(data.distance).toFixed(2))
    		    	speed.push(data.speed.toString())

					//console.log("data.reciveddate",new Date(Number(data.reciveddate)))

					var dateposition = new Date(Number(data.reciveddate)).toLocaleString()
					

					console.log("dateposition",dateposition.toLocaleString())
					date.push(dateposition.toString())
    		    	
    		    }

    		    total.push(latitude,longitude,altitude,distance,speed,date)

    		    console.log("TOTALE",total)

    			var docDefinition = {
					pageOrientation: 'landscape',	
				  content: [
				    {
					 
				      layout: 'lightHorizontalLines', // optional
				      table: {
				        // headers are automatically repeated if the table spans over multiple pages
				        // you can declare how many rows should be treated as headers
				        headerRows: 1,
				        widths: [ '*', '*','*', '*','*','*' ],

				        body: [
				          [ 'Latitudine', 'Longitudine', 'Altitudine','Distanza','Velocità','Orario' ],
				          [ total[0], total[1],total[2],total[3],total[4],total[5]  ],			          				         
				           
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



    	function initializate(inputs){

			
			
    		$scope.gatewayspositions = inputs.reverse()
    		$scope.name = inputs.name
    		

    	}




    	


}])