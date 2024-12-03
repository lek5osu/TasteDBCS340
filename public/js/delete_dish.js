function deleteDish(DishID) {
    let data = { DishID: DishID };

    // debugging
    console.log("Sending data:", data);

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-dish-ajax", true);    // AJAX variable in app.js
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tells AJAX how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(DishID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }
    // Send request and wait
    xhttp.send(JSON.stringify(data));
}

function deleteRow(DishID) {
    let table = document.getElementById("Dishes-Table");
    if (table) { // Check if table exists
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (table.rows[i].getAttribute("data-value") == DishID) {
                table.deleteRow(i);
                break;
            }
        }
    }
}
