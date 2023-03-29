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


// Target list
let targets = [];
let order = [74, 75, 73, 29, 35, 34, 21, 6, 7, 12, 
  59, 60, 77, 37, 32, 30, 22, 13, 1, 2, 
  69, 61, 62, 33, 31, 36, 23, 8, 9, 10,
  63, 64, 65, 54, 49, 53, 11, 14, 16, 17,
  66, 72, 67, 56, 44, 57, 18, 19, 20, 24,
  71, 76, 70, 50, 58, 55, 3, 25, 26, 4,
  78, 79, 68, 80, 46, 47, 27, 5, 28, 15,
  39, 38, 43, 42, 51, 40, 45, 48, 52, 41];

let lines = [];
let lines_x = [0, 0, 5, 0, 6, 6, 8, 6, 9, 9, 9, 13, 0, 0, 0, 5, 6, 6, 8, 6, 9, 9, 14, 9];
let lines_y = [0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 6, 0, 7, 7, 9, 7, 7, 7, 7, 9, 7, 7, 7, 9];
let lines_d = [5, 6, 6, 5, 2, 6, 6, 2, 4, 6, 4, 6, 2, 5, 5, 2, 2, 2, 2, 2, 5, 2, 2, 5];
let lines_isHorizontal = [true, false, false, true, 
                          true, false, false, true, 
                          true, false, true, false, 
                          false, true, true, false, 
                          true, false, false, true, 
                          true, false, false, true];
let line_color = ["blue", "blue", "blue", "blue", "pink", "pink", "pink", "blue", "blue", "blue", "blue", "pink", "pink", "pink",
                  "blue", "blue", "blue", "blue", "pink", "pink", "pink", "blue", "blue", "blue"]

class Line {
  constructor(x, y, isHorizontal, distance, color) {
      this.x = x;
      this.y = y;
      this.isHorizontal = isHorizontal;
      this.d = distance;
      this.c = color
  }
  
  draw() {
      let x2;
      let y2;
      if (this.isHorizontal) {
          x2 = this.x + this.d;
          y2 = this.y;
      }
      else {
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


// Ensures important data is loaded before the program starts
function preload() {
  legendas = loadTable("legendas.csv", "csv", "header");
}

// Runs once at the start
function setup() {
  createCanvas(700, 500); // window size in px before we go into fullScreen()
  frameRate(60); // frame rate (DO NOT CHANGE!)

  legendasS = legendas.getArray().sort();
  console.log(legendasS);

  randomizeTrials(); // randomize the trial order at the start of execution
  drawUserIDScreen(); // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw() {
  if (draw_targets && attempt < 2) {
    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0)); // sets background to black

    for (var j = 0; j < lines.length; j++) lines[j].draw();
    
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
  console.log("PENALTY: " + penalty);
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

function createLines(target_size, horizontal_gap, vertical_gap) {
  h_margin = horizontal_gap / 20;
  v_margin = vertical_gap / 1.5;
  
  //let distance_to_target_h = h_margin / 2;
  let distance_to_target_v = v_margin / 2;
  
  for (var i = 0; i < lines_x.length; i++) {
    let x, y;

    /*if (lines_x[i] <= 5){
      x = 40 + (h_margin + target_size) * lines_x[i] - distance_to_target_h;
    }*/

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

    

    /*if (lines_x[i] > 5 && lines_x[i] <= 6){
      x = 40 + (h_margin + target_size) * lines_x[i] + 4 * h_margin - distance_to_target_h;
    }

    if (lines_x[i] > 6){
      x = 40 + (h_margin + target_size) * lines_x[i] + 8 * h_margin - distance_to_target_h
    }

    if (lines_y[i] <= 6){
      y = 40 + (target_size)*lines_y[i];
    }*/

      //let x = 40 + (h_margin + target_size) * lines_x[i] - distance_to_target_h;
      //let y = 40 + (v_margin + target_size) * lines_y[i] - distance_to_target_v;
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
} 

// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap) {
  // Define the margins between targets by dividing the white space
  // for the number of targets minus one
  h_margin = horizontal_gap / 20;
  v_margin = vertical_gap;
  let legendas_index = 0;

  let skip = 0;
  // Set targets in a 8 x 10 grid
  for (var r = 0; r < GRID_ROWS; r++) {
    for (var c = 0; c < GRID_COLUMNS; c++) {
      let target_x;
      let target_y;
      if (
        (c == 0 && r == 0) ||
        (c == 1 && r == 0) ||
        (c == 5 && r == 0) ||
        (c == 6 && r == 0) ||
        (c == 10 && r == 0) ||
        (c == 11 && r == 0) ||
        (c == 9 && r == 0) ||
        (c == 11 && r == 1) ||
        (c == 11 && r == 2) ||
        (c == 11 && r == 3) ||
        (c == 11 && r == 4) ||
        (c == 11 && r == 5) ||
        (c == 0 && r == 7) ||
        (c == 6 && r == 7) ||
        (c == 5 && r == 7) ||
        (c == 11 && r == 7)
      ) {
        skip++;
        continue;
      }
      // FRUITS
      if (c < 5 && r <= 5) {
        target_x = 40 + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
      } else {
        // MILK
        if (c < 7 && r <= 5) {
          target_x =
            40 + 4 * h_margin + (h_margin + target_size) * c + target_size / 2; // give it some margin from the left border
        } else {
          // VEGS
          if (c < 7 && r <= 5) {
            target_x =
              40 +
              8 * h_margin +
              (h_margin + target_size) * c +
              target_size / 2;
          } else {
            // JUICE
            if (c < 5 && r > 5) {
              target_x = 40 + (h_margin + target_size) * c + target_size / 2;
            } else {
              // CREAM
              if (c < 7 && r >= 6) {
                target_x =
                  40 +
                  4 * h_margin +
                  (h_margin + target_size) * c +
                  target_size / 2;
              }
              // YOURG
              else {
                target_x =
                  40 +
                  8 * h_margin +
                  (h_margin + target_size) * c +
                  target_size / 2;
              }
            }
          }
        }
      }
      target_y = target_size * r + target_size / 2;
      if (r > 5) target_y += v_margin;
      if (r <= 5) target_x += target_size / 2 + h_margin;

      // Find the appropriate label and ID for this target
      //let legendas_index = c + GRID_COLUMNS * r;

      //let target_label = legendasS[legendas_index][0];
      //let target_id = legendasS[legendas_index][1];
      //let target_type = legendasS[legendas_index][2];

      //let target_label = legendas[order[legendas_index]][0];
      //let target_id = legendas[order[legendas_index]][1];
      //let target_type = legendas[order[legendas_index]][2];
      console.log("( " + r + "," + c + ")");
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

    createLines(
      target_size * PPCM, 
      horizontal_gap * PPCM - 80, 
      vertical_gap * PPCM - 80
    );

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}
