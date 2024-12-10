function deleteRestaurant(RestaurantID) {
    let data = { RestaurantID: RestaurantID };

    // debugging
    console.log("Sending data:", data);


    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-restaurant-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tells AJAX how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log("Calling deleteRow function...",RestaurantID);
            deleteRestaurantRow(RestaurantID);
            console.log("deleteRow function called.");
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }
    // Send request and wait
    xhttp.send(JSON.stringify(data));
}
function deleteRestaurantRow(RestaurantID) {
    console.log("Table rows and data-value attributes:"); // Debugging
    let table = document.getElementById("Restaurants-Table");
    if (table) { 
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (table.rows[i].getAttribute("data-value") == RestaurantID) {
                console.log("Deleting row with RestaurantID:", RestaurantID); // Debugging
                table.deleteRow(i);
                break;
            }
        }
    }
}


