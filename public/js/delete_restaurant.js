function deleteRestaurant(RestaurantDishID) {
    let data = { id: RestaurantDishID };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-restaurant-ajax", true);
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
    let table = document.getElementById("restaurant-table");
    if (table) { // Check if table exists
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (table.rows[i].getAttribute("data-value") == RestaurantDishID) {
                table.deleteRow(i);
                deleteDropdownMenu(RestaurantDishID);
                break;
            }
        }
    }
}

function deleteDropdownMenu(RestaurantDishID) {
    let selectMenu = document.getElementById("mySelect");
    if (selectMenu) { // Check if dropdown exists
        for (let i = 0; i < selectMenu.length; i++) {
            if (selectMenu.options[i].value == RestaurantDishID) {
                selectMenu.remove(i); // Remove option from dropdown
                break;
            }
        }
    }
}
