var filtering = angular.module("filtering",[]).filter('customFilter', ['$filter', function ($filter) {
       
		var filterFilter = $filter('filter');
	
	    var standardComparator = function standardComparator(obj, text) {
	    	
			return ('' + text).toLowerCase() === ('' + obj).toLowerCase();
	    };

	    return function customFilter(array, expression) {
	      
	        console.log('array',array);
	        console.log('expression',expression);
	        
	        function customComparator(actual, expected) {

	            var isBeforeActivated = expected.before;
	            var isAfterActivated = expected.after;
	            var isLower = expected.lower;
	            var isHigher = expected.higher;
	            var higherLimit;
	            var lowerLimit;
	            var itemDate;
	            var queryDate;

	            console.log('actual',actual);
	            console.log('expected',expected);
	            var firstresult = 0;
	            var secondresult = 0;
	                            
	            if (angular.isObject(expected)) {

	                //date range
	                if (expected.before || expected.after) {
	                    try {
	                        
	                        if (isBeforeActivated) {
	                            higherLimit = expected.before;
	                            
	                            console.log('HIGHER',higherLimit)
	                            var startDate = actual.split('|')[0];
	                            var endDate = actual.split('|')[1];
	                            

	                            if(higherLimit=='='){
	                            	console.log('QUI');
	                            	higherLimit = new Date('01/01/3000');
	                            }

	                            var itemDateTo = new Date(startDate);
	                            var queryDateTo = new Date(higherLimit);


	                            console.log('itemDateTo',itemDateTo);
	                            console.log('queryDateTo',queryDateTo);

	                            if (queryDateTo.setHours(0, 0, 0, 0) >= itemDateTo.setHours(0, 0, 0, 0)) {     
	                                 secondresult = 1;
	                            }else
	                            {
	                            	secondresult = -1;
	                            }
	                        }

	                        if (isAfterActivated) {
	                            lowerLimit = expected.after;
	                             console.log('LOWER',lowerLimit)

	                            var startDate = actual.split('|')[0];
	                            var endDate = actual.split('|')[1];
	                            
	                            if(lowerLimit=='='){
	                            	console.log('LI');
	                            	lowerLimit = new Date('01/01/1300');
	                            }

	                            var itemDateFrom = new Date(endDate);
	                            var queryDateFrom = new Date(lowerLimit);
	                            
	                            console.log('itemDateFrom',itemDateFrom); 
	                            console.log('queryDateFrom',queryDateFrom);

		                        if (queryDateFrom.setHours(0, 0, 0, 0) <= itemDateFrom.setHours(0, 0, 0, 0)) {
	                               firstresult = 1;
	                            }
	                            else
	                            {
	                            	firstresult = -1;
	                            }
	                        }

							if(firstresult == 0){
	                        	return true;	                        	
	                        }

	                        if(secondresult == 0){
	                        	return true;	                        	
	                        }	

	                        if(firstresult == 1 && secondresult == 1){
	                        	console.log('firstresult == 1 && secondresult == 1');
								return true;	                        	
	                        }

	 						return false;

	                      
	                    } catch (e) {
	                        return false;
	                    }

	                } 

	                return true;

	            }
	            return standardComparator(actual, expected);
	        }

	        var output = filterFilter(array, expression, customComparator);
	        return output;
	    };

	}]);