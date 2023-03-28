// Target class (position and width)
class Target {
  constructor(x, y, w, l, id, t) {
    this.x = x;
    this.y = y;
    this.width = w;
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
    let colorsByType = createStringDict({
      
      //FRUITS//
      Apple: color(204,102,0),
      Avocado: color(204,102,0),
      Banana: color(204,102,0),
      Kiwi: color(204,102,0),
      Lemon: color(204,102,0),
      Lime: color(204,102,0),
      Mango: color(204,102,0),
      Melon: color(204,102,0),
      Nectarine: color(204,102,0),
      Orange: color(204,102,0),
      Papaya: color(204,102,0),
      "Passion Fruit": color(204,102,0),            //ver como fazer isto para este que tem dois
      Pear: color(204,102,0),
      Peach: color(204,102,0),
      Pineapple: color(204,102,0),
      Plum: color(204,102,0),
      Pomegranate: color(204,102,0),
      "Red Grapefruit": color(204,102,0),            //ver como fazer isto para este que tem dois
      Satsumas: color(204,102,0),

      //JUICE//
      Juice: color(200,0,0), // count = 9

      //MILK//
      Milk: "white", // count = 6
      "Soy Milk": "white",
      "Oat Milk": "white",
      "Sour Milk": "white",


      //CREAM//
      "Sour Cream": color(255,255,153),

      //YOGHURT//
      Yoghurt: color(0,0,255),
      Oatghurt: color(0,0,255),
      Soyghurt: color(0,0,255),


      //VEGETABLES//
      Asparagus: color(51,102,0),
      Aubergine: color(51,102,0),
      Cabbage: color(51,102,0),
      Carrots: color(51,102,0),
      Cucumber: color(51,102,0),
      Garlic: color(51,102,0),
      Ginger: color(51,102,0),
      Leek: color(51,102,0),
      Mushroom: color(51,102,0),
      Onion: color(51,102,0),
      Pepper: color(51,102,0),
      "Red Beet": color(51,102,0),
      Tomato: color(51,102,0),
      Zucchini: color(51,102,0),

      //POTATOS//
      Potato: color(107,65,33),

    });

    let letterColorByType = createStringDict({
      //MILK//
      Milk: "black",
      "Soy Milk": "black",
      "Oat Milk": "black",
      "Sour Milk": "black",

      "Sour Cream": "black",
    });

    // Draw target
    if (colorsByType.hasKey(this.type))
      fill(color(colorsByType.get(this.type)));
    else fill(color(155, 155, 155));
    circle(this.x, this.y, this.width);

    // Draw label
    textFont("Arial", 18);
    //fill(color(255, 255, 255));

    if (letterColorByType.hasKey(this.type))
    fill(color(letterColorByType.get(this.type)));
    else fill(color(255, 255, 255));

    textAlign(CENTER);
    text(this.label, this.x, this.y);
  }
}
