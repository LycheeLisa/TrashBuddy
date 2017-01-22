var socket = io();
socket.emit('enduser', {
    'enduser' : true
});
socket.on('databaseUpdate', function(){
    var tabName = $("#timeTabs .active").text();
    if (tabName == "Daily"){
        $.ajax({
            url: "/api/daily", success: function (result) {
                turnIntoGraph(result)
            }
        });
    }
    else if (tabName == "Weekly"){
        $.ajax({
            url: "/api/weekly", success: function (result) {
                turnIntoGraph(result)
            }
        });
    }
    else if (tabName == "Monthly"){
        $.ajax({
            url: "/api/monthly", success: function (result) {
                turnIntoGraph(result)
            }
        });
    }
   // turnIntoGraphView(db); 
});

function turnIntoGraph(result) {
    result = JSON.parse(result);
    turnIntoGraphView(result);
}

function turnIntoGraphView(result) {
            for (var i=0; i < result.data.length; i+=1){
                if (result.data[i].name == "banana"){
                    $(".mostQuantity").text(result.data[i].quantity);
                    break;
                }
            }
            var items = result;
            var grain = 0;
            var vegetable = 0;
            var fruit = 0;
            var protein = 0;
            var dairy = 0;
            var other = 0;
            for (var i=0; i< result.data.length; i+=1) {
                if (result.data[i].category == 'grains') {
                    console.log(result.data[i]);
                    grain += result.data[i].quantity;
                }
                else if (result.data[i].category == 'vegetable') {
                    vegetable += result.data[i].quantity;
                }
                else if (result.data[i].category == 'fruit') {
                    fruit += result.data[i].quantity;
                }
                else if (result.data[i].category == 'dairy') {
                    dairy += result.data[i].quantity;
                }
                else if (result.data[i].category == 'protein') {
                    protein += result.data[i].quantity;
                }
                else if (result.data[i].category == 'other') {
                    other += result.data[i].quantity;
                }
            }
            if (window.pieChart != null){
                window.pieChart.destroy();
            }
            var ctx = document.getElementById("wasteBreakdown");
            window.pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ["Grains", "Vegetables", "Fruits", "Protein", "Dairy", "Other"],
                    datasets: [{
                        label: 'Percentage of Waste',
                        data: [grain, vegetable, fruit, protein, dairy, other],
                        backgroundColor: [
                            '#CDDC39',
                            '#8BC34A',
                            '#FFC107',
                            '#F44336',
                            '#2196F3',
                            '#9E9E9E'
                        ]
                    }]

                }
            });
        }
