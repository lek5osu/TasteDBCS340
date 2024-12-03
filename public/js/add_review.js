// Get the objects we need to modify
let addReviewForm = document.getElementById('add-reviews-form-ajax');

// Modify the objects we need
addReviewForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get the form fields from reviews.hbs
    let inputRestaurantID = document.getElementById("input-restaurant-id");
    let inputDishID = document.getElementById("input-dish-id");
    let inputUserID = document.getElementById("input-user-id");
    let inputReviewDate = document.getElementById("input-review-date");
    let inputReviewComment = document.getElementById("input-review-comment");
    let inputTaste = document.getElementById("input-taste");
    let inputPresentation = document.getElementById("input-presentation");

    // Get the values from the form fields
    let restaurantIDValue = inputRestaurantID.value;
    let dishIDValue = inputDishID.value;
    let userIDValue = inputUserID.value;
    let reviewDateValue = inputReviewDate.value;
    let reviewCommentValue = inputReviewComment.value;
    let tasteValue = inputTaste.value;
    let presentationValue = inputPresentation.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        RestaurantID: restaurantIDValue,
        DishID: dishIDValue,
        UserID: userIDValue,
        ReviewDate: reviewDateValue,
        ReviewComment: reviewCommentValue,
        Taste: tasteValue,
        Presentation: presentationValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-review", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new review data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRestaurantID.value = '';
            inputDishID.value = '';
            inputUserID.value = '';
            inputReviewDate.value = '';
            inputReviewComment.value = '';
            inputTaste.value = '';
            inputPresentation.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }
    console.log("Data to send:", data);

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// the Reviews table
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("Reviews-Table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and cells for each property
    let row = document.createElement("TR");

    // Create the data cells for ReviewID and other fields
    let reviewIDCell = document.createElement("TD");
    let restaurantIDCell = document.createElement("TD");
    let dishIDCell = document.createElement("TD");
    let userIDCell = document.createElement("TD");
    let reviewDateCell = document.createElement("TD");
    let reviewCommentCell = document.createElement("TD");
    let tasteCell = document.createElement("TD");
    let presentationCell = document.createElement("TD");

    reviewIDCell.innerText = newRow.ReviewID;
    restaurantIDCell.innerText = newRow.RestaurantID;
    dishIDCell.innerText = newRow.DishID;
    userIDCell.innerText = newRow.UserID;
    reviewDateCell.innerText = newRow.ReviewDate;
    reviewCommentCell.innerText = newRow.ReviewComment;
    tasteCell.innerText = newRow.Taste;
    presentationCell.innerText = newRow.Presentation;

    // Append all cells to the row
    row.appendChild(reviewIDCell);
    row.appendChild(restaurantIDCell);
    row.appendChild(dishIDCell);
    row.appendChild(userIDCell);
    row.appendChild(reviewDateCell);
    row.appendChild(reviewCommentCell);
    row.appendChild(tasteCell);
    row.appendChild(presentationCell);
    currentTable.appendChild(row);
};


