// Datum
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDate();
var isoD = year + '-' + (month+1) + '-' + day;
// Firestore
var db = firebase.firestore();
var cur = db.collection('room').doc(isoD);
// global variables
var x = [];
var y = [];
var temp;
var layout;
var config;

function comp(a, b) { // date comparator
    var Da = new Date(isoD + ' ' + a[0]);
    var Db = new Date(isoD + ' ' + b[0]);
    return Da.getTime() - Db.getTime();
}

function load(entry) {
    x.push(isoD + ' ' + entry[0]);
    y.push(entry[1]['temperature']);
}

cur.get().then(function(doc) {
    var dataArray;
    dataArray = Object.entries(doc.data());
    dataArray.sort(comp);
    dataArray.forEach(load);
    temp = {
        type: "Scattergl",
        mode: "lines",
        name: 'teplota',
        x: x,
        y: y
    };
    layout = {
        title: 'Teplota',
        showlegend: true,
        xaxis: {
            title: 'čas'
        },
        yaxis: {
            title: 'teplota'
        }
    };
    config = {
    };
    Plotly.newPlot('graph', [temp], layout, config);
});
