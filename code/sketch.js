// Bakeoff #2 -- Seleção em Interfaces Densas
// IPM 2022-23, Período 3
// Entrega: até dia 31 de Março às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 10 de Abril

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 0; // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE = false; // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS = 12; // The numbers of trials (i.e., target selections) to be completed
const GRID_ROWS = 8; // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS = 12; // We divide our 80 targets in a 8x10 grid
let continue_button;
let legendas; // The item list from the "legendas" CSV
let legendasS; // The item list from the "legendas" CSV but sorted

// Metrics
let testStartTime, testEndTime; // time between the start and end of one attempt (8 trials)
let hits = 0; // number of successful selections
let misses = 0; // number of missed selections (used to calculate accuracy)
let database; // Firebase DB

// Study control parameters
let draw_targets = false; // used to control what to show in draw()
let trials; // contains the order of targets that activate in the test
let current_trial = 0; // the current trial number (indexes into trials array above)
let attempt = 0; // users complete each test twice to account for practice (attemps 0 and 1)

// Target class (position and width)

class Label {
  constructor(l, x, y, c) {
    this.label = l;
    this.x = x;
    this.y = y;
    this.color = c;
  }

  draw() {
    textStyle(BOLD);
    stroke("white");
    strokeWeight(5);
    fill(this.color);
    textFont("Arial", 48);
    textAlign(LEFT);
    text(this.label, this.x, this.y);
    textStyle(NORMAL);
    strokeWeight(0);
  }
}

let labels = [];

// Target list
let targets = [];
let order = [
  21, 6, 7, 59, 60, 12, 22, 13, 1, 2, 39, 38, 77, 69, 61, 62, 23, 8, 9, 10, 11,
  43, 42, 63, 64, 65, 66, 14, 16, 17, 18, 19, 51, 40, 72, 67, 71, 76, 20, 24, 3,
  25, 26, 45, 48, 74, 70, 75, 78, 4, 27, 5, 28, 15, 52, 41, 79, 73, 68, 80, 29,
  35, 34, 37, 32, 46, 47, 54, 49, 53, 56, 44, 30, 33, 31, 36, 57, 50, 58, 55,
];

let rectangles = [];
let lines_x = [0, 6, 9, 0, 6, 9];
let lines_y = [0, 0, 0, 7, 7, 7];
let lines_w = [5, 2, 4, 5, 2, 5];
let lines_h = [6, 6, 6, 2, 2, 2];
let line_color = [
  "#1a1a1a",
  "#1a1a1a",
  "#1a1a1a",
  "#1a1a1a",
  "#1a1a1a",
  "#1a1a1a",
];
//let line_color = ["#993d00", "white", "#006600", "#660000", "#600080", "#000066"];
//let line_color = ["#c6ecc6", "white", "#c6ecc6", "#ffb3b3", "#ffffb3", "#ccccff"];

class Line {
  constructor(x, y, isHorizontal, distance, color) {
    this.x = x;
    this.y = y;
    this.isHorizontal = isHorizontal;
    this.d = distance;
    this.c = color;
  }

  draw() {
    let x2;
    let y2;
    if (this.isHorizontal) {
      x2 = this.x + this.d;
      y2 = this.y;
    } else {
      x2 = this.x;
      y2 = this.y + this.d;
    }

    push();
    stroke(this.c);
    strokeWeight(3);
    line(this.x, this.y, x2, y2);
    pop();
  }
}

class Rectangle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.c = color;
  }

  draw() {
    push();
    stroke(this.c);
    fill(this.c);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.height, 20);
    pop();
  }
}

// Ensures important data is loaded before the program starts
function preload() {
  legendas = loadTable("legendas.csv", "csv", "header");
}

