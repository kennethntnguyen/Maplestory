var fields = document.getElementsByTagName("input");
var calculate_button = document.getElementById("calculate-button");
var reset_button = document.getElementById("reset-button");
var buttons = document.getElementsByTagName("button");
var display_box = document.getElementById("display-box");
var calculated = false;

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
  if (display_box.innerHTML == "Error: Input all numbers") {
    display_box.innerHTML = "";
  }
  if (calculated == true) {
    sleep(3000).then(() => {
      first_empty_input(fields).focus();
    })
  }
}

function button_press() {
  this.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, 0.1)";
  if (this.id == "calculate-button") {
    calculate();
    input_focus();
  }
  else if (this.id == "reset-button") {
    reset();
    sleep(50).then(() => {
      fields[0].focus();
    })
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
  calculated = true;
  var inputs = [];
  // If inputs are valid then push to inputs arrays
  for (var i = 0; i < fields.length; i++) {
    if ((!isNaN(fields[i].value) && (fields[i].value != ""))) {
      inputs.push(parseInt(fields[i].value));
    }
  }
  // If inputs is length 3 then calculate permutations of multipliers
  if (inputs.length == 3) {
    var N = inputs.length;
    var multipliers = [];
    var number_equal_initial = 0;
    var number_greater_initial = 0;
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
    // Pop the initial multiplier
    var initial_multiplier = multipliers.pop();
    var multipliers_length = multipliers.length;
    // Count how many of the permutations are greater and also equal to initial_multiplier
    for (var i = 0; i < multipliers_length; i++) {
      if (initial_multiplier < multipliers[i]) {
        number_greater_initial++;
      }
      else if (initial_multiplier == multipliers[i]) {
        number_equal_initial++;
      }
    }
    // If all other permutations of multipliers are strictly greater than initial then suggest to shuffle
    if (number_greater_initial == multipliers_length) {
      display_box.innerHTML = "<p>Shuffle!</p><p>Current Multiplier &#60; New Multipliers</p>" + "You got: " + initial_multiplier.toString() + " versus " + multipliers.join(" & ") + "</p>";
    }
    // If one is equal and the other is strictly greater than then also suggest to roll
    else if ((number_greater_initial == 1) && (number_equal_initial == 1)) {
      display_box.innerHTML = "<p>Shuffle!</p><p>Current Multiplier &#8804; New Multipliers</p>" + "You got: " + initial_multiplier.toString() + " versus " + multipliers.join(" & ") + "</p>";
    }
    else if (number_equal_initial == 2) {
      display_box.innerHTML = "<p>You can shuffle, nothing will happen.</p><p>Current Multiplier &#61; New Multipliers</p>" + "<p>You got: " + initial_multiplier.toString() + " versus " + multipliers.join(" & ") + "</p>";
    }
    else {
      display_box.innerHTML = "<p>Don't Shuffle!</p><p>Current Multiplier &#8805; New Multipliers</p>" + "<p>You got: " + initial_multiplier.toString() + " versus " + multipliers.join(" & ") + "</p>";
    }
  }
  else {
    display_box.innerHTML = "Error: Input all numbers"
  }
}

function reset() {
  calculate = false;
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
  var filled = 0;
  for (var i = last_index; 0 <= i; i--) {
    if (isNaN(input_elements[i].value) || input_elements[i].value == " ") {
      input_elements[i].value = ""
    }
    if (input_elements[i].value == "") {
      focus_index = i;
    }
    else {
      filled++;
    }
  }
  if ((calculated == true) && (filled == 3)) {
    return input_elements[0];
  }
  else {
    return input_elements[focus_index];
  }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

