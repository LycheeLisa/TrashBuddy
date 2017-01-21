function turnIntoGraph(result) {
            result = JSON.parse(result);
            var items = result;
            var grain = 0;
            var vegetable = 0;
            var fruit = 0;
            var protein = 0;
            var dairy = 0;
            var other = 0;
            for (var i=0; i< result.data.length; i+=1) {
                console.log(result.data[i].category);
                if (result.data[i].category == 'grains') {
                    grain += 1;
                }
                else if (result.data[i].category == 'vegetable') {
                    vegetable += 1;
                }
                else if (result.data[i].category == 'fruit') {
                    fruit += 1;
                }
                else if (result.data[i].category == 'dairy') {
                    dairy += 1;
                }
                else if (result.data[i].category == 'protein') {
                    protein += 1;
                }
                else if (result.data[i].category == 'other') {
                    other += 1;
                }
            }
            var ctx = document.getElementById("wasteBreakdown");
            var wasteBreakdown = new Chart(ctx, {
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
