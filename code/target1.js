// Target class (position and width)
class Target {
  constructor(x, y, w, l, id, t) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.name = l;
    this.label = l.replace(" ", "\n");
    this.id = id;
    this.type = t;
  }

  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y) {
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }

  // Draws the target (i.e., a circle)
  // and its label
  draw() {
    let letterColorByType = createStringDict({
      //MILK//
      
    });

    let strokeByName = createStringDict({
      "Galia Melon": color(0, 51, 0),
      Melon: color(0, 51, 0),
      Watermelon: color(0, 51, 0),

      "Red Beet": color(153, 0, 0),
      "Red Delicious": color(153, 0, 0),
      "Red Grapefruit": color(153, 0, 0),
      "Red Potato": color(153, 0, 0),

      "0% Milk": "white",
      "0% Yoghurt": "white",

      //"Bell Pepper": "red",
      //"Rocoto Pepper": "red",
      //"Mild Pepper": "red",

      "Bio Fat Milk": color(0, 51, 153),
      "Bio Skim Milk": color(0, 51, 153),
      "Bio Milk": color(0, 51, 153),
      "Bio Cream": color(0, 51, 153),
      "Bio Soyghurt": color(0, 51, 153),
      "Bio Soy Milk": color(0, 51, 153),

    });

    let colorsByName = createStringDict({
      Golden: color(128, 0, 0),
      "Granny Smith": color(128, 0, 0),
      "Pink Lady": color(128, 0, 0),
      "Red Delicious": color(128, 0, 0),
      "Royal Gala": color(128, 0, 0),
      "Apple Juice": color(128, 0, 0),

      Orange: color(204, 82, 0),
      "Orange Juice": color(204, 82, 0),

      Anjou: color(96, 128, 0),
      Conference: color(96, 128, 0),
      Kaiser: color(96, 128, 0),
      "Pear Yoghurt": color(96, 128, 0),
      "Pear Juice": color(96, 128, 0),

      Mango: color(255, 128, 0),
      "Mango Juice": color(255, 128, 0),
      "Mango Yoghurt": color(255, 128, 0),

      "Cherry Juice": color(115, 38, 38),
      "Cherry Yoghurt": color(115, 38, 38),

      "White Potato": color(128, 64, 0),
      "Red Potato": color(128, 64, 0),
      "Sweet Potato": color(128, 64, 0),

      "Beef Tomato": color(204, 51, 0),
      "Tomato": color(204, 51, 0),
      "Vine Tomato": color(204, 51, 0),
    });

    let biosInBlue = createStringDict({
        "Bio Fat Milk": color(0, 51, 153),
        "Bio Skim Milk": color(0, 51, 153),
        "Bio Milk": color(0, 51, 153),
        "Bio Cream": color(0, 51, 153),
        "Bio Soyghurt": color(0, 51, 153),
        "Bio Soy Milk": color(0, 51, 153),
    });

    let redsInRed = createStringDict({
        "Red Beet": color(153, 0, 0),
        "Red Delicious": color(153, 0, 0),
        "Red Grapefruit": color(153, 0, 0),
        "Red Potato": color(153, 0, 0),
    });

    let zeroInBold = createStringDict({
        "0% Milk": "purple",
        "0% Yoghurt": "purple",
    });

    // Draw target
    //if (strokeByName.hasKey(this.name))
    //  stroke(strokeByName.get(this.name));
    //if (strokeByName.hasKey(this.name))
    //  strokeWeight(5);
    //else strokeWeight(0);
  
    if (colorsByName.hasKey(this.name))
      fill(color(colorsByName.get(this.name)));
    else fill(color(128, 128, 128));

    //fill(color(155, 155, 155));
    strokeWeight(0);
    circle(this.x, this.y, this.width);

    // Draw label
    strokeWeight(0);
    textStyle(NORMAL);
    textFont("Arial", 18);
    //fill(color(255, 255, 255));

    if (letterColorByType.hasKey(this.name))
    fill(color(letterColorByType.get(this.name)));
    else fill("white");

    textAlign(CENTER);
    text(this.label, this.x, this.y);

    if(biosInBlue.hasKey(this.name)) {
        strokeWeight(3);
        stroke("white");
        fill(color(biosInBlue.get(this.name)));
        textStyle(BOLD);
        text("Bio", this.x, this.y);
      }
      else ;

    if(redsInRed.hasKey(this.name)) {
        strokeWeight(3);
        stroke("white");
        textStyle(BOLD);
        fill(color(redsInRed.get(this.name)));
        text("Red", this.x, this.y);
      }
      else ;

    if(zeroInBold.hasKey(this.name)) {
        strokeWeight(3);
        stroke("white");
        textStyle(BOLD);
        fill(color(zeroInBold.get(this.name)));
        text("0%", this.x, this.y);
      }
      else ;
  }
}
