angular
    .module('pdp')
    .controller('DashboardController', ['$scope', '$rootScope', 'AuthService', '$state', 'Messages', '$urlRouter', 'Users', '$cookieStore', 'ModalService', '$timeout', 'Company', 'SpinnerService', 'Gateway', 'Gatewayspositions', 'Connector', 'Rele', 'Gatewayradius', 'Sensorvalue', '$interval', '$timeout', 'Sensorcustomname',
        function ($scope, $rootScope, AuthService, $state, Messages, $urlRouter, Users, $cookieStore, ModalService, $timeout, Company, SpinnerService, Gateway, Gatewayspositions, Connector, Rele, Gatewayradius, Sensorvalue, $interval, $timeout, Sensorcustomname) {
            console.log("A SON CHE DASHBOARD")
            //public_vars.$pageLoadingOverlay.addClass('loaded');
            $rootScope.isLoginPage = false;
            $rootScope.isLightLoginPage = false;
            $rootScope.isLockscreenPage = false;
            $rootScope.isMainPage = false;
            $scope.isFinalOwner = false
            $scope.showSingleCompany = false
            $scope.showSingleGateway = false
            $scope.showbackbtn = false
            $scope.intervalstarted = false
            $scope.isMouseOnMap = false
            $scope.isNewAreaOpen = false
            $scope.isuserrole = false
            var map = null;
            let mapb = null;
            var options = {}
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
            // startCharts();
            function initializate() {
                $("#showcompanies").css('opacity', '0')
                $("#showcompanies_wrapper").css('opacity', '0')
                if ($scope.intervalstarted != true) {
                    SpinnerService.show('spinner');
                }
                AuthService.getCurrentUser(function (currentUser) {
                    //console.log("currentUser",currentUser) 
                    var installationcompanyId = null
                    if (currentUser.roleids == '0') {
                        installationcompanyId = null
                    } else {
                        installationcompanyId = currentUser.companyId
                    }
                    $scope.areas = [{
                        name: 'Zone Vietate',
                        type: 'V'
                    },
                    {
                        name: 'Zone di Allarme',
                        type: 'A'
                    }]
                    $scope.selectedareatype = $scope.areas[0]
                    Company.find_({ installationcompanyId: installationcompanyId }).$promise.then(function (companies) {
                        //console.log("COMPANIES",companies) 
                        SpinnerService.hide('spinner');
                        $("#showcompanies").css('opacity', '1')
                        $("#showcompanies_wrapper").css('opacity', '1')
                        $scope.companies = companies.results
                        if (companies.results.length <= 1) {
                            $scope.isFinalOwner = true
                            $scope.isuserrole = true
                            $scope.showSingleCompany = true
                            $scope.gateways = companies.results[0].gateways
                            $scope.company = companies.results[0]
                            $scope.selectCompany($scope.company, true)
                            gatewayStatus($scope.gateways)
                        } else {
                            for (var c of companies.results) {
                                if (c.gateways.length > 0) {
                                    gatewayStatus(c.gateways)
                                }
                            }
                        }
                        // paginatore e campo di ricerca della tabella               
                        $timeout(function () {
                            $("#showcompanies").dataTable({
                                retrieve: true,
                                aLengthMenu: [
                                    [25, 50, 100, -1], [25, 50, 100, "Tutti"]
                                ],
                                language: {
                                    info: "Mostra pagina _PAGE_ of _PAGES_",
                                    lengthMenu: "Mostra _MENU_ records per riga",
                                    paginate: {
                                        previous: "Indietro",
                                        next: "Avanti",
                                        first: "Prima pagina",
                                        last: "Ultima pagina"
                                    },
                                    search: "Cerca"
                                }
                            }).yadcf([
                                { column_number: 0, filter_type: 'text', filter_default_label: "Nome" },
                                { column_number: 1, filter_type: 'text', filter_default_label: "Tipo Azienda" },
                                { column_number: 2, filter_type: 'text', filter_default_label: "P.iva" },
                                { column_number: 3, filter_type: 'text', filter_default_label: "Email" }
                            ], { filters_tr_index: true });
                        }, 150, false);
                    });
                });
            }
            $scope.selectCompany = function (company, isalreadyclicked) {
                //inizializzo mappa multipin
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 5,
                    center: { lat: 41.8719, lng: 12.5674 } // Centra la mappa sull'Italia come esempio
                });
                let gtws = company.gateways.map(el => el.id);
                var filterpos = { where: { gatewayId: { inq: gtws } } }
                console.log("filterpos", filterpos);
                Gatewayspositions.find({ filter: filterpos }).$promise.then(function (gatewayspositions) {
                    console.log("tutti i gateway", gatewayspositions)
                    let ultimiPerId = [];
                    let tempObj = {};
                    const JITTER_AMOUNT = 0.0001;  // Adatta questo valore a seconda delle tue esigenze
                    gatewayspositions.forEach(record => {
                        let lat = Number(record.latitude);
                        let lng = Number(record.longitude);
                        // Verifica che la latitudine e la longitudine siano diverse da 0 e che il record sia valido
                        if (lat !== 0 && lng !== 0 && (!tempObj[record.gatewayId] || record.id > tempObj[record.gatewayId].id)) {
                            // Aggiungiamo il jitter solo dopo aver verificato che le coordinate siano valide
                            lat += (Math.random() - 0.5) * JITTER_AMOUNT;
                            lng += (Math.random() - 0.5) * JITTER_AMOUNT;
                            tempObj[record.gatewayId] = { ...record, latitude: lat.toString(), longitude: lng.toString() };
                        }
                    });
                    let latestRecordPerGateway = Object.values(tempObj);
                    latestRecordPerGateway.forEach(record => {
                        if (!ultimiPerId[record.gatewayId]) {
                            ultimiPerId.push({ lat: Number(record.latitude), lng: Number(record.longitude) });
                        }
                    });
                    for (var i = 0; i < ultimiPerId.length; i++) {
                        const letters = '0123456789ABCDEF';
                        let color = '#';
                        for (let i = 0; i < 6; i++) {
                            color += letters[Math.floor(Math.random() * 16)];
                        }
                        let marker = new google.maps.Marker({
                            position: ultimiPerId[i],
                            map: map,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: color,
                                fillOpacity: 1,
                                strokeWeight: 0
                            }
                        });
                        marker.myCustomID = latestRecordPerGateway[i].gatewayId;
                        company.gateways.filter(el => {
                            if (el.id === latestRecordPerGateway[i].gatewayId) {
                                el['markerColor'] = color
                            }
                        })
                        google.maps.event.addListener(marker, 'click', function () {
                            //alert('Hai cliccato sul marker con ID: ' + this.myCustomID);
                            let gtwCliccked = company.gateways.filter(el => {
                                if (el.id === this.myCustomID) {
                                    return true
                                } return false
                            })
                            $scope.showGateway(gtwCliccked[0])
                        });
                    }
                });
                //
                // console.log("company",company)
                $scope.gatewayscomp = company.gateways
                $scope.companysel = company
                if (!isalreadyclicked) {
                    $scope.isFinalOwner = true
                    $scope.showSingleCompany = true
                    $scope.showbackbtn = true;
                    $scope.showSingleGateway = false
                }
            }
            $scope.backToCompanyList = function () {
                //$("#showcompanies").css('display','none')
                $scope.intervalstarted = false
                $scope.isFinalOwner = false
                $scope.showSingleCompany = false
                $scope.showbackbtn = false;
                $scope.showSingleGateway = false
                $scope.gtw = null
                initializate()
            }
            $scope.changeSpeedMeasure = function (measureselected, speed) {
                //console.log("measureselected",measureselected)
                //console.log("speed",speed)
                if (measureselected.id == 1) {
                    $scope.speed = $scope.originalspeed
                }
                if (measureselected.id == 2) {
                    $scope.speed = (speed / 1.609).toFixed(2)
                }
                if (measureselected.id == 3) {
                    $scope.speed = (speed / 1.852).toFixed(2)
                }
            }
            var urlToChangeStream = 'api/Relevalues/change-stream?_format=event-stream';
            var src = new EventSource(urlToChangeStream);
            src.addEventListener('data', function (msg) {
                var data = JSON.parse(msg.data);
                console.log("GINETTO", data.data); // the change object
                //console.log("GINETTO GATEWAY",$scope.gtw)
                if (data.data.releId) {
                    var filter = { where: { id: data.data.releId } }
                    Rele.find({ filter: filter }).$promise.then(function (gate) {
                        console.log("1", gate)
                        if (gate[0].gatewayId == $scope.gtw.id) {
                            console.log("2")
                            if ($scope.isMouseOnMap == false && $scope.isNewAreaOpen == false) {
                                console.log("3", $scope.isMouseOnMap)
                                console.log("3", $scope.isNewAreaOpen)
                                SpinnerService.show('spinner');
                                //initializate()
                                var g = $scope.gtw
                                $scope.showGateway(g)
                            }
                        }
                        if (!gate[0].gatewayId) {
                            console.log("SON DAL CONNETTORE 1")
                            var filtercon = { where: { id: gate[0].connectorId } }
                            Connector.find({ filter: filtercon }).$promise.then(function (con) {
                                //console.log("SON DAL CONNETTORE 2",con[0])
                                if (con[0].gatewayId == $scope.gtw.id) {
                                    //console.log("SON DAL CONNETTORE 3 ")
                                    if ($scope.isMouseOnMap == false && $scope.isNewAreaOpen == false) {
                                        //console.log("3",$scope.isMouseOnMap)
                                        //console.log("3", $scope.isNewAreaOpen)
                                        SpinnerService.show('spinner');
                                        //initializate()
                                        var g = $scope.gtw
                                        $scope.showGateway(g)
                                    }
                                }
                            })
                        }
                    });
                }
            });
            // $interval(function () {
            //     $scope.intervalstarted = true
            //     if ($scope.gtw && $scope.isMouseOnMap == false && $scope.isNewAreaOpen == false) {
            //         $scope.showGateway($scope.gtw)
            //         initializate()
            //     }
            // }, 60000)
            $scope.showGateway = function (gtw) {
                console.log("chiamato GTW", gtw)
                if ($scope.intervalstarted != true) {
                    SpinnerService.show('spinner');
                }
                $scope.gtw = gtw
                $scope.measures = [{
                    id: 1,
                    unit: 'Km/h'
                },
                {
                    id: 2,
                    unit: 'Mi/h'
                },
                {
                    id: 3,
                    unit: 'kn'
                }]
                $scope.measureselected = $scope.measures[0]
                Gateway.find_({ id: gtw.id }).$promise.then(function (gate) {
                    console.log("gate", gate)
                    $scope.showSingleGateway = true
                    SpinnerService.hide('spinner');
                    $scope.lastsignal = new Date(Number(gate.results.reciveddate * 1000))
                    //console.log('LASTT SIGNALE',$scope.lastsignal);
                    $scope.gateway = gate.results
                    gatewayStatus([$scope.gateway])
                    if ($scope.gateway.voltsensor.length > 0) {
                        $scope.gtwvolts = $scope.gateway.voltsensor[0].value
                    } else {
                        $scope.gtwvolts = 0
                    }
                    // aggiungere un between con la data ( ultimi 10 record) per snellire la find
                    var filterforsen = { where: { code: $scope.gateway.id } }
                    Sensorvalue.find({ filter: filterforsen }).$promise.then(function (volt) {
                        if (volt.length > 0) {
                            //$scope.lastsignal = new Date(volt[volt.length-1].reciveddate * 1000)
                        } else {
                            //$scope.lastsignal = 'Non pervenuta'
                        }
                    });
                    $scope.connectors = gate.results.connectors
                    $scope.rele = gate.results.rele
                    $scope.alarms = gate.results.listofalarms
                    $timeout(function () {
                        $("#showalarms").dataTable({
                            retrieve: true,
                            paging: false,
                            ordering: false,
                            info: false,
                            searching: false,
                            aLengthMenu: [
                                [25, 50, 100, -1], [25, 50, 100, "Tutti"]
                            ],
                            language: {
                                info: "Mostra pagina _PAGE_ of _PAGES_",
                                lengthMenu: "Mostra _MENU_ records per riga",
                                paginate: {
                                    previous: "Indietro",
                                    next: "Avanti",
                                    first: "Prima pagina",
                                    last: "Ultima pagina"
                                },
                                search: "Cerca"
                            }
                        })
                    }, 50, false);
                    $timeout(function () {
                        $("#showconnectors").dataTable({
                            retrieve: true,
                            paging: false,
                            ordering: false,
                            info: false,
                            searching: false,
                            aLengthMenu: [
                                [25, 50, 100, -1], [25, 50, 100, "Tutti"]
                            ],
                            language: {
                                info: "Mostra pagina _PAGE_ of _PAGES_",
                                lengthMenu: "Mostra _MENU_ records per riga",
                                paginate: {
                                    previous: "Indietro",
                                    next: "Avanti",
                                    first: "Prima pagina",
                                    last: "Ultima pagina"
                                },
                                search: "Cerca"
                            }
                        })
                        $("#showrele").dataTable({
                            retrieve: true,
                            paging: false,
                            ordering: false,
                            info: false,
                            searching: false,
                            aLengthMenu: [
                                [25, 50, 100, -1], [25, 50, 100, "Tutti"]
                            ],
                            language: {
                                info: "Mostra pagina _PAGE_ of _PAGES_",
                                lengthMenu: "Mostra _MENU_ records per riga",
                                paginate: {
                                    previous: "Indietro",
                                    next: "Avanti",
                                    first: "Prima pagina",
                                    last: "Ultima pagina"
                                },
                                search: "Cerca"
                            }
                        })
                    }, 150, true);
                    var filterareas = { where: { and: [{ gatewayId: gate.results.id }, { radiustype: $scope.selectedareatype.type }] } }
                    //var lat = Number(gate.results.lat)
                    //var lon = Number(gate.results.lon)
                    Gatewayradius.find({ filter: filterareas }).$promise.then(function (gatewaysradius) {
                        // console.log("gatewaysradius",gatewaysradius) 
                        map = null
                        var areacolor = null
                        if ($scope.selectedareatype.type == "V") {
                            areacolor = '#FF0000'
                        }
                        if ($scope.selectedareatype.type == "A") {
                            areacolor = '#45602f'
                        }
                        var filterpos = { where: { gatewayId: gate.results.id } }
                        Gatewayspositions.find({ filter: filterpos }).$promise.then(function (gatewayspositions) {
                            console.log("gatewayspositions", gatewayspositions)
                            filterespos = gatewayspositions.filter(el => {
                                if (el.latitude > 0 && el.longitude > 0 && el.sat > 0 && el.distance < 10000 && el.distance > 1) {
                                    return true
                                }
                                return false
                            })
                            //filterespos = gatewayspositions
                            $scope.positionfilterd = filterespos
                            console.log("filterespos", filterespos)
                            if (gtw.maptype) {
                                if (filterespos.length > 0) {
                                    var gatewaypath = []
                                    var editable = true;
                                    for (var [index, po] of filterespos.entries()) {
                                        //console.log("index",index)
                                        var firstdate = filterespos[filterespos.length - 1].reciveddate
                                        var seconddate = filterespos[index].reciveddate
                                        var datedifferent = firstdate - seconddate
                                        var obj = {
                                            lat: Number(po.latitude),
                                            lng: Number(po.longitude)
                                        }
                                        if (datedifferent <= 172800000) {    //  48h  in millisecond
                                            gatewaypath.push(obj)
                                        }
                                    }
                                    console.log("gatewaypath", gatewaypath)
                                    var lat = Number(gatewaypath[gatewaypath.length - 1].lat)
                                    var lon = Number(gatewaypath[gatewaypath.length - 1].lng)
                                    $scope.lat = lat
                                    $scope.lon = lon
                                    // mapbox
                                    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lyYXR1YmkiLCJhIjoiY2swMjVkYjlsMDBtajNubzJ5d2hoYWRqNiJ9.jRLdnDtelDLninFKQF1NIQ';
                                    mapb = new mapboxgl.Map({
                                        container: 'mapb', // container ID
                                        style: 'mapbox://styles/-taaak-/clm62zjz100xo01pbayureo6o', // URL dello stile che hai fornito
                                        center: [lon, lat], // Coordinate iniziali. Le ho prese dal tuo URL, ma puoi modificarle se necessario.
                                        zoom: 15 // Zoom iniziale. Anche questo l'ho preso dal tuo URL.
                                    });
                                    mapb.on('load', () => {
                                        var markerB = new mapboxgl.Marker()
                                            .setLngLat(mapb.getCenter())
                                            .addTo(mapb);
                                        var geojson = {
                                            "type": "Feature",
                                            "properties": {},
                                            "geometry": {
                                                "type": "LineString",
                                                "coordinates": gatewaypath.map(point => [point.lng, point.lat])
                                            }
                                        };
                                        mapb.addSource('polylineSource', {
                                            "type": "geojson",
                                            "data": geojson
                                        });
                                        mapb.addLayer({
                                            "id": "polylineLayer",
                                            "type": "line",
                                            "source": "polylineSource",
                                            "layout": {},
                                            "paint": {
                                                "line-color": "#181fd7",
                                                "line-width": 2,
                                                "line-opacity": 1.0
                                            }
                                        });
                                        if (gatewaysradius.length > 0) {
                                            var positions = gatewaysradius;
                                            for (var pos of positions) {
                                                if (pos.radiustype == "V" && $scope.isuserrole == true) {
                                                    editable = false;  // Modifica solo il valore
                                                }
                                                var center = [Number(pos.longitude), Number(pos.latitude)];
                                                var circlePolygon = turf.circle(center, Number(pos.radius), { steps: 100, units: 'meters' });
                                                mapb.addLayer({
                                                    id: pos.id.toString(),
                                                    type: 'fill',
                                                    source: {
                                                        type: 'geojson',
                                                        data: circlePolygon
                                                    },
                                                    paint: {
                                                        'fill-color': areacolor,
                                                        'fill-opacity': 0.50,
                                                        'fill-outline-color': areacolor
                                                    }
                                                });
                                                mapb.on("click", pos.id.toString(), function (event) {
                                                    $scope.selectedarea = event.features[0].id;
                                                    $('#showdeletearea').hide();
                                                    $('#showdeleteareaForNew').hide();
                                                    $timeout(function () {
                                                        if (editable == true) {
                                                            $('#showdeletearea').show();
                                                        }
                                                    }, 500, true);
                                                });
                                                mapb.on("mouseenter", pos.id.toString(), function () {
                                                    $scope.isMouseOnMap = true;
                                                    mapb.dragPan.disable();
                                                    document.querySelector('.mapboxgl-canvas').style.cursor = 'pointer';
                                                });
                                                mapb.on("mouseout", pos.id.toString(), function () {
                                                    $scope.isMouseOnMap = false;
                                                    mapb.dragPan.enable();
                                                    document.querySelector('.mapboxgl-canvas').style.cursor = '';
                                                });
                                            }
                                        }
                                    });
                                }
                            } else {
                                if (filterespos.length > 0) {
                                    var gatewaypath = []
                                    for (var [index, po] of filterespos.entries()) {
                                        //console.log("index",index)
                                        var firstdate = filterespos[filterespos.length - 1].reciveddate
                                        var seconddate = filterespos[index].reciveddate
                                        var datedifferent = firstdate - seconddate
                                        var obj = {
                                            lat: Number(po.latitude),
                                            lng: Number(po.longitude)
                                        }
                                        if (datedifferent <= 172800000) {    //  48h  in millisecond
                                            gatewaypath.push(obj)
                                        }
                                    }
                                    console.log("gatewaypath", gatewaypath)
                                    var lat = Number(gatewaypath[gatewaypath.length - 1].lat)
                                    var lon = Number(gatewaypath[gatewaypath.length - 1].lng)
                                    $scope.lat = lat
                                    $scope.lon = lon
                                    console.log("LAT", lat)
                                    console.log("LON", lon)
                                    $scope.speed = gatewayspositions[gatewayspositions.length - 1].speed
                                    $scope.originalspeed = gatewayspositions[gatewayspositions.length - 1].speed
                                    $timeout(function () {
                                        var static_position = new google.maps.LatLng(lat, lon);
                                        var the_circle = null;
                                        $scope.static_position = static_position;
                                        map = new google.maps.Map(document.getElementById('mapgtw'), {
                                            center: static_position,
                                            zoom: 15,
                                            draggable: false,
                                            draggableCursor: 'pointer',
                                        });
                                        var image =
                                            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
                                        var beachMarker = new google.maps.Marker({
                                            position: { lat: lat, lng: lon },
                                            map,
                                            icon: image,
                                        });
                                        var flightPath = new google.maps.Polyline({
                                            path: gatewaypath,
                                            geodesic: true,
                                            strokeColor: "#181fd7",
                                            strokeOpacity: 1.0,
                                            strokeWeight: 2,
                                        });
                                        flightPath.setMap(map);
                                        //console.log("gatewaypath",gatewaypath)
                                        if (gatewaysradius.length > 0) {
                                            var positions = gatewaysradius
                                            var areas = null
                                            var editable = true
                                            for (var pos of positions) {
                                                //console.log("POS",pos)
                                                var objpos = {
                                                    pos: {
                                                        center: { lat: Number(pos.latitude), lng: Number(pos.longitude) }
                                                    }
                                                };
                                                if (pos.radiustype == "V" && $scope.isuserrole == true) {
                                                    editable = false
                                                    //console.log("$scope.isFinalOwner",$scope.isFinalOwner)
                                                    //console.log("editable",editable)
                                                }
                                                areas = new google.maps.Circle({
                                                    strokeColor: areacolor,
                                                    strokeOpacity: 0.8,
                                                    strokeWeight: 2,
                                                    fillColor: areacolor,
                                                    fillOpacity: 0.35,
                                                    map,
                                                    editable: editable,
                                                    center: objpos.pos.center,
                                                    radius: Number(pos.radius),
                                                    id: pos.id,
                                                });
                                                map.addListener("mouseover", () => {
                                                    //console.log("SONO NEL MOUSE OVER")
                                                    $scope.isMouseOnMap = true
                                                });
                                                map.addListener("mouseout", () => {
                                                    //console.log("SONO NEL MOUSE mouseout")
                                                    $scope.isMouseOnMap = false
                                                });
                                                google.maps.event.addListener(areas, 'radius_changed', function (event) {
                                                    var obj = {
                                                        latitude: this.getCenter().lat(),
                                                        longitude: this.getCenter().lng(),
                                                        radius: this.getRadius()
                                                    }
                                                    var id = this.id
                                                    Gatewayradius.updateAttributes({ id: id }, obj).$promise.then(function (gtwpos) {
                                                        $('#showdeletearea').hide()
                                                        initializate()
                                                        toastr.success("Diametro area aggiornato correttamente", "Avviso", opts);
                                                    });
                                                });
                                                google.maps.event.addListener(areas, 'center_changed', function (event) {
                                                    var obj = {
                                                        latitude: this.getCenter().lat(),
                                                        longitude: this.getCenter().lng(),
                                                        radius: this.getRadius()
                                                    }
                                                    var id = this.id
                                                    Gatewayradius.updateAttributes({ id: id }, obj).$promise.then(function (gtwpos) {
                                                        $('#showdeletearea').hide()
                                                        initializate()
                                                        toastr.success("Posizione area aggiornata correttamente", "Avviso", opts);
                                                    });
                                                });
                                                google.maps.event.addListener(areas, 'click', function (event) {
                                                    $scope.selectedarea = this.id
                                                    console.log("$scope.selectedarea", $scope.selectedarea)
                                                    $('#showdeletearea').hide()
                                                    $('#showdeleteareaForNew').hide()
                                                    $timeout(function () {
                                                        if (editable == true) {
                                                            $('#showdeletearea').show()
                                                        }
                                                    }, 500, true);
                                                });
                                            }
                                        }
                                        var mousemove_handler;
                                        map.setOptions({ draggable: true, draggableCursor: '' });
                                    }, 1000, true);
                                }
                            }
                            // if(filterespos.length >0){
                            //   var gatewaypath =[] 
                            //   for (var [index, po] of filterespos.entries()){
                            //       //console.log("index",index)
                            //       var firstdate = filterespos[filterespos.length-1].reciveddate
                            //       var seconddate = filterespos[index].reciveddate
                            //       var datedifferent = firstdate - seconddate 
                            //       var obj = {lat:Number(po.latitude),
                            //             lng:Number(po.longitude)}
                            //       if(datedifferent <= 172800000){    //  48h  in millisecond
                            //           gatewaypath.push(obj)
                            //       }
                            //   }
                            //   console.log("gatewaypath",gatewaypath)
                            //   var lat = Number(gatewaypath[gatewaypath.length-1].lat)
                            //   var lon = Number(gatewaypath[gatewaypath.length-1].lng)
                            //   $scope.lat = lat
                            //   $scope.lon = lon
                            //   // mapbox
                            //   mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lyYXR1YmkiLCJhIjoiY2swMjVkYjlsMDBtajNubzJ5d2hoYWRqNiJ9.jRLdnDtelDLninFKQF1NIQ';
                            //   const mapb = new mapboxgl.Map({
                            //     container: 'mapb', // container ID
                            //     style: 'mapbox://styles/-taaak-/clm62zjz100xo01pbayureo6o', // URL dello stile che hai fornito
                            //     center: [lon,lat], // Coordinate iniziali. Le ho prese dal tuo URL, ma puoi modificarle se necessario.
                            //     zoom: 15 // Zoom iniziale. Anche questo l'ho preso dal tuo URL.
                            //   });
                            //   mapb.on('load', () => {
                            //     mapb.addLayer({
                            //       id: 'terrain-data',
                            //       type: 'line',
                            //       source: {
                            //         type: 'vector',
                            //         url: 'mapbox://mapbox.mapbox-terrain-v2'
                            //       },
                            //       'source-layer': 'contour'
                            //     });
                            //     var markerB = new mapboxgl.Marker()
                            //       .setLngLat(mapb.getCenter())
                            //       .addTo(mapb);
                            //   });
                            //   // mapbox end
                            //   console.log("LAT",lat)
                            //   console.log("LON",lon)
                            //   $scope.speed = gatewayspositions[gatewayspositions.length-1].speed
                            //   $scope.originalspeed = gatewayspositions[gatewayspositions.length-1].speed
                            //   $timeout(function(){      
                            //     var static_position = new google.maps.LatLng(lat, lon);
                            //     var the_circle = null;
                            //     $scope.static_position = static_position;
                            //     map = new google.maps.Map(document.getElementById('mapgtw'), {
                            //         center: static_position,
                            //         zoom: 15,
                            //         draggable: false,
                            //         draggableCursor:'pointer',
                            //     });
                            //     var image =
                            //       "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
                            //     var beachMarker = new google.maps.Marker({
                            //       position: { lat: lat, lng: lon },
                            //       map,
                            //       icon: image,
                            //     });
                            //     var flightPath = new google.maps.Polyline({
                            //         path: gatewaypath,
                            //         geodesic: true,
                            //         strokeColor: "#181fd7",
                            //         strokeOpacity: 1.0,
                            //         strokeWeight: 2,
                            //       });
                            //       flightPath.setMap(map);
                            //       //console.log("gatewaypath",gatewaypath)
                            //     if(gatewaysradius.length >0){
                            //       var positions = gatewaysradius
                            //       var areas = null 
                            //       var editable = true         
                            //       for (var pos of positions){
                            //         //console.log("POS",pos)
                            //         var objpos = {
                            //           pos: {
                            //             center: { lat: Number(pos.latitude), lng: Number(pos.longitude) }            
                            //           }
                            //         };
                            //         if(pos.radiustype == "V" && $scope.isuserrole == true){
                            //           editable = false
                            //           //console.log("$scope.isFinalOwner",$scope.isFinalOwner)
                            //           //console.log("editable",editable)
                            //         }          
                            //       areas = new google.maps.Circle({
                            //           strokeColor:areacolor,
                            //           strokeOpacity: 0.8,
                            //           strokeWeight: 2,
                            //           fillColor: areacolor,
                            //           fillOpacity: 0.35,
                            //           map,
                            //           editable: editable,
                            //           center: objpos.pos.center,
                            //           radius: Number(pos.radius),
                            //           id:pos.id,
                            //         });
                            //         map.addListener("mouseover", () => {
                            //             //console.log("SONO NEL MOUSE OVER")
                            //             $scope.isMouseOnMap = true
                            //         }); 
                            //           map.addListener("mouseout", () => {
                            //             //console.log("SONO NEL MOUSE mouseout")
                            //             $scope.isMouseOnMap = false
                            //         }); 
                            //         google.maps.event.addListener(areas, 'radius_changed', function (event) {
                            //             var obj = {latitude:this.getCenter().lat(),
                            //                     longitude:this.getCenter().lng(),
                            //                     radius:this.getRadius()}
                            //             var id = this.id
                            //             Gatewayradius.updateAttributes({id:id},obj).$promise.then(function(gtwpos){           
                            //               $('#showdeletearea').hide()
                            //               initializate()
                            //               toastr.success("Diametro area aggiornato correttamente", "Avviso",opts);            
                            //             });      
                            //         });
                            //         google.maps.event.addListener(areas, 'center_changed', function (event) {
                            //             var obj = {latitude:this.getCenter().lat(),
                            //                     longitude:this.getCenter().lng(),
                            //                     radius:this.getRadius()}
                            //             var id = this.id
                            //             Gatewayradius.updateAttributes({id:id},obj).$promise.then(function(gtwpos){           
                            //               $('#showdeletearea').hide()
                            //               initializate()
                            //               toastr.success("Posizione area aggiornata correttamente", "Avviso",opts); 
                            //             });
                            //         });               
                            //         google.maps.event.addListener(areas, 'click', function (event) {
                            //           $scope.selectedarea = this.id
                            //           console.log("$scope.selectedarea",$scope.selectedarea)
                            //           $('#showdeletearea').hide()
                            //           $('#showdeleteareaForNew').hide()
                            //           $timeout(function(){
                            //             if(editable == true){
                            //                 $('#showdeletearea').show()
                            //             }
                            //             }, 500, true);
                            //         });          
                            //       }
                            //     }
                            //     var mousemove_handler;
                            //     map.setOptions({draggable:true, draggableCursor:''});                  
                            //   }, 1000, true);
                            // }
                        })
                    });
                })
            }
            $scope.setBatimetricMap = function (gateway) {
                console.log("clicco switch ed ho gateway", gateway);
                let maptype = 0
                if (gateway.maptype) {
                    maptype = 0;
                } else {
                    maptype = 1;
                }
                Gateway.updateAttributes({ id: gateway.id }, { maptype: maptype }).$promise.then(function (res) {
                    $scope.showGateway(gateway);
                })
            }
            $scope.newAreaClick = function ($event) {
                var statusdiv = document.getElementById('gpssettings');
                var checkstatus = statusdiv.classList.contains('in')
                if (checkstatus == false) {
                    $scope.isNewAreaOpen = true
                }
                if (checkstatus == true) {
                    $scope.isNewAreaOpen = false
                }
                console.log("checkstatus", checkstatus)
            }
            $scope.changeAreas = function () {
                $scope.showGateway($scope.gtw)
                SpinnerService.show('spinner');
            }
            $scope.addNewArea = function () {
                if ($scope.selectedareatype.type == "V" && $scope.isuserrole == true) {
                    toastr.error("L'utente non è abilitato ad aggiungere aree vietate", "Avviso", opts);
                    return;
                } else {
                    createCircle($scope.static_position, $scope.radius)
                }
            }

            /// mapbox new row button
            document.getElementById('stileBase').addEventListener('click', function() {
                mapb.setStyle('mapbox://styles/mapbox/streets-v11');
            });
            document.getElementById('stileSatellite').addEventListener('click', function() {
                mapb.setStyle('mapbox://styles/mapbox/satellite-v9');
            });
            document.getElementById('stileBatimetrico').addEventListener('click', function() {
                mapb.setStyle('mapbox://styles/-taaak-/clm62zjz100xo01pbayureo6o');
            });
            let isAddingArea = false;
            let centerMarker, resizeMarker, circleLayerId;
            
            function setMarkerListeners(centerMarker, resizeMarker, circleLayerId) {
                centerMarker.on('drag', function() {
                    const newCenter = centerMarker.getLngLat();
                    // Sposta anche il marker di ridimensionamento
                    const bearing = turf.bearing(newCenter.toArray(), resizeMarker.getLngLat().toArray());
                    const distance = turf.distance(newCenter.toArray(), resizeMarker.getLngLat().toArray(), 'meters');
                    const newEdgePoint = turf.destination(newCenter.toArray(), distance, bearing, 'meters').geometry.coordinates;
                    resizeMarker.setLngLat(newEdgePoint);
                    updateCircle(newCenter, distance);
                });
                resizeMarker.on('drag', function() {
                    const center = centerMarker.getLngLat();
                    const edge = resizeMarker.getLngLat();
                    const newRadius = Math.max(1, turf.distance(center.toArray(), edge.toArray(), 'meters'));
                    updateCircle(center, newRadius);
                });
                function updateCircle(center, radius) {
                    radius = Math.max(1, radius);
                    const newCircle = turf.circle(center.toArray(), radius, {steps: 100, units: 'meters'});
                    mapb.getSource(circleLayerId).setData(newCircle);
                }
            }
            $scope.dashboard = {
                radius: null,
                addArea: function() {
                    if (this.radius) {
                        const center = mapb.getCenter().toArray();
                        const circleOptions = { steps: 100, units: 'meters' };
                        const circlePolygon = turf.circle(center, this.radius, circleOptions);
                        circleLayerId = Date.now().toString();
                        if (mapb.getSource(circleLayerId)) {
                            mapb.removeLayer(circleLayerId);
                            mapb.removeSource(circleLayerId);
                        }
                        mapb.addSource(circleLayerId, {
                            type: 'geojson',
                            data: circlePolygon
                        });
                        mapb.addLayer({
                            id: circleLayerId,
                            type: 'fill',
                            source: circleLayerId,
                            paint: {
                                'fill-color': '#FF0000',
                                'fill-opacity': 0.9,
                                'fill-outline-color': '#000000'
                            }
                        });
                        centerMarker = new mapboxgl.Marker({
                            color: "#000000",
                            draggable: true
                        }).setLngLat(center).addTo(mapb);
            
                        centerMarker.on('dragend', function() {
                            const newCenter = centerMarker.getLngLat();
                            $scope.latitude = newCenter.lat;
                            $scope.longitude = newCenter.lng;
                            $scope.radius = $scope.dashboard.radius;
                            $scope.$apply(); // Assicurati che AngularJS rilevi le modifiche
                        });
                    } else {
                        alert("Per favore, inserisci un raggio valido.");
                    }
                }
            };
            /// mapbox new row button end

            function createCircle(center, radius) {
                $('#showdeletearea').hide()
                //console.log("center",center)
                $scope.radius = null
                $scope.latitude = null
                $scope.longitude = null
                $scope.radius = parseFloat(document.getElementById('raggioInput').value);
                if (isNaN($scope.radius) && $scope.radius <= 0) {
                    alert("Per favore, inserisci un valore valido per il raggio.");
                }
                if (!isAddingArea) { 
                    isAddingArea = true;
                    const center = mapb.getCenter().toArray(); 
                    const radius = $scope.radius; 
                    const circleOptions = { steps: 100, units: 'meters' };
                    const circlePolygon = turf.circle(center, radius, circleOptions);
                    circleLayerId = Date.now().toString();
                    if (mapb.getSource(circleLayerId)) { // Elimina la sorgente e il layer esistenti se ci sono
                        mapb.removeLayer(circleLayerId);
                        mapb.removeSource(circleLayerId);
                    }
                    mapb.addSource(circleLayerId, {
                        type: 'geojson',
                        data: circlePolygon
                    });
                    mapb.addLayer({
                        id: circleLayerId,
                        type: 'fill',
                        source: circleLayerId,
                        paint: {
                            'fill-color': '#FF0000',
                            'fill-opacity': 0.9,
                            'fill-outline-color' : '#000000'
                        }
                    });
                    mapb.moveLayer(circleLayerId);
                    centerMarker = new mapboxgl.Marker({
                        color: "#000000",
                        draggable: true
                    }).setLngLat(center).addTo(mapb);
                    resizeElement = document.createElement('div');
                    resizeElement.style.width = '20px';
                    resizeElement.style.height = '20px';
                    resizeElement.style.background = 'blue';
                    resizeElement.style.border = '2px solid white';
                    resizeElement.style.borderRadius = '50%';
                    resizeElement.style.zIndex = '9999';
                    try {
                        const edgePoint = turf.destination(center, radius, 100, 'meters').geometry.coordinates;
                        console.log("Punto di bordo:", edgePoint);
                        resizeMarker = new mapboxgl.Marker(resizeElement)
                            .setLngLat(edgePoint)
                            .setDraggable(true)
                            .addTo(mapb);
                    } catch (error) {
                        console.error("Errore nella creazione del marker:", error);
                    }
                    setMarkerListeners(centerMarker, resizeMarker, circleLayerId);
                    isAddingArea = false;
                }
                return circle;
            }
            $scope.removeArea = function () {
                if ($scope.selectedareatype.type == "V" && $scope.isuserrole == true) {
                    toastr.error("L'utente non è abilitato ad aggiungere aree vietate", "Avviso", opts);
                    return;
                } else {
                    toastr.warning("<br /><br /><div class='text-center'><button type='button' id='yes' class='btn btn-secondary'>Si</button><button type='button' id='no' class='btn btn-secondary'>No</button></div>", 'Sicuro di voler cancellare questa area?',
                        {
                            closeButton: false,
                            allowHtml: true,
                            positionClass: "toast-bottom-right",
                            onclick: null,
                            tapToDismiss: false,
                            onShown: function (toast) {
                                $("#yes").click(function () {
                                    Gatewayradius.deleteById({ id: $scope.selectedarea }).$promise.then(function (deletearea) {
                                        $('#showdeletearea').hide()
                                        toastr.remove(toast);
                                        $scope.showGateway($scope.gtw)
                                        toastr.success("Area Eliminata", "Avviso", opts);
                                    })
                                });
                                $("#no").click(function () {
                                    toastr.clear()
                                });
                            }
                        })
                }
            }
            $scope.removeNewArea = function () {
                $scope.newCircle.setMap(null);
                $scope.newCircle = null
                $('#showdeleteareaForNew').hide()
            }
            $scope.saveNewArea = function () {
                var obj = {
                    gatewayId: $scope.gateway.id,
                    latitude: $scope.latitude,
                    longitude: $scope.longitude,
                    radius: $scope.radius,
                    radiustype: $scope.selectedareatype.type,
                    emailsent: 0
                }
                //console.log("OBJ MAPPA",obj)
                Gatewayradius.create(obj).$promise.then(function (gtwarea) {
                    $scope.showGateway($scope.gtw)
                    $('#showdeleteareaForNew').hide()
                    $scope.radius = null
                    toastr.success("Nuova Area inserita correttamente", "Avviso", opts);
                });
            }
            function gatewayStatus(gateway) {
                // console.log("grillo",gateway)
                for (var g of gateway) {
                    if (g.hasOwnProperty('background')) {
                        g.background = ''
                        //console.log("SONO DENTR al property",g)
                    } else {
                        g['background'] = ""
                    }
                    if (g.hasalarm == false && g.nosignal == false) {
                        g.background = 'green'
                    }
                    if ((g.hasalarm == false && g.nosignal == true) || (g.hasalarm == true && g.nosignal == true)) {
                        g.background = 'yellow'
                    }
                    if (g.hasalarm == true && g.nosignal == false) {
                        g.background = 'red'
                    }
                    //console.log("g",g)
                }
                //console.log("SON QUA BELLO",$scope.gatewayscomp)
            }
            $scope.editGateway = function (gateway) {
                // console.log("gateway",gateway)
                var inputs = { inputs: gateway }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/dettagligateway.html",
                    controllerjs: "js/controllers/modals/dettagligateway.js",
                    controller: "dettagliGatewayController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        initializate();
                        $scope.gtw = result
                        gatewayStatus([result])
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.updateGatewayReleName = function () {
                if ($scope.gateway.relename == null || $scope.gateway.relename.length <= 0) {
                    toastr.error("Non è stato inserito un nome al Gateway Relè", "Avviso", opts);
                    return;
                }
                var obj = {
                    relename: $scope.gateway.relename
                }
                Gateway.updateAttributes({ id: $scope.gtw.id }, obj).$promise.then(function (gtw) {
                    toastr.success("Relè Gateway aggiornato correttamente", "Avviso", opts);
                    $scope.showGateway($scope.gtw)
                });
            }
            $scope.updateSensorName = function (row) {
                console.log("aggiornato nome sensore", row)
                var obj = {
                    connectorId: row.connectorId,
                    gatewayId: $scope.gtw.id,
                    sensortypeId: row.sensortypeId,
                    name: row.sensortype.name
                }
                console.log("OBJ SENSORE NOME", obj)
                Sensorcustomname.updateAttributes_({ obj: obj }).$promise.then(function (senname) {
                    toastr.success("Nome Sensore aggiornato correttamente", "Avviso", opts);
                });
            }
            $scope.updateConnector = function (row) {
                if (row.name == null || row.name.length <= 0) {
                    toastr.error("Non è stato inserito un nome al connettore", "Avviso", opts);
                    return;
                }
                var obj = { name: row.name }
                Connector.updateAttributes({ id: row.id }, obj).$promise.then(function (connector) {
                    toastr.success("Azienda aggiornata correttamente", "Avviso", opts);
                    $scope.showGateway($scope.gtw)
                });
            }
            $scope.updateReleName = function (int) {
                if (int.name == null || int.name.length <= 0) {
                    toastr.error("Non è stato inserito un nome al Relè", "Avviso", opts);
                    return;
                }
                var obj = { name: int.name }
                Rele.updateAttributes({ id: int.id }, obj).$promise.then(function (rele) {
                    toastr.success("Nome Interruttore Relè aggiornato correttamente", "Avviso", opts);
                    $scope.showGateway($scope.gtw)
                });
            }
            $scope.setAlarms = function (sensor) {
                var inputs = { inputs: sensor }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/impostaallarme.html",
                    controllerjs: "js/controllers/modals/impostaallarme.js",
                    controller: "impostaAllarmeController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        //initializate();
                        $scope.showGateway($scope.gtw)
                        // gatewayStatus([$scope.gateway])
                        // console.log("HO CIUSO",$scope.company.gateways)
                        //$scope.showGateway()                                
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.setAlarmsRele = function (sensor) {
                var inputs = { inputs: sensor }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/impostaallarmerele.html",
                    controllerjs: "js/controllers/modals/impostaallarmerele.js",
                    controller: "impostaAllarmeReleController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        $scope.showGateway($scope.gtw)
                        initializate()
                        //$scope.showGateway()                                
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.setAlarmsVolt = function (sensor) {
                var inputs = { inputs: sensor }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/impostaallarmevoltaggio.html",
                    controllerjs: "js/controllers/modals/impostaallarmevoltaggio.js",
                    controller: "impostaAllarmeVoltaggioController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        //initializate();
                        initializate()
                        $scope.showGateway($scope.gtw)
                        //$scope.showGateway()                                
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.deleteCompany = function (row) {
                console.log("COMPANY ROW", row)
                toastr.warning("<br /><br /><div class='text-center'><button type='button' id='yes' class='btn btn-secondary'>Si</button><button type='button' id='no' class='btn btn-secondary'>No</button></div>", 'Sicuro di voler cancellare questa azienda e tutti i dati relativi associati (Gateways,Connectors,Gps,Sensori ec...) ? ',
                    {
                        closeButton: false,
                        allowHtml: true,
                        positionClass: "toast-bottom-right",
                        onclick: null,
                        tapToDismiss: false,
                        onShown: function (toast) {
                            $("#yes").click(function () {
                                console.log("CLICCATO SI ")
                                toastr.remove(toast);
                                SpinnerService.show('spinner');
                                Company.delete_({ companyId: row.id }).$promise.then(function (deletecompany) {
                                    SpinnerService.hide('spinner');
                                    toastr.success("Azienda eliminata", "Avviso", opts);
                                    initializate()
                                })
                            });
                            $("#no").click(function () {
                                toastr.remove(toast);
                            });
                        }
                    })
            }
            function _logout() {
                AuthService.logout().then(
                    function () {
                        if ($cookieStore.get(self.currentUser.username)) {
                            $cookieStore.remove(self.currentUser.username);
                        }
                        window.location.href = location.protocol + '//' + location.host;
                    });
            };
            $rootScope.logout = function () {
                _logout();
            }
            /*function startCharts(){
                console.log("ENTRATO NELLA FUNZIONE")
                var sample_notification;
                  setTimeout(function()
                  { 
                  var $ = jQuery;   
                  // Notifications
                  window.clearTimeout(sample_notification);
                  // grafico temperature 
                  var dataSource = [
                          { hour: '10:30', temperature: 20 },
                          { hour: '11:00', temperature: 21 },
                          { hour: '11:30', temperature: 22 },
                          { hour: '12:00', temperature: 20 },
                          { hour: '12:30', temperature: 19 },
                          { hour: '13:00', temperature: 17 },
                          { hour: '13:30', temperature: 23 },
                          { hour: '14:00', temperature: 23 },
                          { hour: '14:30', temperature: 23 },
                          { hour: '15:00', temperature: 24 },
                          { hour: '15:30', temperature: 23 }
                        ];
                        $("#bar-3").dxChart({
                          dataSource: dataSource,
                          commonSeriesSettings: {
                            argumentField: "hour"
                          },
                          series: [
                            { valueField: "temperature", name: "Temperatura", color: "#40bbea" },
                          ],
                          argumentAxis:{
                            grid:{
                              visible: true
                            }
                          },
                          tooltip:{
                            enabled: true,
                            customizeText: function () {                         
                              return this.value + ' C°' }
                          },
                          title: "Andamento Sensore temperatura ultime 5 ore",
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
                        });
                       // temperatura attuale
                        var gauge = $('#gauge-1').dxCircularGauge({
                          scale: {
                            startValue: 0,
                            endValue: 150,
                            majorTick: {
                              tickInterval: 10
                            }
                          },
                          rangeContainer: {
                            palette: 'pastel',
                            ranges: [
                              { startValue: 50, endValue: 90, color: '#8dc63f' },
                              { startValue: 90, endValue: 130, color: '#ffba00' },
                              { startValue: 130, endValue: 150, color: '#cc3f44' },
                            ]
                          },
                          title: {
                            text: 'Temperatura Attuale',
                            font: { size: 28 ,weight: 200}                     
                          },
                          value: 23
                        }).dxCircularGauge('instance');
                        // umidità attuale
                        var c1 = $('#gauge-4-1');
                        var options = {
                          geometry: {
                            startAngle: 180, endAngle: 0
                          },
                          scale: {
                            startValue: 0, endValue: 100,
                            majorTick: {
                              tickInterval: 50
                            },
                            label: {
                              customizeText: function (arg) {
                                return arg.valueText + ' %';
                              }
                            }                      
                          }
                        };
                        c1.dxCircularGauge($.extend(true, {}, options, {
                          value: 75,
                          valueIndicator: {
                            type: 'rectangleNeedle',
                            color: '#40bbea'
                          },
                          title: {
                              text: 'Umidità Attuale',
                              font: { size: 28 ,weight: 200}                     
                            },
                        }));
                        // grafico umidità in orari
                         var dataSourceU = [
                          { hour: '10:30', umidity: 50 },
                          { hour: '11:00', umidity: 50 },
                          { hour: '11:30', umidity: 51 },
                          { hour: '12:00', umidity: 60 },
                          { hour: '12:30', umidity: 70 },
                          { hour: '13:00', umidity: 65 },
                          { hour: '13:30', umidity: 80 },
                          { hour: '14:00', umidity: 90 },
                          { hour: '14:30', umidity: 70 },
                          { hour: '15:00', umidity: 70 },
                          { hour: '15:30', umidity: 65 }
                        ];
                        $("#bar-4").dxChart({
                          dataSource: dataSourceU,
                          commonSeriesSettings: {
                            argumentField: "hour"
                          },
                          series: [
                            { valueField: "umidity", name: "Umidità", color: "#40bbea" },
                          ],
                          argumentAxis:{
                            grid:{
                              visible: true
                            }
                          },
                          tooltip:{
                            enabled: true,
                            customizeText: function () {                         
                              return this.value + ' %' }
                          },
                          title: "Andamento Sensore Umidità ultime 5 ore",
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
                        });
                     var dataSourceL = [
                          { hour: '10:30', on: 0 ,off: -1},
                          { hour: '11:00', on: 0 ,off: -1 },
                          { hour: '11:30', on: 1 ,off: 0 },
                          { hour: '12:00', on: 1 ,off: 0 },
                          { hour: '12:30', on: 0 ,off: -1 },
                          { hour: '13:00', on: 0 ,off: -1 },
                          { hour: '13:30', on: 0 ,off: -1 },
                          { hour: '14:00', on: 0 ,off: -1 },
                          { hour: '14:30', on: 0 ,off: -1 },
                          { hour: '15:00', on: 1 ,off: 0 },
                          { hour: '15:30', on: 0 ,off: -1 }
                        ];
                        $("#bar-5").dxChart({
                          dataSource: dataSourceL,
                          commonSeriesSettings: {
                            argumentField: "hour"
                          },
                          series: [
                            { valueField: "on", name: "Stato Attivo", color: "#118f11", type: 'bar' },
                            { valueField: 'off', name: 'Stato Disattivato' ,color: "#c41919", type: 'bar'},
                          ],
                          argumentAxis:{
                            grid:{
                              visible: false
                            }
                          },
                          tooltip:{
                            enabled: false,
                          },
                          title: "Andamento Sensore posizione ultime 5 ore",
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
                        });
                  if( ! $.isFunction($.fn.dxChart))
                    return;
                  // Charts
                  var xenonPalette = ['#68b828','#7c38bc','#0e62c7','#fcd036','#4fcdfc','#00b19d','#ff6264','#f7aa47'];
                  // Pageviews Visitors Chart
                  var i = 0,
                    line_chart_data_source = [
                    { id: ++i, part1: 4, part2: 2 },
                    { id: ++i, part1: 5, part2: 3 },
                    { id: ++i, part1: 5, part2: 3 },
                    { id: ++i, part1: 4, part2: 2 },
                    { id: ++i, part1: 3, part2: 1 },
                    { id: ++i, part1: 3, part2: 2 },
                    { id: ++i, part1: 5, part2: 3 },
                    { id: ++i, part1: 7, part2: 4 },
                    { id: ++i, part1: 9, part2: 5 },
                    { id: ++i, part1: 7, part2: 4 },
                    { id: ++i, part1: 7, part2: 3 },
                    { id: ++i, part1: 11, part2: 6 },
                    { id: ++i, part1: 10, part2: 8 },
                    { id: ++i, part1: 9, part2: 7 },
                    { id: ++i, part1: 8, part2: 7 },
                    { id: ++i, part1: 8, part2: 7 },
                    { id: ++i, part1: 8, part2: 7 },
                    { id: ++i, part1: 8, part2: 6 },
                    { id: ++i, part1: 15, part2: 5 },
                    { id: ++i, part1: 10, part2: 5 },
                    { id: ++i, part1: 9, part2: 6 },
                    { id: ++i, part1: 9, part2: 3 },
                    { id: ++i, part1: 8, part2: 5 },
                    { id: ++i, part1: 8, part2: 4 },
                    { id: ++i, part1: 9, part2: 5 },
                    { id: ++i, part1: 8, part2: 6 },
                    { id: ++i, part1: 8, part2: 5 },
                    { id: ++i, part1: 7, part2: 6 },
                    { id: ++i, part1: 7, part2: 5 },
                    { id: ++i, part1: 6, part2: 5 },
                    { id: ++i, part1: 7, part2: 6 },
                    { id: ++i, part1: 7, part2: 5 },
                    { id: ++i, part1: 8, part2: 5 },
                    { id: ++i, part1: 6, part2: 5 },
                    { id: ++i, part1: 5, part2: 4 },
                    { id: ++i, part1: 5, part2: 3 },
                    { id: ++i, part1: 6, part2: 3 },
                  ];
                  $("#pageviews-visitors-chart").dxChart({
                    dataSource: line_chart_data_source,
                    commonSeriesSettings: {
                      argumentField: "id",
                      point: { visible: true, size: 5, hoverStyle: {size: 7, border: 0, color: 'inherit'} },
                      line: {width: 1, hoverStyle: {width: 1}}
                    },
                    series: [
                      { valueField: "part1", name: "Pageviews", color: "#68b828" },
                      { valueField: "part2", name: "Visitors", color: "#eeeeee" },
                    ],
                    legend: {
                      position: 'inside',
                      paddingLeftRight: 5
                    },
                    commonAxisSettings: {
                      label: {
                        visible: false
                      },
                      grid: {
                        visible: true,
                        color: '#f9f9f9'
                      }
                    },
                    valueAxis: {
                      max: 25
                    },
                    argumentAxis: {
                          valueMarginsEnabled: false
                      },
                  });
                  // Server Uptime Chart
                  var bar1_data_source = [
                    { year: 1,  europe: 10, americas: 0, africa: 5 },
                    { year: 2,  europe: 20, americas: 5, africa: 15 },
                    { year: 3,  europe: 30, americas: 10, africa: 15 },
                    { year: 4,  europe: 40, americas: 15, africa: 30 },
                    { year: 5,  europe: 30, americas: 10, africa: 20 },
                    { year: 6,  europe: 20, americas: 5,  africa: 10 },
                    { year: 7,  europe: 10, americas: 15, africa: 0 },
                    { year: 8,  europe: 20, americas: 25, africa: 8 },
                    { year: 9,  europe: 30, americas: 35, africa: 16 },
                    { year: 10, europe: 40, americas: 45, africa: 24 },
                    { year: 11, europe: 50, americas: 40, africa: 32 },
                  ];
                  $("#server-uptime-chart").dxChart({
                    dataSource: [
                      {id: ++i,   sales: 1},
                      {id: ++i,   sales: 2},
                      {id: ++i,   sales: 3},
                      {id: ++i,   sales: 4},
                      {id: ++i,   sales: 5},
                      {id: ++i,   sales: 4},
                      {id: ++i,   sales: 5},
                      {id: ++i,   sales: 6},
                      {id: ++i,   sales: 7},
                      {id: ++i,   sales: 6},
                      {id: ++i,   sales: 5},
                      {id: ++i,   sales: 4},
                      {id: ++i,   sales: 5},
                      {id: ++i,   sales: 4},
                      {id: ++i,   sales: 4},
                      {id: ++i,   sales: 3},
                      {id: ++i,   sales: 4},
                    ],
                    series: {
                      argumentField: "id",
                      valueField: "sales",
                      name: "Sales",
                      type: "bar",
                      color: '#7c38bc'
                    },
                    commonAxisSettings: {
                      label: {
                        visible: false
                      },
                      grid: {
                        visible: false
                      }
                    },
                    legend: {
                      visible: false
                    },
                    argumentAxis: {
                          valueMarginsEnabled: true
                      },
                    valueAxis: {
                      max: 12
                    },
                    equalBarWidth: {
                      width: 11
                    }
                  });
                  // Average Sales Chart
                  var doughnut1_data_source = [
                    {region: "Asia", val: 4119626293},
                    {region: "Africa", val: 1012956064},
                    {region: "Northern America", val: 344124520},
                    {region: "Latin America and the Caribbean", val: 590946440},
                    {region: "Europe", val: 727082222},
                    {region: "Oceania", val: 35104756},
                    {region: "Oceania 1", val: 727082222},
                    {region: "Oceania 3", val: 727082222},
                    {region: "Oceania 4", val: 727082222},
                    {region: "Oceania 5", val: 727082222},
                  ], timer;
                  $("#sales-avg-chart div").dxPieChart({
                    dataSource: doughnut1_data_source,
                    tooltip: {
                      enabled: false,
                        format:"millions",
                      customizeText: function() { 
                        return this.argumentText + "<br/>" + this.valueText;
                      }
                    },
                    size: {
                      height: 90
                    },
                    legend: {
                      visible: false
                    },  
                    series: [{
                      type: "doughnut",
                      argumentField: "region"
                    }],
                    palette: ['#5e9b4c', '#6ca959', '#b9f5a6'],
                  });
                  // Pageview Stats
                  $('#pageviews-stats').dxBarGauge({
                    startValue: -50,
                    endValue: 50,
                    baseValue: 0,
                    values: [-21.3, 14.8, -30.9, 45.2],
                    label: {
                      customizeText: function (arg) {
                        return arg.valueText + '%';
                      }
                    },
                    //palette: 'ocean',
                    palette: ['#68b828','#7c38bc','#0e62c7','#fcd036','#4fcdfc','#00b19d','#ff6264','#f7aa47'],
                    margin : {
                      top: 0
                    }
                  });
                  var firstMonth = {
                    dataSource: getFirstMonthViews(),
                    argumentField: 'month',
                    valueField: '2014',
                    type: 'area',
                    showMinMax: true,
                    lineColor: '#68b828',
                    minColor: '#68b828',
                    maxColor: '#7c38bc',
                    showFirstLast: false,
                  },
                  secondMonth = {
                    dataSource: getSecondMonthViews(),
                    argumentField: 'month',
                    valueField: '2014',
                    type: 'splinearea',
                    lineColor: '#68b828',
                    minColor: '#68b828',
                    maxColor: '#7c38bc',
                    pointSize: 6,
                    showMinMax: true,
                    showFirstLast: false
                  },
                  thirdMonth = {
                    dataSource: getThirdMonthViews(),
                    argumentField: 'month',
                    valueField: '2014',
                    type: 'splinearea',
                    lineColor: '#68b828',
                    minColor: '#68b828',
                    maxColor: '#7c38bc',
                    pointSize: 6,
                    showMinMax: true,
                    showFirstLast: false
                  };
                  function getFirstMonthViews() {
                    return [{ month: 1, 2014: 7341 },
                    { month: 2, 2014: 7016 },
                    { month: 3, 2014: 7202 },
                    { month: 4, 2014: 7851 },
                    { month: 5, 2014: 7481 },
                    { month: 6, 2014: 6532 },
                    { month: 7, 2014: 6498 },
                    { month: 8, 2014: 7191 },
                    { month: 9, 2014: 7596 },
                    { month: 10, 2014: 8057 },
                    { month: 11, 2014: 8373 },
                    { month: 12, 2014: 8636 }];
                  };
                  function getSecondMonthViews() {
                    return [{ month: 1, 2014: 189742 },
                    { month: 2, 2014: 181623 },
                    { month: 3, 2014: 205351 },
                    { month: 4, 2014: 245625 },
                    { month: 5, 2014: 261319 },
                    { month: 6, 2014: 192786 },
                    { month: 7, 2014: 194752 },
                    { month: 8, 2014: 207017 },
                    { month: 9, 2014: 212665 },
                    { month: 10, 2014: 233580 },
                    { month: 11, 2014: 231503 },
                    { month: 12, 2014: 232824 }];
                  };
                  function getThirdMonthViews() {
                    return [{ month: 1, 2014: 398},
                    { month: 2, 2014: 422},
                    { month: 3, 2014: 431},
                    { month: 4, 2014: 481},
                    { month: 5, 2014: 551},
                    { month: 6, 2014: 449},
                    { month: 7, 2014: 442},
                    { month: 8, 2014: 482},
                    { month: 9, 2014: 517},
                    { month: 10, 2014: 566},
                    { month: 11, 2014: 630},
                    { month: 12, 2014: 737}];
                  };
                  $('.first-month').dxSparkline(firstMonth);
                  $('.second-month').dxSparkline(secondMonth);
                  $('.third-month').dxSparkline(thirdMonth);
                  // Realtime Network Stats
                  var i = 0,
                    rns_values = [130,150],
                    rns2_values = [39,50],
                    realtime_network_stats = [];
                  for(i=0; i<=100; i++)
                  {
                    realtime_network_stats.push({ id: i, x1: between(rns_values[0], rns_values[1]), x2: between(rns2_values[0], rns2_values[1])});
                  }
                  $("#realtime-network-stats").dxChart({
                    dataSource: realtime_network_stats,
                    commonSeriesSettings: {
                      type: "area",
                      argumentField: "id"
                    },
                    series: [
                      { valueField: "x1", name: "Packets Sent", color: '#7c38bc', opacity: .4 },
                      { valueField: "x2", name: "Packets Received", color: '#000', opacity: .5},
                    ],
                    legend: {
                      verticalAlignment: "bottom",
                      horizontalAlignment: "center"
                    },
                    commonAxisSettings: {
                      label: {
                        visible: false
                      },
                      grid: {
                        visible: true,
                        color: '#f5f5f5'
                      }
                    },
                    legend: {
                      visible: false
                    },
                    argumentAxis: {
                          valueMarginsEnabled: false
                      },
                    valueAxis: {
                      max: 500
                    },
                    animation: {
                      enabled: false
                    }
                  }).data('iCount', i);
                  $('#network-realtime-gauge').dxCircularGauge({
                    scale: {
                      startValue: 0,
                      endValue: 200,
                      majorTick: {
                        tickInterval: 50
                      }
                    },
                    rangeContainer: {
                      palette: 'pastel',
                      width: 3,
                      ranges: [
                        { startValue: 0, endValue: 50, color: "#7c38bc" },
                        { startValue: 50, endValue: 100, color: "#7c38bc" },
                        { startValue: 100, endValue: 150, color: "#7c38bc" },
                        { startValue: 150, endValue: 200, color: "#7c38bc" },
                      ],
                    },
                    value: 140,
                    valueIndicator: {
                      offset: 10,
                      color: '#7c38bc',
                      type: 'triangleNeedle',
                      spindleSize: 12
                    }
                  });
                  setInterval(function(){  networkRealtimeChartTick(rns_values, rns2_values); }, 1000);
                  setInterval(function(){ networkRealtimeGaugeTick(); }, 2000);
                  setInterval(function(){ networkRealtimeMBupdate(); }, 3000);
                  // CPU Usage Gauge
                  $("#cpu-usage-gauge").dxCircularGauge({
                    scale: {
                      startValue: 0,
                      endValue: 100,
                      majorTick: {
                        tickInterval: 25
                      }
                    },
                    rangeContainer: {
                      palette: 'pastel',
                      width: 3,
                      ranges: [
                        { startValue: 0, endValue: 25, color: "#68b828" },
                        { startValue: 25, endValue: 50, color: "#68b828" },
                        { startValue: 50, endValue: 75, color: "#68b828" },
                        { startValue: 75, endValue: 100, color: "#d5080f" },
                      ],
                    },
                    value: between(30, 90),
                    valueIndicator: {
                      offset: 10,
                      color: '#68b828',
                      type: 'rectangleNeedle',
                      spindleSize: 12
                    }
                  });
                  // Resize charts
                  $(window).on('xenon.resize', function()
                  {
                    $("#pageviews-visitors-chart").data("dxChart").render();
                    $("#server-uptime-chart").data("dxChart").render();
                    $("#realtime-network-stats").data("dxChart").render();
                    $('.first-month').data("dxSparkline").render();
                    $('.second-month').data("dxSparkline").render();
                    $('.third-month').data("dxSparkline").render();
                  });
                });
                function networkRealtimeChartTick(min_max, min_max2)
                {
                  var $ = jQuery,
                    i = 0;
                  if( $('#realtime-network-stats').length == 0 )
                    return;
                  var chart_data = $('#realtime-network-stats').dxChart('instance').option('dataSource');
                  var count = $('#realtime-network-stats').data('iCount');
                  $('#realtime-network-stats').data('iCount', count + 1);
                  chart_data.shift();
                  chart_data.push({id: count + 1, x1: between(min_max[0],min_max[1]), x2: between(min_max2[0],min_max2[1])});
                  $('#realtime-network-stats').dxChart('instance').option('dataSource', chart_data);
                }
                function networkRealtimeGaugeTick()
                {
                  if(jQuery('#network-realtime-gauge').length == 0)
                    return;
                  var nr_gauge = jQuery('#network-realtime-gauge').dxCircularGauge('instance');
                  nr_gauge.value( between(50,200) );
                }
                function networkRealtimeMBupdate()
                {
                  var $el = jQuery("#network-mbs-packets");
                  if($el.length == 0)
                    return;
                  var options = {
                      useEasing : true, 
                      useGrouping : true, 
                      separator : ',', 
                      decimal : '.', 
                      prefix : '' ,
                      suffix : 'mb/s' 
                    },
                    cntr = new countUp($el[0], parseFloat($el.text().replace('mb/s')), parseFloat(between(10,25) + 1/between(15,30)), 2, 1.5, options);
                  cntr.start();
                }
                function between(randNumMin, randNumMax)
                {
                  var randInt = Math.floor((Math.random() * ((randNumMax + 1) - randNumMin)) + randNumMin);
                  return randInt;
                }
            } */
            $scope.editCompany = function (company) {
                var inputs = { inputs: company }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/dettagliazienda.html",
                    controllerjs: "js/controllers/modals/dettagliazienda.js",
                    controller: "dettagliAziendaController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        initializate();
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.showGraphsRele = function (sensor) {
                var inputs = { inputs: sensor }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/visualizzagraficorele.html",
                    controllerjs: "js/controllers/modals/visualizzagraficorele.js",
                    controller: "visualizzaGraficoReleController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        initializate();
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.showGraphs = function (sensor) {
                var inputs = { inputs: sensor }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/visualizzagrafico.html",
                    controllerjs: "js/controllers/modals/visualizzagrafico.js",
                    controller: "visualizzaGraficoController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        initializate();
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.showCoordinate = function (gateway) {
                var inputs = { inputs: $scope.positionfilterd }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/visualizzacoordinate.html",
                    controllerjs: "js/controllers/modals/visualizzacoordinate.js",
                    controller: "visualizzaCoordinateController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        initializate();
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.showGraphsVoltage = function (gateway) {
                var inputs = { inputs: gateway }
                ModalService.showModal({
                    templateUrl: "../../../views/modals/visualizzagraficovolt.html",
                    controllerjs: "js/controllers/modals/visualizzagraficovolt.js",
                    controller: "visualizzaGraficoVoltController",
                    inputs: inputs
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                        initializate();
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }])
    .controller('LogoutController', ['$scope', 'AuthService', '$state',
        function ($scope, AuthService, $state) {
            /*
            $scope.logout = function() {
              AuthService.logout()
                .then(function() {
                  self.alreadyloaded = false;
                  console.log('set self.alreadyloaded = false logout'); 
                  $state.go('login');
                });
            } 
            */
        }])
    .controller('SideBarController', ['Messages', '$scope', 'AuthService', '$state',
        function (Messages, $scope, AuthService, $state) {
        }
    ])