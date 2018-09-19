var host;
if (location.href.split('?')[0].indexOf('irozhlas') == -1) {
    host = location.href.split('?')[0];
} else {
    host = 'https://data.irozhlas.cz/senat-vizitky-18/';
}

function share(url) {
    window.open(url, 'Sdílení', 'width=550,height=450,scrollbars=no');
};

var vo = [2,  5,  8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80];
var voDone = [2,  5,  8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80];

//social sharing
function makeSelect() {
    var id = location.href.split('?')[1];
    if (id != null) {
        id = id.split('_')
        var filtered = data[parseInt(id[0])][parseInt(id[1])]

        if (!filtered) {
            return;
        }

        var out = '<h1>obvod č. ' + id[0] + '</h1><ul>';
        out += '<li><div class="right"><h2><span class="cislo">' 
        + id[1] 
        + '</span> <span>' 
        + filtered.jmeno
        + '</span></h2><span class="strana">' 
        + filtered.partaj 
        + '</span> <span class="supplemental">' 
        + filtered.povolani
        + (filtered.pozn != null ? '<div><span class="supplemental">' + filtered.pozn + '</span></div>' : '')
        + '</span>'
        + (filtered.afile != 'x' ? '<div><audio class="player" src="' + host + 'media/audio/' + id[0] + '_' + id[1] + '.mp3" preload="none" controls="yes"></audio></div>'  : '')
        + '</div><div class="left"><img width="120" height="180" alt="' 
        + filtered.jmeno
        + '" src="'
        + host + 'media/foto/'
        + filtered.file + '.JPG'
        +'"></div></li>'
        out += '</ul>'
        $('.linked').html(out);
    } 
}

function makeTable(obvod) {
    $('.linked').html('');
    var out = '<h1>obvod č. ' + obvod + '</h1><ul>';
    for (var per in data[obvod]) {
        out += '<li><div class="right"><h2><span class="cislo">' 
        +  per
        + '</span><span>' 
        +  data[obvod][per].jmeno
        + '</span></h2><span class="strana">' 
        +  data[obvod][per].partaj 
        + '</span> <span class="supplemental">' 
        +  data[obvod][per].povolani
        + (data[obvod][per].pozn != null ? '<div><span class="supplemental">' + data[obvod][per].pozn + '</span></div>' : '')
        + '</span>'
        + '<span class="share">Sdílet na <a href="javascript:share(\'https://www.facebook.com/sharer/sharer.php?u=' + location.href.split('?')[0] + '?' + obvod + '_' + per + '\');'
        + '">Facebook</a> | <a href="javascript:share(\'https://twitter.com/home?status=' 
        + location.href.split('?')[0] + '?' + obvod + '_' + per + '\');">Twitter</a> | <a target="_blank" href="http://data.irozhlas.cz/senat-vizitky-18/iframes.html#' 
        + obvod + '_' + per +'">Embed</a></span>'
        + (data[obvod][per].afile != 'x' ? '<div><audio class="player" src="' + host + 'media/audio/' + obvod + '_' + per + '.mp3" preload="none" controls="yes"></audio></div>'  : '')
        + '</div><div class="left"><img width="120" height="180" alt="'
        + data[obvod][per].jmeno
        + '" src="'
        + host + 'media/foto/'
        + data[obvod][per].file + '.JPG'
        +'"></div></li>'
    }
    out += '</ul>'
    $('#bottom').html(out);
}

var mapka;

function selectMap(kraj) {
    if (kraj != undefined) {
        mapka.series[0].data.forEach(function(e) {
            if (e.NAME_1 == kraj) {
                mapka.series[0].data[mapka.series[0].data.indexOf(e)].select(true, false)
            }
        })
    }
};

var obvodyInfo = [];
Object.values(obvody.features).forEach(function(e) {
    var val = 0;
    if (vo.indexOf(e.properties.VOL_OKR) != -1) {
        val = 1;
    };
    obvodyInfo.push({'VOL_OKR': e.properties.VOL_OKR, 'val': val, 'SIDLO': e.properties.SIDLO})
});

var obvodyVolebni = Object.assign({}, obvody);
obvodyVolebni.features = obvody.features.filter(function(e) {
    if ((vo.indexOf(e.properties.VOL_OKR) != -1) & (voDone.indexOf(e.properties.VOL_OKR) != -1)) {
        return true
    }
});

var obvodyVolebniUnf = Object.assign({}, obvody);
obvodyVolebniUnf.features = obvody.features.filter(function(e) {
    if ((vo.indexOf(e.properties.VOL_OKR) != -1) & (voDone.indexOf(e.properties.VOL_OKR) == -1)) {
        return true
    }
});

var obvodyNeVolebni = Object.assign({}, obvody);
obvodyNeVolebni.features = obvody.features.filter(function(e) {
    if (vo.indexOf(e.properties.VOL_OKR) == -1) {
        return true
    }
});

mapka = Highcharts.mapChart('container', {
    title: {
        text: ''
    },
    subtitle: {
        align: 'center',
        useHTML: true,
        text: '<i>kliknutím do mapy vyberte obvod</i>'
    },
        legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            allowPointSelect: false,
            states: {
                hover: {
                    color: '#ab0000',
                    brightness: 0.2,
                    enabled: true
                },
                select: {
                    color: '#ab0000'
                }
            }
        }
    },
    series: [{
        type: 'map',
        color: '#08519c',
        tooltip: {
            headerFormat: '',
            pointFormat: 'Obvod č. {point.VOL_OKR} ({point.SIDLO})'
        },
        data: obvodyInfo,
        mapData: obvodyVolebni,
        name: ' ',
        joinBy: ['VOL_OKR', 'VOL_OKR'],
        events: {
            click: function(e) {
                if ('point' in e.target) {
                    makeTable(e.target.point.properties.VOL_OKR)
                    $('#select select').val(e.target.point.properties.VOL_OKR).change();
                }  
            }
        }
    },{
        type: 'map',
        color: 'white',
        tooltip: {
            headerFormat: '',
            pointFormat: 'Nevolební obvod č. {point.VOL_OKR} ({point.SIDLO})'
        },
        data: obvodyInfo,
        mapData: obvodyNeVolebni,
        name: ' ',
        joinBy: ['VOL_OKR', 'VOL_OKR'],
        states: {
            hover: {
                enabled: false
            }
        }
    },{
        type: 'map',
        color: '#6baed6',
        tooltip: {
            headerFormat: '',
            pointFormat: 'Volební obvod č. {point.VOL_OKR} ({point.SIDLO})<br><i>čeká na natočení vizitek</i>'
        },
        data: obvodyInfo,
        mapData: obvodyVolebniUnf,
        name: ' ',
        joinBy: ['VOL_OKR', 'VOL_OKR'],
        states: {
            hover: {
                enabled: false
            }
        }
    }]
});

var selHTML = '<select><option value="#">Vyberte volební obvod...</option>'
obvodyInfo.forEach(function(e) {
    if (vo.indexOf(e.VOL_OKR) == -1) {
        return;
    }
    var unsel = '';
    if (voDone.indexOf(e.VOL_OKR) == -1) {
        unsel = 'disabled';
    }
    selHTML += '<option ' + unsel + ' value="' + e.VOL_OKR + '">č. ' + e.VOL_OKR + ' - ' + e.SIDLO + '</option>'
})
selHTML += '</select>'
$('#select').html(selHTML)

$('#select').on('change', function(e) {
    if (e.target.value != '#') {
        selectMap(e.target.value)
        makeTable(e.target.value)     
    }       
});

makeSelect()