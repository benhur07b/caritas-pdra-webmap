mapboxgl.accessToken = 'pk.eyJ1IjoibmFzc2FjYXJpdGFzIiwiYSI6ImNqa2FweGhqcTF2dm4zd24xa2w0c3pzNDkifQ.IIEkXeNO8hhuQZu-Mw7Frg'

var brgys = $.ajax({
    url: "static/data/brgy.geojson",
    dataType: "json"
})

var showHaz = document.getElementById('showHaz');
// var hazAll = document.getElementById('hazAll');
var hazLow = document.getElementById('hazLow');
var hazMed = document.getElementById('hazMed');
var hazHigh = document.getElementById('hazHigh');

var showVul = document.getElementById('showVul');
// var vulAll = document.getElementById('vulAll');
var vulLow = document.getElementById('vulLow');
var vulMed = document.getElementById('vulMed');
var vulHigh = document.getElementById('vulHigh');

var showCap = document.getElementById('showCap');
var capAll = document.getElementById('capAll');
var capLow = document.getElementById('capLow');
var capMed = document.getElementById('capMed');
var capHigh = document.getElementById('capHigh');

var showRisk = document.getElementById('showRisk');
var riskAll = document.getElementById('riskAll');
var riskLow = document.getElementById('riskLow');
var riskMed = document.getElementById('riskMed');
var riskHigh = document.getElementById('riskHigh');

