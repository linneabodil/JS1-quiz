var res;

document.addEventListener("DOMContentLoaded", function() {
  var req = new XMLHttpRequest;

  fetch("https://opentdb.com/api.php?amount=10&category=15&type=multiple")
    .then(res => res.json()) // Transform the data into json
    .then(function(res) {

      // get and create the html-elements
      var gameContainer = document.getElementById("content");
      var list = document.createElement("ul");
      list.setAttribute("id", "list");

      for (var i = 0; i < res.results.length; i++) {
        var q = res.results[i];
        // create an li for each question
        var qItem = document.createElement("li");

        // print out the question
        var question = q.question;
        qItem.innerHTML = question + "<br>";

        // put all the alternatives in one array
        var alteratives = q.incorrect_answers;
        alteratives.push(q.correct_answer);

        // create buttons for answers
        for (var j = 0; j < alteratives.length; j++) {
          var button = document.createElement("input");
          button.type = "submit";
          button.value = alteratives[j];
          button.setAttribute("class", "button")
          if (button.value == q.correct_answer) {
            button.setAttribute("id", "correct")
          }
          qItem.appendChild(button)
        }

        // add the question to the list
        list.appendChild(qItem);
      }

      // add the list to the div in the html
      gameContainer.appendChild(list);

      addEvents();
  });
});


// add eventlisteners on all the buttons
function addEvents() {
  var buttons = document.getElementsByTagName("input");
  for (var x = 0; x < buttons.length; x++) {
    buttons[x].addEventListener("click", function() {
      console.log(this.id);
    });
  }
}
