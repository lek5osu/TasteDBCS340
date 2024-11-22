function deleterestaurant(RestaurantDishID){
    let data = {id: RestaurantDishID};

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-restaurant-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tells AJX how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204){
            deleteRow(RestaurantDishID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204){
            console.log("There was an error with the input.");
        }
    }
    // Send request and wait
    xhttp.send(JSON.stringify(data));
}

function deleteRow(RestaurantDishID){
    let table = document.getElementById("restaurant-table");
    for (let i = 0, row; row = table.rows[i]; i++){
        if (table.rows[i].getAttribute("data-value") == RestaurantDishID){
            table.deleteRow(i);
            deleteDropDownMenu(RestaurantDishID);
            break;
        }
    }
}

function deleteDropDownMenu(RestaurantDishID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
        if (Number(selectMenu.options[i].value) === Number(RestaurantDishID)){
            selectMenu[i].remove();
            break;
        }        
    }
}