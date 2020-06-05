var fields = document.getElementsByTagName("input");
var calculate_button = document.getElementById("calculate-button");
var reset_button = document.getElementById("reset-button");
var buttons = document.getElementsByTagName("button");
var display_box = document.getElementById("display-box")

fields[0].focus();
// Add Event Listener for when the window is focused
window.addEventListener("focus", focus_input_on_window_focus, false);
window.addEventListener("keydown", function (event) {
  if (event.keyCode == 13) {
    calculate();
  }
}, false);

// Add Event Listeners for field inputs
for (var i = 0; i < fields.length; i++) {
  fields[i].addEventListener("input", input_focus, false);
}

// Add mouse Event Listeners for all button tag names
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("mousedown", button_press, false);
  buttons[i].addEventListener("mouseup", button_release, false);
}

function focus_input_on_window_focus() {
  sleep(50).then(() => {
    first_empty_input(fields).focus();
  })
}

// Add input Event Listeners for fields
function input_focus() {
  sleep(3000).then(() => {
    first_empty_input(fields).focus();
  })
}

function button_press() {
  this.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, 0.1)";
  if (this.id == "calculate-button") {
    calculate();
  }
  else if (this.id == "reset-button") {
    reset();
  }
  else {
    console.log("What? Why was button_press() called if calculate or reset wasn't pressed?")
  }
}

function button_release() {
  sleep(350).then(() => {
    for (var i = 0; i < buttons.length; i++) {
      this.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.25)";
    }
  })
}

function calculate() {
  var inputs = [];
  // Count how many valid inputs there are
  for (var i = 0; i < fields.length; i++) {
    if ((!isNaN(fields[i].value) && (fields[i].value != ""))) {
      inputs.push(parseInt(fields[i].value));
    }
  }
  if (inputs.length == 3) {
    var N = inputs.length;
    var multipliers = [];
    var number_GE_initial = 0;
    for (var i = 0; i < N; i++) {
      var scalar = inputs[i];
      var sum = 0;
      for (var j = 0; j < N; j++) {
        if (j != i) {
          sum += inputs[j];
        }
      }
      multipliers.push(sum * scalar);
    }
    console.log(multipliers);
    var initial_multiplier = multipliers.pop();
    if (multipliers.every(function (e) { return initial_multiplier < e })) {
      display_box.innerHTML = "<p>Shuffle! You got: " + initial_multiplier.toString() + "</p><p>Guaranteed a greater multiplier</p>" + "<p>Other Multipliers: " + multipliers.toString() + "</p>";
    }
  }
  else {
    display_box.innerHTML = "Make sure to input all 3 numbers"
  }
}

function reset() {
  for (var i = 0; i < fields.length; i++) {
    fields[i].value = "";
  }
  display_box.innerHTML = "";
}

//Helper Methods

// Takes a list of elements and returns the element
function first_empty_input(input_elements) {
  var last_index = input_elements.length - 1
  var focus_index = last_index
  for (var i = last_index; 0 <= i; i--) {
    if (isNaN(input_elements[i].value) || input_elements[i].value == " ") {
      input_elements[i].value = ""
    }
    if (input_elements[i].value == "") {
      focus_index = i;
    }
  }
  return input_elements[focus_index];
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

