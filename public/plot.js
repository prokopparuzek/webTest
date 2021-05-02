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
function plot2() {
    if (hasLocalStorageUser == "OK") {
        // Firestore
        var db = firebase.firestore();
        var cur = db.collection('room-measures');
        cur = cur.orderBy('timestamp').limitToLast(576);
        var x = [];
        var y = [];
        var temp;
        var layout;
        var config;
        cur.get().then((docs) => {
            docs.forEach((doc) => {
                var date = new Date(doc.data().timestamp * 1000)
                date.setMinutes(date.getMinutes()-date.getTimezoneOffset())
                x.push(date.toISOString())
                y.push(doc.data().temperature);
            });
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
                    title: 'čas',
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
plot2();
