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
      Apple: "orange",
      Avocado: "orange",
      Banana: "orange",
      Kiwi: "orange",
      Lemon: "orange",
      Lime: "orange",
      Mango: "orange",
      Melon: "orange",
      Nectarine: "orange",
      Orange: "orange",
      Papaya: "orange",
      "Passion Fruit": "orange",            //ver como fazer isto para este que tem dois
      Pear: "orange",
      Peach: "orange",
      Pineapple: "orange",
      Plum: "orange",
      Pomegranate: "orange",
      "Red Grapefruit": "orange",            //ver como fazer isto para este que tem dois
      Satsumas: "orange",

      //JUICE//
      Juice: "purple", // count = 9

      //MILK//
      Milk: "teal", // count = 6
      "Soy Milk": "teal",
      "Oat Milk": "teal",
      "Sour Milk": "teal",


      //CREAM//
      "Sour Cream": "teal",

      //YOGHURT//
      Yoghurt: "coral",
      Oatghurt: "coral",
      Soyghurt: "coral",


      //VEGETABLES//
      Asparagus: "blue",
      Aubergine: "blue",
      Cabbage: "blue",
      Carrots: "blue",
      Cucumber: "blue",
      Garlic: "blue",
      Ginger: "blue",
      Leek: "blue",
      Mushroom: "blue",
      Onion: "blue",
      Pepper: "blue",
      Potato: "maroon",
      Tomato: "red",
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
