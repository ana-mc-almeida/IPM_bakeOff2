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
      Apple: color(226,24,24),
      Avocado: color(226,24,24),
      Banana: color(226,24,24),
      Kiwi: color(226,24,24),
      Lemon: color(226,24,24),
      Lime: color(226,24,24),
      Mango: color(226,24,24),
      Melon: color(226,24,24),
      Nectarine: color(226,24,24),
      Orange: color(226,24,24),
      Papaya: color(226,24,24),
      "Passion Fruit": color(226,24,24),            //ver como fazer isto para este que tem dois
      Pear: color(226,24,24),
      Peach: color(226,24,24),
      Pineapple: color(226,24,24),
      Plum: color(226,24,24),
      Pomegranate: color(226,24,24),
      "Red Grapefruit": color(226,24,24),            //ver como fazer isto para este que tem dois
      Satsumas: color(226,24,24),

      //JUICE//
      Juice: color(204,102,0), // count = 9

      //MILK//
      Milk: color(114, 47, 55), // count = 6
      "Soy Milk": color(114, 47, 55),
      "Oat Milk":  color(114, 47, 55),
      "Sour Milk":  color(114, 47, 55),


      //CREAM//
      "Sour Cream": color(150, 111, 214),

      //YOGHURT//
      Yoghurt: color(0,0,255),
      Oatghurt: color(0,0,255),
      Soyghurt: color(0,0,255),


      //VEGETABLES//
      Asparagus: color(83,145,101),
      Aubergine: color(83,145,101),
      Cabbage: color(83,145,101),
      Carrots: color(83,145,101),
      Cucumber: color(83,145,101),
      Garlic: color(83,145,101),
      Ginger: color(83,145,101),
      Leek: color(83,145,101),
      Mushroom: color(83,145,101),
      Onion: color(83,145,101),
      Pepper: color(83,145,101),
      "Red Beet": color(83,145,101),
      Tomato: color(83,145,101),
      Zucchini: color(83,145,101),

      //POTATOS//
      Potato: color(107,65,33),

    });
    // Draw target
    if (colorsByType.hasKey(this.type))
      fill(color(colorsByType.get(this.type)));
    else fill(color(155, 155, 155));
    circle(this.x, this.y, this.width);

    // Draw label
    textFont("Arial", 18);
    fill(color(255, 255, 255));
    textAlign(CENTER);
    text(this.label, this.x, this.y);
  }
}