$(document).ready(function(){

    // MAP
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        // style: 'mapbox://styles/mapbox/light-v9',
        // style: {"version": 8, "name": "Satellite", "metadata": {"mapbox: autocomposite":true, "mapbox: type": "default"}, "sources": {"mapbox": {"type": "raster", "url": "mapbox:\/\/mapbox.satellite", "tileSize": 256}}, "sprite": "mapbox:\/\/sprites\/mapbox\/satellite-v9","glyphs": "mapbox:\/\/fonts\/mapbox\/{fontstack}\/{range}.pbf", "layers": [{"id": "background","type": "background", "paint": {"background-color": "rgb(4,7,14)"}}, {"id": "satellite", "type": "raster", "source": "mapbox", "source-layer": "mapbox_satellite_full"}], "created": 0, "modified": 0, "owner": "mapbox", "id": "satellite-v9", "draft":false, "visibility": "public"},
        center: [125.005, 11.054],
        zoom: 14,
        minZoom: 12,
        maxZoom: 18,
        maxBounds: [[124.95, 11.03], [125.05, 11.08]]
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', function() {

        map.addSource(
            'barangays', {
            type: 'geojson',
            // data: "http://18.216.79.120/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:project_sites_box&srsName=EPSG:4326&maxFeatures=50&outputFormat=application%2Fjson",
            data: 'static/data/brgy.geojson',
            }
        );

        map.addSource(
            'households', {
            type: 'geojson',
            data: 'static/data/households.geojson'
            }
        );

        map.addLayer({
            'id': 'brgy',
            'type': 'fill',
            'source': 'barangays',
            'paint': {
                'fill-color': 'white',
                'fill-outline-color': 'black',
                'fill-opacity': 0.3
            }
        });

        map.addLayer({
            'id': 'brgy-outline',
            'type': 'line',
            'source': 'barangays',
            'layout': {},
            'paint': {
               'line-color': '#2a2c77',
               // 'line-color': 'black',
               'line-width': 3
            }
        });

        map.addLayer({
            'id': 'hh',
            'type': 'circle',
            'source': 'households',
            'layout': {},
            'paint': {
                'circle-radius': [
                    'interpolate', ['linear'], ['zoom'],
                    12, 2,
                    15, 5,
                    18, 8,
                ],
                'circle-opacity': 0.8,
                'circle-color': 'rgb(171, 72, 33)',
                'circle-stroke-width': 1,
                'circle-stroke-color': 'black'
                }
        });

        brgys.done(function() {
            buildinfolist(brgys.responseJSON);
            // console.log(brgys.responseJSON);
        });

        function hazColor() {
            map.setPaintProperty('hh', 'circle-color',
                ['match',
                  ['get', 'Hazard'],
                  'LOW', 'green',
                  'MEDIUM', 'yellow',
                  'HIGH', 'red',
                  'rgb(171, 72, 33)'
                  ]
              );
        };
        showHaz.onclick = function() {
            map.setFilter('hh', ['any', ['==', 'Hazard', 'LOW'], ['==', 'Hazard', 'MEDIUM'], ['==', 'Hazard', 'HIGH']]);
            hazColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        // hazAll.onclick =  function() {
        //     map.setFilter('hh', ['any', ['==', 'Hazard', 'LOW'], ['==', 'Hazard', 'MEDIUM'], ['==', 'Hazard', 'HIGH']]);
        // };
        hazLow.onclick =  function() {
            map.setFilter('hh', ['==', 'Hazard', 'LOW']);
            hazColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        hazMed.onclick =  function() {
            map.setFilter('hh', ['==', 'Hazard', 'MEDIUM']);
            hazColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        hazHigh.onclick =  function() {
            map.setFilter('hh', ['==', 'Hazard', 'HIGH']);
            hazColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };


        function vulColor() {
            map.setPaintProperty('hh', 'circle-color',
                ['match',
                  ['get', 'Vulnerability'],
                  'LOW', 'green',
                  'MEDIUM', 'yellow',
                  'HIGH', 'red',
                  'rgb(171, 72, 33)'
                  ]
              );
        };
        showVul.onclick = function() {
            map.setFilter('hh', ['any', ['==', 'Vulnerability', 'LOW'], ['==', 'Vulnerability', 'MEDIUM'], ['==', 'Vulnerability', 'HIGH']]);
            vulColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        // vulAll.onclick =  function() {
        //     map.setFilter('hh', ['any', ['==', 'Vulnerability', 'LOW'], ['==', 'Vulnerability', 'MEDIUM'], ['==', 'Vulnerability', 'HIGH']]);
        // };
        vulLow.onclick =  function() {
            map.setFilter('hh', ['==', 'Vulnerability', 'LOW']);
            vulColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        vulMed.onclick =  function() {
            map.setFilter('hh', ['==', 'Vulnerability', 'MEDIUM']);
            vulColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        vulHigh.onclick =  function() {
            map.setFilter('hh', ['==', 'Vulnerability', 'HIGH']);
            vulColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };


        function capColor() {
            map.setPaintProperty('hh', 'circle-color',
                ['match',
                  ['get', 'Capacity'],
                  'LOW', 'green',
                  'MEDIUM', 'yellow',
                  'HIGH', 'red',
                  'rgb(171, 72, 33)'
                  ]
              );
        };
        showCap.onclick = function() {
            map.setFilter('hh', ['any', ['==', 'Capacity', 'LOW'], ['==', 'Capacity', 'MEDIUM'], ['==', 'Capacity', 'HIGH']]);
            capColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        capLow.onclick =  function() {
            map.setFilter('hh', ['==', 'Capacity', 'LOW']);
            capColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        capMed.onclick =  function() {
            map.setFilter('hh', ['==', 'Capacity', 'MEDIUM']);
            capColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        capHigh.onclick =  function() {
            map.setFilter('hh', ['==', 'Capacity', 'HIGH']);
            capColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };


        function riskColor() {
            map.setPaintProperty('hh', 'circle-color',
                ['match',
                  ['get', 'Risk'],
                  'LOW', 'green',
                  'MEDIUM', 'yellow',
                  'HIGH', 'red',
                  'rgb(171, 72, 33)'
                  ]
              );
        };
        showRisk.onclick = function() {
            map.setFilter('hh', ['any', ['==', 'Risk', 'LOW'], ['==', 'Risk', 'MEDIUM'], ['==', 'Risk', 'HIGH']]);
            riskColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        riskLow.onclick =  function() {
            map.setFilter('hh', ['==', 'Risk', 'LOW']);
            riskColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        riskMed.onclick =  function() {
            map.setFilter('hh', ['==', 'Risk', 'MEDIUM']);
            riskColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };
        riskHigh.onclick =  function() {
            map.setFilter('hh', ['==', 'Risk', 'HIGH']);
            riskColor();
            unActiveBtns();
            $(this).toggleClass('fill-dark');
        };

        map.on('click', 'hh', function (e) {
            showPopup(e.features[0]);
        });
        map.on('mouseenter', 'hh', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'hh', function () {
            map.getCanvas().style.cursor = '';
        });

        map.resize();

    });

    // map.on('style.load', ()  => {
    //     map.resize();
    // });

    function createTable(e) {

    }


    function showPopup(e) {
        // console.log(e)
        var coords = e.geometry.coordinates.slice();
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        // Check if there is already a popup on the map and if so, remove it
        if (popUps[0]) popUps[0].remove();

        var popup_html ='<table><thead><tr><th>Indicator</th><th>Value</th></tr></thead><tbody>';
        $.each(e.properties, function(k, v) {
            popup_html += '<tr><td>' +k+ '</td><td>' +v+ '</td></tr>'
            // console.log(k + " , " + v);
        });
        popup_html +=  '</tbody></table>';

        var popup_content = document.createElement('div');

        popup_content.innerHTML = popup_html;

        var popup = new mapboxgl.Popup()
            .setLngLat(coords)
            .setDOMContent(popup_content)
            .addTo(map);

        popup_content.parentNode.parentNode.className += ' custom-popup';''
    }

    function unActiveBtns() {
        var btns = document.querySelectorAll('.style-btn');
        [].forEach.call(btns, function(btn) {
        btn.classList.remove('fill-dark');
        });
        // thisBtn.classList.add('active');
    }

    function buildinfolist(data) {
        var prop = data.features[0].properties;
        var brgy = document.getElementById('info-brgy');
        var muni = document.getElementById('info-muni');
        var prov = document.getElementById('info-prov');
        var dioc = document.getElementById('info-dioc');

        brgy.innerHTML = prop["Barangay"];
        muni.innerHTML = prop["MuniCity"];
        prov.innerHTML = prop["Province"];
        dioc.innerHTML = prop["Diocese"];

        var ctx = document.getElementById('info-chart');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Hazard", "Vulnerability", "Capacity", "Risk"],
                datasets: [{
                    label: 'Low',
                    data: [
                        prop["Hazard_LOW"],
                        prop["Vulnerability_LOW"],
                        prop["Capacity_LOW"],
                        prop["Risk_LOW"]],
                    backgroundColor: [
                        'green',
                        'green',
                        'green',
                        'green'],
                    borderColor: [
                        'green',
                        'green',
                        'green',
                        'green']
                    },{
                    label: 'Medium',
                    data: [
                        prop["Hazard_MEDIUM"],
                        prop["Vulnerability_MEDIUM"],
                        prop["Capacity_MEDIUM"],
                        prop["Risk_MEDIUM"]],
                    backgroundColor: [
                        'yellow',
                        'yellow',
                        'yellow',
                        'yellow'],
                    borderColor: [
                        'yellow',
                        'yellow',
                        'yellow',
                        'yellow']
                    },
                    {
                    label: 'High',
                    data: [
                        prop["Hazard_HIGH"],
                        prop["Vulnerability_HIGH"],
                        prop["Capacity_HIGH"],
                        prop["Risk_HIGH"]],
                    backgroundColor: [
                        'red',
                        'red',
                        'red',
                        'red'],
                    borderColor: [
                        'red',
                        'red',
                        'red',
                        'red']
                    },
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: prop["Number_of_Households"],
                            maxTicksLimit: 2,
                            fontColor: '#fff'
                        },
                        stacked: true,
                        gridLines: {
                            color: '#fff'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: '#fff'
                        },
                        stacked: true,
                        gridLines: {
                            color: '#fff'
                        }
                    }]
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontColor: '#fff'
                    }
                },
                title: {
                   display: true,
                   text: 'Households at Risk',
                   fontSize: 14,
                   fontColor: '#fff'
               }
            }
        });
    }


})
