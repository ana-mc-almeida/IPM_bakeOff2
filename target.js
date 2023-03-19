// Target class (position and width)
class Target {
  constructor(x, y, w, l, id, t) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.label = l;
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
      Juice: color(255, 0, 0), // count = 9
      Milk: "green", // count = 6
      Yoghurt: "yellow",
      Apple: "blue",
      Melon: "magenta",
      Pepper: "cyan",
      Potato: "orange",
      Tomato: (0, 0, 0),
    });

    // Draw target
    if (colorsByType.hasKey(this.type))
      fill(color(colorsByType.get(this.type)));
    else fill(color(155, 155, 155));
    circle(this.x, this.y, this.width);

    // Draw label
    textFont("Arial", 12);
    fill(color(255, 255, 255));
    textAlign(CENTER);
    text(this.label, this.x, this.y);
  }
}
