// Datum
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDate();
var isoD = year + '-' + (month+1) + '-' + day;
// auth
var hasLocalStorageUser;
if (!firebase.auth().currentUser) {
    hasLocalStorageUser = localStorage.getItem("User");
    if (hasLocalStorageUser != "OK") {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
         firebase.auth().signInWithPopup(provider).then(function() {
             localStorage.setItem("User", "OK");
             hasLocalStorageUser = "OK";
             plot();
        });
    }
}
function plot() {
    if (hasLocalStorageUser == "OK") {
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
    }
}
plot();
