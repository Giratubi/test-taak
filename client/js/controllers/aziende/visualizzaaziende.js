angular.module('pdp',['angularFileUpload']).controller('visualizzaAziendeController', ['$scope','$rootScope','$urlRouter', 'AuthService','ModalService','Factory', 'SpinnerService','Users','Pddstorageb','Authentication','$state','FileUploader','ImportContainer','Company','$timeout',
    	function ($scope,$rootScope,$urlRouter, AuthService, ModalService, Factory, SpinnerService,Users,Pddstorageb,Authentication,$state,FileUploader,ImportContainer,Company,$timeout) {
               

    	$rootScope.isLoginPage        = false;
      $rootScope.isLightLoginPage   = false;
      $rootScope.isLockscreenPage   = false;
      $rootScope.isMainPage         = false;

      showLoadingBar(100)

      initializate()


    	function initializate(){

        SpinnerService.show('spinner');

        $("#showcompanies").css('opacity','0')

        $("#showcompanies_wrapper").css('opacity','0') 


    		AuthService.getCurrentUser(function(currentUser){ 

          //console.log("currentUser",currentUser) 

          var installationcompanyId = null


          if(currentUser.roleids == '0'){

             installationcompanyId = null

          }else{

            installationcompanyId = currentUser.companyId

          }

          Company.find_({installationcompanyId:installationcompanyId}).$promise.then(function(companies) {   

              //console.log("companies",companies) 

               $("#showcompanies").css('opacity','1')

                $("#showcompanies_wrapper").css('opacity','1') 

              SpinnerService.hide('spinner'); 

                        
                   
              $scope.companies = companies.results
                
                // paginatore e campo di ricerca della tabella               

                $timeout(function(){ 

                  $("#showcompanies").dataTable({

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
                    {column_number : 1 , filter_type: 'text',filter_default_label: "Tipo Azienda"},
                    {column_number : 2, data: [{value:true,label:'In Allarme'},{value:false,label:'Stato ok'}], filter_default_label: "Seleziona Stato"},
                    {column_number : 3, filter_type: 'text',filter_default_label: "P.iva"},
                    {column_number : 4, filter_type: 'text',filter_default_label: "Email"}

                  ],{ filters_tr_index: true });
                }, 150, false); 

              });
          });
    	}


      $scope.editCompany = function(company){

          var inputs = {inputs:company}

          ModalService.showModal({
                templateUrl: "../../../views/modals/dettagliazienda.html",
                controllerjs:"js/controllers/modals/dettagliazienda.js",
                controller: "dettagliAziendaController",
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

      $scope.deleteCompany_ = function(row){

        console.log("COMPANY ROW",row)

        toastr.warning("<br /><br /><div class='text-center'><button type='button' id='yes' class='btn btn-secondary'>Si</button><button type='button' id='no' class='btn btn-secondary'>No</button></div>",'Sicuro di voler cancellare questa azienda e tutti i dati relativi associati (Gateways,Connectors,Gps,Sensori ec...) ? ',
                {
                    closeButton: false,
                    allowHtml: true,
                    positionClass: "toast-bottom-right",          
                    onclick: null,
                    tapToDismiss : false,
                    onShown: function (toast) {
                      $("#yes").click(function(){

                      	console.log("CLICCATO SI ")                      	 
                        toastr.remove(toast);	

                        SpinnerService.show('spinner'); 
                        
                        Company.delete_({companyId:row.id}).$promise.then(function(deletecompany) {

                          SpinnerService.hide('spinner');                       

	                          toastr.success("Azienda eliminata", "Avviso",opts);

	                          initializate()                        

                   		  })

                      });
                      $("#no").click(function(){
                        
                         toastr.remove(toast);
                      });
                    }

                   
                })
      }


}]);