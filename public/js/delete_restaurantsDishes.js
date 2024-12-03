function deleteRestaurantDish(RestaurantDishID) {
    let data = { RestaurantDishID: RestaurantDishID };

    // debugging
    console.log("Sending data:", data);

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-restaurantDish-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tells AJAX how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(RestaurantDishID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }
    // Send request and wait
    xhttp.send(JSON.stringify(data));
}

function deleteRow(RestaurantDishID) {
    let table = document.getElementById("Restaurants-Dishes-Table");
    if (table) { // Check if table exists
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (table.rows[i].getAttribute("data-value") == RestaurantDishID) {
                table.deleteRow(i);
                break;
            }
        }
    }
}


