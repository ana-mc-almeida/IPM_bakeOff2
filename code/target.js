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
    let letterColorByName = createStringDict({
    
    });

    let strokeByName = createStringDict({
      "Bio Fat Milk": color(218, 213, 190),
      "Bio Skim Milk": color(218, 213, 190),
      "Bio Milk": color(218, 213, 190),
      "Bio Soy Milk": color(218, 213, 190),
      "Standard Milk": color(218, 213, 190),
      "Fat Milk": color(218, 213, 190),
      "Oat Milk": color(218, 213, 190),
      "0% Milk": color(218, 213, 190),

      "White Potato": color(102, 51, 0),
      "Red Potato": color(102, 51, 0),
      "Sweet Potato": color(102, 51, 0),

      Orange: color(25, 77, 25),
      "Orange Juice": color(25, 77, 25),

      Golden: color(153, 0, 0),
      "Granny Smith": color(153, 0, 0),
      "Pink Lady": color(153, 0, 0),
      "Red Delicious": color(153, 0, 0),
      "Royal Gala": color(153, 0, 0),

      Mango: "orange",
      "Mango Juice": "orange",
      "Mango Yoghurt": "orange",

      Anjou: color(102, 153, 0),
      Conference: color(102, 153, 0),
      Kaiser: color(102, 153, 0),
      "Pear Yoghurt": color(102, 153, 0),

      "Cherry Juice": color(153, 0, 51),
      "Cherry Yoghurt": color(153, 0, 51),

      "Beef Tomato": color(128, 0, 0),
      "Tomato": color(128, 0, 0),
      "Vine Tomato": color(128, 0, 0),
    })

    let colorsByName = createStringDict({
      
      Golden: color(153, 0, 0),
      "Granny Smith": color(153, 0, 0),
      "Pink Lady": color(153, 0, 0),
      "Red Delicious": color(153, 0, 0),
      "Royal Gala": color(153, 0, 0),
      "Apple Juice":  color(153, 0, 0),

      Orange: color(204, 82, 0),
      "Orange Juice": color(204, 82, 0),

      Mango: "orange",
      "Mango Juice": "orange",
      "Mango Yoghurt": "orange",

      Anjou: color(102, 153, 0),
      Conference: color(102, 153, 0),
      Kaiser: color(102, 153, 0),
      "Pear Yoghurt": color(102, 153, 0),

      "Cherry Juice": color(153, 0, 51),
      "Cherry Yoghurt": color(153, 0, 51),

      "Bio Fat Milk": color(0, 51, 153),
      "Bio Skim Milk": color(0, 51, 153),
      "Bio Milk": color(0, 51, 153),
      "Bio Cream": color(0, 51, 153),
      "Bio Soyghurt": color(0, 51, 153),
      "Bio Soy Milk": color(0, 51, 153),

      "White Potato": color(102, 51, 0),
      "Red Potato": color(102, 51, 0),
      "Sweet Potato": color(102, 51, 0),

      "Beef Tomato": color(128, 0, 0),
      "Tomato": color(128, 0, 0),
      "Vine Tomato": color(128, 0, 0),
    });


    let fillByName = createStringDict({
      Anjou: color(32, 96, 64),
      "Apple Juice":  color(32, 96, 64),
      Asparagus: color(32, 96, 64),
      Aubergine: color(32, 96, 64),
      Avocado: color(32, 96, 64),

      Banana: color(77, 77, 0),
      "Beef Tomato": color(77, 77, 0),
      "Bell Pepper": color(77, 77, 0),

      "Bio Fat Milk": color(96, 0, 128),
      "Bio Skim Milk": color(96, 0, 128),
      "Bio Milk": color(96, 0, 128),
      "Bio Cream": color(96, 0, 128),
      "Bio Soyghurt": color(96, 0, 128),
      "Bio Soy Milk": color(96, 0, 128),

      Cabbage: color(179, 89, 0),
      Cantaloupe: color(179, 89, 0),
      Carrots: color(179, 89, 0),
      "Cherry Juice": color(179, 89, 0),
      "Cherry Yoghurt": color(179, 89, 0),
      Conference: color(179, 89, 0),
      Cucumber: color(179, 89, 0),

      "Fat Milk": color(0, 77, 77),
      "Fresh Juice": color(0, 77, 77),

      "Galia Melon": color(96, 32, 32),
      Garlic: color(96, 32, 32),
      Ginger: color(96, 32, 32),
      Golden: color(96, 32, 32),
      "Granny Smith": color(96, 32, 32),
    
      Kaiser: color(0, 102, 34),
      Kiwi: color(0, 102, 34),
      
      Leek: color(85, 85, 43),
      Lemon: color(85, 85, 43),
      Lime: color(85, 85, 43),
    
      "Mandarin Juice": color(128, 51, 0),
      Mango: color(128, 51, 0),
      "Mango Juice": color(128, 51, 0),
      "Mango Yoghurt": color(128, 51, 0),
      Melon: color(128, 51, 0),
      "Mild Pepper": color(128, 51, 0),
      Mushroom: color(128, 51, 0),

      Nectarine: color(153, 61, 0),

      Oatghurt: color(25, 77, 25),
      "Oat Milk": color(25, 77, 25),
      Orange: color(25, 77, 25),
      "Orange Juice": color(25, 77, 25),

      Papaya: color(102, 0, 34),
      "Passion Fruit": color(102, 0, 34),
      Peach: color(102, 0, 34),
      "Peach Juice": color(102, 0, 34),
      "Pear Juice": color(102, 0, 34),
      "Pear Yoghurt": color(102, 0, 34),
      Pineapple: color(102, 0, 34),
      "Pink Lady": color(102, 0, 34),
      "Piri Piri": color(102, 0, 34),
      Pomegranate: color(102, 0, 34),
      Plum: color(102, 0, 34),

      "Red Beet": color(32, 32, 96),
      "Red Delicious": color(32, 32, 96),
      "Red Grapefruit": color(32, 32, 96),
      "Red Potato": color(32, 32, 96),
      "Rocoto Pepper": color(32, 32, 96),
      "Royal Gala": color(32, 32, 96),

      Satsumas: color(0, 51, 102),
      Smoothie: color(0, 51, 102),
      "Sour Cream": color(0, 51, 102),
      "Sour Milk": color(0, 51, 102),
      "Soy Milk": color(0, 51, 102),
      Soyghurt: color(0, 51, 102),
      "Standard Milk": color(0, 51, 102),
      "Sweet Potato": color(0, 51, 102),

      Tomato: color(128, 0, 0),

      "Vanilla Yoghurt": color(128, 43, 0),
      "Vine Tomato": color(128, 43, 0),

      "Yellow Onion": color(102, 0, 41),
      Yoghurt: color(102, 0, 41),

      Watermelon: color(128, 0, 0),
      "White Potato": color(128, 0, 0),

      Zucchini: color(31, 96, 63),

      "0% Milk": color(61, 61, 92),
      "0% Yoghurt": color(61, 61, 92),
    });



    // Draw target
    if (strokeByName.hasKey(this.name)) {
      stroke(strokeByName.get(this.name)),
      strokeWeight(8)
    }
    else strokeWeight(0);
  
    if (fillByName.hasKey(this.name))
      fill(color(fillByName.get(this.name)));
    else fill(color(155, 155, 155));

    //fill(color(155, 155, 155));
    circle(this.x, this.y, this.width);

    // Draw label
    strokeWeight(0);
    textFont("Arial", 18);
    //fill(color(255, 255, 255));

    if (letterColorByName.hasKey(this.name))
    fill(color(letterColorByName.get(this.name)));
    else fill(color(255, 255, 255));

    textAlign(CENTER);
    text(this.label, this.x, this.y);
  }
}
