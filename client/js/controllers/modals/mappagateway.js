angular.module('pdp',['angularFileUpload']).controller('mappaGatewayController', ['$scope', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','Companytype','$timeout','inputs','close','Company','Gateway','Gatewayspositions',
    	function ($scope, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,Companytype,$timeout,inputs,close,Company,Gateway,Gatewayspositions) {
               


    console.log("GATEWAY",inputs)	

    var map = null

    var options = {}

    var lat = Number(inputs.lat)
    var lon = Number(inputs.lon)


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

    	var filterareas = {where:{gatewayId:inputs.id}}

    	Gatewayspositions.find({filter:filterareas}).$promise.then(function(gatewayspositions) {  

		    	map = null

		    	google.maps.event.addDomListener(window, 'load', initializate);	

				$timeout(function(){ 			
		    	
					  var static_position = new google.maps.LatLng(lat, lon);
					  var the_circle = null;
					 
					  map = new google.maps.Map(document.getElementById('mapgtw'), {
					      center: static_position,
					      zoom: 8,
					      draggable: false,
					      draggableCursor:'pointer',

					  });

					  const image =
					    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
					  const beachMarker = new google.maps.Marker({
					    position: { lat: lat, lng: lon },
					    map,
					    icon: image,
					  });



					  if(gatewayspositions.length >0){

					  	var positions = gatewayspositions

					  	var areas = null			  	

					  	for (var pos of positions){


					  		if(pos.latitude > 0 && pos.longitude > 0 && pos.sat >0){


						  		
						  		var objpos = {
								  	pos: {
									    center: { lat: Number(pos.latitude), lng: Number(pos.longitude) }					   
									  }
								};					

								areas = new google.maps.Circle({
							      strokeColor: "#FF0000",
							      strokeOpacity: 0.8,
							      strokeWeight: 2,
							      fillColor: "#FF0000",
							      fillOpacity: 0.35,
							      map,
							      editable: true,
							      center: objpos.pos.center,
							      radius: Number(pos.radius),
							      id:pos.id,
							       
							    });

							    
								

							    google.maps.event.addListener(areas, 'radius_changed', function (event) {
							       
							       

							        var obj = {latitude:this.getCenter().lat(),
							         		   longitude:this.getCenter().lng(),
							         		   radius:this.getRadius()}

							        var id = this.id

							        Gatewayspositions.updateAttributes({id:id},obj).$promise.then(function(gtwpos){        		
	        							
	        							$('#showdeletearea').hide()
						        		initializate()
						        		toastr.success("Diametro area aggiornato correttamente", "Avviso",opts);         		

						        	});		   
							        
							    });

							    google.maps.event.addListener(areas, 'center_changed', function (event) {
							       
							      	var obj = {latitude:this.getCenter().lat(),
							         		   longitude:this.getCenter().lng(),
							         		   radius:this.getRadius()}

							        var id = this.id

							        Gatewayspositions.updateAttributes({id:id},obj).$promise.then(function(gtwpos){        		
	        							
	        							$('#showdeletearea').hide()
						        		initializate()
						        		toastr.success("Posizione area aggiornata correttamente", "Avviso",opts); 
						        		      		

						        	});

							        
							    });						    

							    google.maps.event.addListener(areas, 'click', function (event) {
							      
							    	$scope.selectedarea = this.id

							    	console.log("$scope.selectedarea",$scope.selectedarea)

							    	$('#showdeletearea').hide()
							    	$('#showdeleteareaForNew').hide()

							    	$timeout(function(){

							    		$('#showdeletearea').show()
							    	 }, 500, true);
							    	
							    });		
						    }		   

					  	}

					  }


					  
					  var mousemove_handler;
					  
					  google.maps.event.addListener(map, 'mouseup', function(e) {            
					      if(mousemove_handler) google.maps.event.removeListener(mousemove_handler);
					      map.setOptions({draggable:true, draggableCursor:''}); //allow map dragging after the circle was already created 
					      the_circle.setOptions({clickable:true});
					  });
					  
					  google.maps.event.addListener(map, 'mousedown', function (mousedown_event) {
						  var radius = google.maps.geometry.spherical.computeDistanceBetween(static_position, mousedown_event.latLng); //get distance in meters between our static position and clicked position, which is the radius of the circle
						  the_circle = createCircle(static_position, radius); //create circle with center in our static position and our radius
						  mousemove_handler = google.maps.event.addListener(map, 'mousemove', function(mousemove_event) { //if after mousedown user starts dragging mouse, let's update the radius of the new circle
							  var new_radius = google.maps.geometry.spherical.computeDistanceBetween(static_position, mousemove_event.latLng);
							  console.log(new_radius);
							  the_circle.setOptions({radius:new_radius}); 
						  });
					  });

					
						
					
			    }, 1000, true);

		});


    }



	function createCircle(center, radius) {

		$('#showdeletearea').hide()

		$scope.radius = null
		$scope.latitude = null
		$scope.longitude = null

	    var circle = new google.maps.Circle({
	        fillColor: '#ffffff',
	        fillOpacity: .6,
	        strokeWeight: 1,
	        strokeColor: '#ff0000',
	        draggable: true,
	        editable: true,
	        map: map,
	        center: center,
	        radius: radius,
	        clickable:false
	    });

	    google.maps.event.addListener(circle, 'radius_changed', function (event) {
	        
	        $scope.radius = circle.getRadius()
	        $scope.latitude = circle.getCenter().lat();
	        $scope.longitude = circle.getCenter().lng();

	        $scope.newCircle = circle

	    	$('#showdeleteareaForNew').show()
	    });

	    google.maps.event.addListener(circle, 'center_changed', function (event) {
	        
	        $scope.radius = circle.getRadius()
	        $scope.latitude = circle.getCenter().lat();
	        $scope.longitude = circle.getCenter().lng();

	        $scope.newCircle = circle

	         $('#showdeleteareaForNew').show()
	    });

	    google.maps.event.addListener(circle, 'click', function (event) {
	        
	        $scope.radius = circle.getRadius()
	        $scope.latitude = circle.getCenter().lat();
	        $scope.longitude = circle.getCenter().lng();

	    	$scope.newCircle = circle

	    	$('#showdeleteareaForNew').hide()

	    	$timeout(function(){

	    		$('#showdeleteareaForNew').show()
	    	}, 500, true);
	    	
	    });

	   
		
	    return circle;
	}


	$scope.removeArea = function(){		


			

		 toastr.warning("<br /><br /><div class='text-center'><button type='button' id='yes' class='btn btn-secondary'>Si</button><button type='button' id='no' class='btn btn-secondary'>No</button></div>",'Sicuro di voler cancellare questa area?',
		    {
		        closeButton: true,
		        allowHtml: true,
		        positionClass: "toast-bottom-right",					
				onclick: null,
				tapToDismiss : false,
				onShown: function (toast) {
		          $("#yes").click(function(){

		          	toastr.clear()
		            Gatewayspositions.deleteById({id:$scope.selectedarea}).$promise.then(function(deletearea) {

		            	$('#showdeletearea').hide()

					 	initializate()

					 	toastr.success("Area Eliminata", "Avviso",opts);

					 })

		          });
		          $("#no").click(function(){
		            
		            toastr.clear()
		          });
		        }

		       
		    })
		
		

	}

	

	$scope.removeNewArea = function(){

		$scope.newCircle.setMap(null);

		$scope.newCircle = null

		$('#showdeleteareaForNew').hide()
	}

	$scope.saveNewArea = function(){



		var obj = {gatewayId:inputs.id,
				  latitude:$scope.latitude,
				  longitude:$scope.longitude,
				  radius:$scope.radius}
	    
		Gatewayspositions.create(obj).$promise.then(function(gtwarea){ 			                    

            initializate()

            $('#showdeleteareaForNew').hide()

    		toastr.success("Nuova Area inserita correttamente", "Avviso",opts);      		

    		

    	});

	}

}])