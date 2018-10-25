var res;

document.addEventListener("DOMContentLoaded", function() {
  var req = new XMLHttpRequest;
  var url = "https://opentdb.com/api.php?amount=10&type=multiple";

  // add eventlisteners on all the categorybuttons
  function catEvents() {
    var cat = document.getElementById("cat").childNodes;
    for (var i = 0; i < cat.length; i++) {
      cat[i].addEventListener("click", function() {
        if (this.parentNode.className != "answered") {
          this.style.backgroundColor = "Silver";
          if (this.value == "Video games") {
            url += "&category=15"
          } else if(this.value == "Board games") {
            url += "&category=16"
          } else if (this.value == "Anime & Manga") {
            url += "&category=31"
          } else if (this.value == "Cartoon") {
            url += "&category=32"
          }
          this.parentNode.setAttribute("class", "answered");
        }
      });
    }
  }
  catEvents();

  // add eventlisteners on all the levelbuttons
  function levelEvents() {
    var levels = document.getElementById("level").childNodes;
    for (var i = 0; i < levels.length; i++) {
      levels[i].addEventListener("click", function() {
        if (this.parentNode.className != "answered") {
          this.style.backgroundColor = "Silver";
          if (this.value == "Easy") {
            url += "&difficulty=easy"
          } if (this.value == "Medium") {
            url += "&difficulty=medium"
          } if (this.value == "Hard") {
            url += "&difficulty=hard"
          }
          this.parentNode.setAttribute("class", "answered");
        }
      });
    }
  }
  levelEvents();

  // fix the startbutton
  document.getElementById("start").addEventListener("click", function() {
    writeQuiz(url);
  })

  // print out the quiz on the page
  function writeQuiz(url) {
    console.log(url)
    fetch(url)
      .then(res => res.json()) // transform the data into json
      .then(function(res) {

        // get and create the html-elements
        var gameContainer = document.getElementById("content");
        var list = document.createElement("ul");
        list.setAttribute("id", "list");

        for (var i = 0; i < res.results.length; i++) {
          var q = res.results[i];
          // create an li for each question
          var qItem = document.createElement("li");
          var qText = document.createElement("h3");
          qItem.appendChild(qText);

          // print out the question
          var question = q.question;
          qText.innerHTML = question;

          // put all the alternatives in one array
          var alteratives = q.incorrect_answers;
          alteratives.push(q.correct_answer);

          // shuffle the alternativ, so the correct answers is not on index 3
          var altRand = [];
          for (var y = 4; y > 0; y--) {
            var n = Math.floor(Math.random() * y);
            var alt = alteratives[n]
            altRand.push(alt)
            alteratives.splice(n,1)
          }

          // a function to fix special characters
          function encodeHTML(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
          };


          // create buttons for answers
          for (var j = 0; j < altRand.length; j++) {
            var button = document.createElement("input");
            button.type = "submit";
            button.value = encodeHTML(altRand[j]);
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

        // create a place for the scorecounter
        var scoreCount = document.createElement("div");
        var scoreText = document.createElement("h4");
        scoreCount.setAttribute("id", "score-count")
        var score = 0;
        scoreText.innerHTML = score;
        scoreCount.appendChild(scoreText)
        list.appendChild(scoreCount)


        // add eventlisteners on all the answerbuttons
        function answEvents() {
          var buttons = document.getElementsByClassName("button");
          for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function() {
              // if the question is answered, nothing will happen to the buttons
              if (this.parentNode.className != "answered") {
                if (this.id == "correct") {
                  this.style.backgroundColor = "Lightgreen";
                  score++;
                  scoreText.innerHTML = score;
                }
                else {
                  this.style.backgroundColor = "Lightcoral";
                }
                this.parentNode.setAttribute("class", "answered");
              }
            });
          }
        }
        answEvents();


    });


  }

});
