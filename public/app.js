// Grab the articles as a json
$.getJSON("/articles").then(function (data) {
  $("#articles").empty();
  $("#articles").append(`
  <div class=col" id="articlesCol"></div>
  `);
  console.log(data);
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articlesCol").append("<p data-id='" + data[i]._id + "' class ='articleClass'><b>" + data[i].title + "</b></p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".articleClass", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      $("#notes").append(`
      <div class="card" style="width: 100%;">
  <div class="card-body">
    <h5 class="card-title">${data.title}</h5>
    <p class="card-text">${data.summary}</p>
    <a href="${data.link}" class="card-link" target="_blank">Link to Article</a>
  </div>
</div>
<br>
<br>

      `);
      // The title of the article
      // An input to enter a new title
      $("#notes").append(`
      <div id="inputDiv"><h3>Add comment</h3><h6 class="text-muted">Name</h6><input id='titleinput' name='title' >
      <h6 class="text-muted">Comment</h6>
      <textarea id='bodyinput' name='body'></textarea>
      <br><button data-id="${data._id}" id='savenote' class='btn btn-secondary'>Add Comment</button></div> <br><br>
      `)
      $("#notes").append("");
      // A textarea to add a new note body
      $("#notes").append("");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("");

      // If there's a note in the article
      if (data.comment) {
        console.log(data.comment);
        // Place the title of the note in the title input

        data.comment.forEach(comment => {
          let newDiv = $("<div>");
          newDiv.html(`
          <div class="card" style="width: 100%;">
  <div class="card-body">
    <h5 class="card-title mb-2 text-muted">${comment.commenter}</h5>
    <h6 class="card-text">${comment.comment}</h6>
    <button type="button" class="btn btn-outline-danger deleteButton" data-id="${comment._id}">Delete Comment</button>
  </div>
</div>
          <br>
          <br>
          `);
          $("#notes").append(newDiv);


        });
      }
    });
});

$(document).on("click", ".deleteButton", function () {

  let deleteID = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/comments/"+ deleteID
  }).then(function (){
    $("#notes").empty();
  })



});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        commenter: $("#titleinput").val(),
        // Value taken from note textarea
        comment: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});