// Runs once at the start
function setup() {
  createCanvas(700, 500); // window size in px before we go into fullScreen()
  frameRate(60); // frame rate (DO NOT CHANGE!)

  legendasS = legendas.getArray().sort();
  // console.log(legendasS);

  randomizeTrials(); // randomize the trial order at the start of execution
  drawUserIDScreen(); // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw() {
  if (draw_targets && attempt < 2) {
    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0)); // sets background to black

    for (var j = 0; j < rectangles.length; j++) rectangles[j].draw();

    noStroke();

    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255, 255, 255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

    // Draw all targets
    for (var i = 0; i < legendas.getRowCount(); i++) {
      targets[i].draw();
    }

    // Draw all labels
    for (var i = 0; i < 6; i++) {
      labels[i].draw();
    }

    fill(color(255, 255, 255));
    // Draw the target label to be selected in the current trial
    textFont("Arial", 20);
    textAlign(CENTER);
    text(legendas.getString(trials[current_trial], 0), width / 2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance() {
  // DO NOT CHANGE THESE!
  let accuracy = parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time = (testEndTime - testStartTime) / 1000;
  let time_per_target = nf(test_time / parseFloat(hits + misses), 0, 3);
  let penalty = constrain(
    (parseFloat(95) - parseFloat(hits * 100) / parseFloat(hits + misses)) * 0.2,
    0,
    100
  );
  // console.log("PENALTY: " + penalty);
  let target_w_penalty = nf(
    test_time / parseFloat(hits + misses) + penalty,
    0,
    3
  );
  let timestamp =
    day() +
    "/" +
    month() +
    "/" +
    year() +
    "  " +
    hour() +
    ":" +
    minute() +
    ":" +
    second();

  textFont("Arial", 18);
  background(color(0, 0, 0)); // clears screen
  fill(color(255, 255, 255)); // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20); // display time on screen (top-left corner)

  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width / 2, 60);
  text("Hits: " + hits, width / 2, 100);
  text("Misses: " + misses, width / 2, 120);
  text("Accuracy: " + accuracy + "%", width / 2, 140);
  text("Total time taken: " + test_time + "s", width / 2, 160);
  text("Average time per target: " + time_per_target + "s", width / 2, 180);
  text(
    "Average time for each target (+ penalty): " + target_w_penalty + "s",
    width / 2,
    220
  );

  // Saves results (DO NOT CHANGE!)
  let attempt_data = {
    project_from: GROUP_NUMBER,
    assessed_by: student_ID,
    test_completed_by: timestamp,
    attempt: attempt,
    hits: hits,
    misses: misses,
    accuracy: accuracy,
    attempt_duration: test_time,
    time_per_target: time_per_target,
    target_w_penalty: target_w_penalty,
  };

  // Send data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE) {
    // Access the Firebase DB
    if (attempt === 0) {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }

    // Add user performance results
    let db_ref = database.ref("G" + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets) {
    for (var i = 0; i < legendas.getRowCount(); i++) {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) {
        // Checks if it was the correct target
        if (targets[i].id === legendas.getNum(trials[current_trial], 1)) hits++;
        else misses++;

        current_trial++; // Move on to the next trial/target
        break;
      }
    }

    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS) {
      testEndTime = millis();
      draw_targets = false; // Stop showing targets and the user performance results
      printAndSavePerformance(); // Print the user's results on-screen and send these to the DB
      attempt++;

      // If there's an attempt to go create a button to start this
      if (attempt < 2) {
        continue_button = createButton("START 2ND ATTEMPT");
        continue_button.mouseReleased(continueTest);
        continue_button.position(
          width / 2 - continue_button.size().width / 2,
          height / 2 - continue_button.size().height / 2
        );
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis();
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
  // Re-randomize the trial order
  randomizeTrials();

  // Resets performance variables
  hits = 0;
  misses = 0;

  current_trial = 0;
  continue_button.remove();

  // Shows the targets again
  draw_targets = true;
}

/*
function createLines(target_size, horizontal_gap, vertical_gap) {
  h_margin = horizontal_gap / 20;
  v_margin = vertical_gap / 1.5;
  
  //let distance_to_target_h = h_margin / 2;
  let distance_to_target_v = v_margin / 2;
  
  for (var i = 0; i < lines_x.length; i++) {
    let x, y;

    /*if (lines_x[i] <= 5){
      x = 40 + (h_margin + target_size) * lines_x[i] - distance_to_target_h;
    }

    //FRUITS
    if (lines_x[i] <= 5 && lines_y[i] <= 6) {
      x = 40 + (h_margin + target_size) * lines_x[i] + target_size / 2 + h_margin/2;
      y = 40 + (target_size) * lines_y[i];
    }

    if (lines_x[i] > 5 && lines_x[i] <= 8){
      if (lines_y[i] >= 0 && lines_y[i] <= 6){
        x = 40 + (h_margin + target_size) * (lines_x[i] - 1) + 4*h_margin + target_size/2 + h_margin/2;
        y = 40 + (target_size) * lines_y[i];
      }

      if (lines_y[i] > 6){
        x = 40 + (h_margin + target_size) * (lines_x[i] - 1) + 4*h_margin - h_margin/2;
        y = 40 + (target_size) * (lines_y[i] - 1) + vertical_gap;
      }
    }

    if (lines_x[i] >= 9){
      if (lines_y[i] <= 6){
        x = 40 + (h_margin + target_size) * (lines_x[i] - 2) + 8*h_margin + target_size/2 + h_margin/2;
        y = 40 + (target_size) * lines_y[i];
      }
      
      if (lines_y[i] > 6){
        x = 40 + (h_margin + target_size) * (lines_x[i] - 2) + 8*h_margin - h_margin/2;
        y = 40 + (target_size) * (lines_y[i] - 1) + vertical_gap;
      }
    }

    if (lines_x[i] <= 5 && lines_y[i] > 6){
      x = 40 + (h_margin + target_size) * lines_x[i] - h_margin/2;
      y = 40 + (target_size) * (lines_y[i] - 1) + vertical_gap;
    }

    let distance;
    if (lines_isHorizontal[i]) {
        distance = (h_margin + target_size) * lines_d[i] ;
    }
    else {
        distance = (v_margin + target_size) * lines_d[i] - 2*lines_d[i]*distance_to_target_v;
    }    
    
    let line = new Line(x, y, lines_isHorizontal[i], distance, line_color[i]);
    lines.push(line);
  }
} */

function createRectangles(target_size, horizontal_gap, vertical_gap) {
  h_margin = horizontal_gap / 20;
  v_margin = vertical_gap / 1.5;

  //let distance_to_target_h = h_margin / 2;
  let distance_to_target_v = v_margin / 2;

  for (var i = 0; i < lines_x.length; i++) {
    let x, y;

    //FRUITS
    if (lines_x[i] <= 5 && lines_y[i] <= 6) {
      x =
        40 +
        (h_margin + target_size) * lines_x[i] +
        target_size / 2 +
        h_margin / 2;
      y = 40 + target_size * lines_y[i];
    }

    if (lines_x[i] > 5 && lines_x[i] <= 8) {
      if (lines_y[i] >= 0 && lines_y[i] <= 6) {
        x =
          40 +
          (h_margin + target_size) * (lines_x[i] - 1) +
          4 * h_margin +
          target_size / 2 +
          h_margin / 2;
        y = 40 + target_size * lines_y[i];
      }

      if (lines_y[i] > 6) {
        x =
          40 +
          (h_margin + target_size) * (lines_x[i] - 1) +
          4 * h_margin -
          h_margin / 2;
        y = 40 + target_size * (lines_y[i] - 1) + vertical_gap;
      }
    }

    if (lines_x[i] >= 9) {
      if (lines_y[i] <= 6) {
        x =
          40 +
          (h_margin + target_size) * (lines_x[i] - 2) +
          8 * h_margin +
          target_size / 2 +
          h_margin / 2;
        y = 40 + target_size * lines_y[i];
      }

      if (lines_y[i] > 6) {
        x =
          40 +
          (h_margin + target_size) * (lines_x[i] - 2) +
          8 * h_margin -
          h_margin / 2;
        y = 40 + target_size * (lines_y[i] - 1) + vertical_gap;
      }
    }

    if (lines_x[i] <= 5 && lines_y[i] > 6) {
      x = 40 + (h_margin + target_size) * lines_x[i] - h_margin / 2;
      y = 40 + target_size * (lines_y[i] - 1) + vertical_gap;
    }

    let width, height;
    width = (h_margin + target_size) * lines_w[i];
    height =
      (v_margin + target_size) * lines_h[i] -
      2 * lines_h[i] * distance_to_target_v;

    let rectangle = new Rectangle(x, y, width, height, line_color[i]);
    rectangles.push(rectangle);
  }
}

// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap) {
  // Define the margins between targets by dividing the white space
  // for the number of targets minus one
  h_margin = horizontal_gap / 32;
  let big_h_margin = 3 * h_margin;
  v_margin = vertical_gap;
  let legendas_index = 0;

  const _labels_names = ["FRUITS", "MILK", "VEGGIE", "JUI", "CREAM", "YOG"];
  const _labels_colors = [
    "#cc5200",
    "#1a1a1a",
    "#267326",
    "#990000",
    "#ffa64d",
    "#000099",
  ];

  let skip = 0;
  // Set targets in a 8 x 10 grid
  for (var r = 0; r < GRID_ROWS; r++) {
    for (var c = 0; c < GRID_COLUMNS; c++) {
      let target_x;
      let target_y;

      const n = r * 12 + c;
      console.log(n);
      switch (n) {
        // primeira linha A
        case 0:
        case 1:
        case 2:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        // primeira linha B
        case 3:
        case 4:
          target_x =
            40 + big_h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        // primeira linha BIO
        case 5:
        case 6:
        case 7:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        //primeira linha C
        case 8:
        case 9:
        case 10:
        case 11:
          target_x =
            40 +
            3 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        // segunda linha A
        case 12:
        case 13:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        // segunda linha B
        case 15:
          target_x =
            40 + big_h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        // segunda linha BIO
        case 17:
        case 18:
        case 19:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        //segunda linha C
        case 20:
        case 21:
        case 22:
          target_x =
            40 +
            3 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 24:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        // segunda linha B
        case 25:
        case 26:
        case 27:
          target_x =
            40 + big_h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 28:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 29:
        case 30:
          target_x =
            40 +
            3 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 31:
        case 32:
        case 33:
        case 34:
          target_x =
            40 +
            4 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 35:
          target_x =
            40 +
            5 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 36:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 37:
        case 38:
          target_x =
            40 + big_h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 40:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 41:
          target_x =
            40 +
            3 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 43:
        case 44:
        case 45:
          target_x =
            40 +
            4 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 48:
        case 49:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
          target_x =
            40 + big_h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 56:
        case 57:
        case 58:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;

        case 60:
        case 61:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 62:
        case 63:
        case 64:
        case 65:
        case 66:
          target_x =
            40 + big_h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 68:
        case 69:
        case 70:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 72:
        case 73:
        case 74:
        case 75:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 76:
          target_x =
            40 + big_h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 77:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 78:
          target_x =
            40 +
            3 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 79:
          target_x =
            40 +
            4 * big_h_margin +
            +(h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 80:
          target_x =
            40 +
            5 * big_h_margin +
            +(h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 81:
          target_x =
            40 +
            6 * big_h_margin +
            +(h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 84:
        case 85:
        case 86:
        case 87:
          target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
          break;
        case 89:
          target_x =
            40 +
            2 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 90:
          target_x =
            40 +
            3 * big_h_margin +
            (h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 91:
          target_x =
            40 +
            4 * big_h_margin +
            +(h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        case 93:
          target_x =
            40 +
            6 * big_h_margin +
            +(h_margin + target_size) * c +
            target_size / 2; // give it some margin from the left border
          break;
        default: // give it some margin from the left border
          target_x =
            40 + 8 * h_margin + (h_margin + target_size) * c + target_size / 2;

          break;
      }

      target_y = target_size * r + target_size / 2;
      // if (r > 5) target_y += v_margin;
      // if (r <= 5) target_x += target_size / 2 + h_margin;

      switch (n) {
        case 14:
        case 16:
        case 23:
        case 39:
        case 42:
        case 46:
        case 47:
        case 59:
        case 67:
        case 71:
        case 82:
        case 83:
        case 88:
        case 92:
        case 94:
        case 95:
          continue;
      }

      // if (n > 80) continue;

      let numero = order[legendas_index] - 1;

      let target_label = legendas.getString(numero, 0);
      let target_id = legendas.getNum(numero, 1);
      let target_type = legendas.getString(numero, 2);

      let target = new Target(
        target_x,
        target_y + 40,
        target_size,
        target_label,
        target_id,
        target_type
      );
      legendas_index++;

      targets.push(target);
    }
  }
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
  if (fullscreen()) {
    // DO NOT CHANGE THESE!
    resizeCanvas(windowWidth, windowHeight);
    let display = new Display({ diagonal: display_size }, window.screen);
    PPI = display.ppi; // calculates pixels per inch
    PPCM = PPI / 2.54; // calculates pixels per cm

    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width = display.width * 2.54; // screen width
    let screen_height = display.height * 2.54; // screen height
    let target_size = 2; // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS; // empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap = screen_height - target_size * GRID_ROWS; // empty space in cm across the y-axis (based on 8 targets per column)
    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createTargets(
      target_size * PPCM,
      horizontal_gap * PPCM - 80,
      vertical_gap * PPCM - 80
    );

    /*createLines(
      target_size * PPCM, 
      horizontal_gap * PPCM - 80, 
      vertical_gap * PPCM - 80
    );*/

    createRectangles(
      target_size * PPCM,
      horizontal_gap * PPCM - 80,
      vertical_gap * PPCM - 80
    );

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}
