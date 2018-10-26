var res;

document.addEventListener("DOMContentLoaded", function() {
  var req = new XMLHttpRequest;
  var url = "https://opentdb.com/api.php?amount=5&type=multiple";
  // help to choose numbers of questions
  var oldNum;

  // add eventlisteners on all the categorybuttons
  function catEvents() {
    var cat = document.getElementById("cat").childNodes;
    for (var i = 0; i < cat.length; i++) {
      cat[i].addEventListener("click", function() {
        if (this.parentNode.className != "answered") {
          if (this.value == "Video games") {
            url += "&category=15"
          } else if(this.value == "Board games") {
            url += "&category=16"
          } else if (this.value == "Anime & Manga") {
            url += "&category=31"
          } else if (this.value == "Cartoons") {
            url += "&category=32"
          } else if (this.value == "Television") {
            url += "&category=14"
          } else if (this.value == "Music") {
            url += "&category=12"
          } else if (this.value == "Film") {
            url += "&category=11"
          } else if (this.value == "Musicals") {
            url += "&category=13"
          }
          this.parentNode.setAttribute("class", "answered");
          this.setAttribute("class", "choosen")
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
          if (this.value == "Easy") {
            url += "&difficulty=easy"
          } if (this.value == "Medium") {
            url += "&difficulty=medium"
          } if (this.value == "Hard") {
            url += "&difficulty=hard"
          }
          this.parentNode.setAttribute("class", "answered");
          this.setAttribute("class", "choosen")
        }
      });
    }
  }
  levelEvents();

  // startbutton, and all that should happen when you press it
  document.getElementById("start").addEventListener("click", function() {

    // reset the choicesbuttons
    document.getElementById("cat").setAttribute("class", "")
    document.getElementById("level").setAttribute("class", "")
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute("class", "")
    }

    // change numbers of questions
    var number = "";
    number = document.getElementById("num").value;
    numStr = "amount=";
    numStr += number;
    // check if requested number is a number
    if (number != "") {
      if (oldNum == undefined) {
        oldNum = "amount=5";
      }
      number = Number.parseInt(number);
      if (Number.isInteger(number)) {
        url = url.replace(oldNum, numStr);
      }
    }
    oldNum = numStr;

    // call the function to print the quiz
    writeQuiz(url);
  });

  // print out the quiz on the page
  function writeQuiz(url) {
    fetch(url)
      .then(res => res.json()) // transform the data into json
      .then(function(res) {

        // get and create the html-elements
        var gameContainer = document.getElementById("content");
        // replace all questions if quiz already exists
        if (gameContainer.childNodes.length > 0) {
          gameContainer.removeChild(gameContainer.childNodes[0]);
        }
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

        // add the list with the questions to the div in the html
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
                  var siblings = this.parentNode.children;
                  var corr = siblings.correct;
                  corr.style.backgroundColor = "rgba(144, 238, 144, 0.5)";
                  corr.style.transition = "1s"
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
