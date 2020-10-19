// auth
var hasLocalStorageUser;
firebase.auth().getRedirectResult().then(function() {
     sessionStorage.setItem("User", "OK");
     hasLocalStorageUser = "OK";
});
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
if (!firebase.auth().currentUser) {
    hasLocalStorageUser = sessionStorage.getItem("User");
    if (hasLocalStorageUser != "OK") {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
    }
}
function plot() {
    if (hasLocalStorageUser == "OK") {
        // Firestore
        var db = firebase.firestore();
        var cur = db.collection('room');
        cur = cur.orderBy('timestamp', 'desc').limit(2);
        // variables
        var x = [];
        var y = [];
        var temp;
        var layout;
        var config;
        var dataArray = [];

        function comp(a, b) { // date comparator
            var Da = new Date(a[0]);
            var Db = new Date(b[0]);
            return Da.getTime() - Db.getTime();
        }

        function load(entry) {
            x.push(entry[0]);
            y.push(entry[1]['temperature']);
        }

        cur.get().then(function (docs) {
            docs.forEach(function(doc) {
                var tempArray = Object.entries(doc.data());
                tempArray = tempArray.filter((value) => {return value[0] != "timestamp"});
                tempArray.forEach((entry) => {
                    entry[0] = doc.id + ' ' + entry[0];
                });
                dataArray.push(...tempArray);
            });
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
