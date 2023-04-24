// By Steve's Makerspace
// https://youtu.be/UpYfjZgxwP0
// Pick your color, slider for brush size, "s" to save a jpg, and you can change variables in lines 5 - 8 below.

class Watercolor {
  constructor() {
    this.defaultTime = 0.0012; // large = quick dry
    this.runnyColors = true;
    this.backgrd = 0; // 255 white; 0 black
    this.smallCanvas = true;
    this.state;
    this.dryTime = this.defaultTime;
    this.prevMouseX;
    this.prevMouseY;
    this.paintdrop;
    // this.sliderDrops, buttonDry, buttonWet, buttonDefault;
    this.colorPicker;
    this.colorPicked = {
        levels: [210, 100, 10, 255]
    }
    this.paint = [];
    this.tempPaint1 = [];
    this.tempPaint2 = [];
  }

  setup() {
    console.log('watercolor setup');
    pixelDensity(1);
    // if (this.smallCanvas == true) {
    // //   createCanvas(630, 450);
    // } else {
    // //   createCanvas(round(windowWidth * 0.98), round(windowHeight * 0.93));
    // }
    background(255);
    // this.colorPicker = createColorPicker("#ed225d");
    // this.colorPicker.position(0, height + 5);
    // this.sliderDrops = createSlider(5, 100, 20);
    // this.sliderDrops.position(70, height + 5);
    // this.buttonDry = createButton("Dry All");
    // this.buttonDry.position(210, height + 5);
    // this.buttonWet = createButton("Keep Wet");
    // this.buttonWet.position(270, height + 5);
    // this.buttonDefault = createButton("Default Dry");
    // this.buttonDefault.position(350, height + 5);
    // this.state.position(450, height + 5);
    this.paintDrop = 80;
    this.dryTime = 0.0001;

    // fill the arrays with white color
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.paint.push(this.backgrd, this.backgrd, this.backgrd, 0);
      }
    }

    this.tempPaint1 = this.paint;
    this.tempPaint2 = this.paint;
  }

  draw() {

    this.addPaint();
    this.update();
    this.render();
  }

  dry() {
    dryTime = 1000;
    state.html("Dry");
  }

  wet() {
    dryTime = 0.0001;
    state.html("Wet");
  }
  defaultDry() {
    dryTime = defaultTime;
    state.html("Default");
  }

  // add this.paint when clicking - start with dragging
  addPaint() {
    if (
      mouseIsPressed &&
      mouseX >= 0 &&
      mouseX <= width &&
      mouseY >= 0 &&
      mouseY <= height
    ) {
    console.log('addPaint');
      let distance = dist(this.prevMouseX, this.prevMouseY, mouseX, mouseY);
      let numPoints = floor(distance / 1); // larger number = more gaps and fewer points; these two lines from George Profenza, noted below.
      this.drawLinePoints(this.prevMouseX, this.prevMouseY, mouseX, mouseY, numPoints);

      // add this.paint when clicking in one place
      if (mouseX == this.prevMouseX && mouseY == this.prevMouseY) {
        this.renderPoints(mouseX, mouseY);
      }
    }
    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
    // preventing a wrap around error when dragging off canvas and back on
    if (mouseIsPressed && mouseX < 0) {
        this.prevMouseX = 0;
    }
    if (mouseIsPressed && mouseX > width - 1) {
        this.prevMouseX = width - 1;
    }
    if (mouseIsPressed && mouseY < 0) {
        this.prevMouseY = 0;
    }
    if (mouseIsPressed && mouseY > height - 1) {
        this.prevMouseY = height - 1;
    }
  }

  // calculate points when dragging
  // This function from George Profenza on stackoverflow https://stackoverflow.com/questions/63959181/how-do-you-draw-a-line-in-a-pixel-array
  drawLinePoints(x1, y1, x2, y2, points) {
    for (let i = 0; i < points; i++) {
      let t = map(i, 0, points, 0.0, 1.0);
      let x = round(lerp(x1, x2, t));
      let y = round(lerp(y1, y2, t));
      this.renderPoints(x, y);
    }
  }

  // replace array points when drawing
  renderPoints(x, y) {
      console.log('render points' + x, y);
    let arrayPos = (x + y * width) * 4;
    let newR = (this.paint[arrayPos + 0] + this.colorPicked.levels[0]) / 2;
    let newG = (this.paint[arrayPos + 1] + this.colorPicked.levels[1]) / 2;
    let newB = (this.paint[arrayPos + 2] + this.colorPicked.levels[2]) / 2;
    let newN = this.paint[arrayPos + 3] + this.paintDrop;
    this.paint.splice(arrayPos, 4, newR, newG, newB, newN); // replace the current pixel color with the newly calculated color
  }

  // if there's a lot of color in one place, spread it around

  update() {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let arrayPos = (x + y * width) * 4;
        if (this.paint[arrayPos + 3] > 4) {
          this.tempPaint1[arrayPos + 3] = this.paint[arrayPos + 3] - 4;

          // mix pixel to right
          if (x < width - 1) {
            this.tempPaint1[arrayPos + 4] =
              (this.paint[arrayPos + 4] + this.paint[arrayPos]) / 2;
            this.tempPaint1[arrayPos + 5] =
              (this.paint[arrayPos + 5] + this.paint[arrayPos + 1]) / 2;
            this.tempPaint1[arrayPos + 6] =
              (this.paint[arrayPos + 6] + this.paint[arrayPos + 2]) / 2;
            this.tempPaint1[arrayPos + 7] = this.paint[arrayPos + 7] + 1;
          }

          // mix pixel to left
          if (x > 0) {
            this.tempPaint1[arrayPos - 4] =
              (this.paint[arrayPos - 4] + this.paint[arrayPos]) / 2;
            this.tempPaint1[arrayPos - 3] =
              (this.paint[arrayPos - 3] + this.paint[arrayPos + 1]) / 2;
            this.tempPaint1[arrayPos - 2] =
              (this.paint[arrayPos - 2] + this.paint[arrayPos + 2]) / 2;
            this.tempPaint1[arrayPos - 1] = this.paint[arrayPos - 1] + 1;
          }

          // mix pixel below
          this.tempPaint1[arrayPos + width * 4] =
            (this.paint[arrayPos + width * 4] + this.paint[arrayPos]) / 2;
          this.tempPaint1[arrayPos + width * 4 + 1] =
            (this.paint[arrayPos + width * 4 + 1] + this.paint[arrayPos + 1]) / 2;
          this.tempPaint1[arrayPos + width * 4 + 2] =
            (this.paint[arrayPos + width * 4 + 2] + this.paint[arrayPos + 2]) / 2;
          this.tempPaint1[arrayPos + width * 4 + 3] =
            this.paint[arrayPos + width * 4 + 3] + 1;

          // mix pixel above
          this.tempPaint1[arrayPos - width * 4] =
            (this.paint[arrayPos - width * 4] + this.paint[arrayPos]) / 2;
          this.tempPaint1[arrayPos - width * 4 + 1] =
            (this.paint[arrayPos - width * 4 + 1] + this.paint[arrayPos + 1]) / 2;
          this.tempPaint1[arrayPos - width * 4 + 2] =
            (this.paint[arrayPos - width * 4 + 2] + this.paint[arrayPos + 2]) / 2;
          this.tempPaint1[arrayPos - width * 4 + 3] =
            this.paint[arrayPos - width * 4 + 3] + 1;
        }

        // gradually dry this.paint
        this.tempPaint1[arrayPos + 3] = this.paint[arrayPos + 3] - this.dryTime;
        if (this.tempPaint1[arrayPos + 3] < 0) {
          this.tempPaint1[arrayPos + 3] = 0;
        }
      }
    }

    if (this.runnyColors == true) {
      this.paint = this.tempPaint1;
    } else {
      for (let x = width; x > 0; x--) {
        for (let y = height; y > 0; y--) {
          let arrayPos = (x + y * width) * 4;
          if (this.paint[arrayPos + 3] > 4) {
            this.tempPaint2[arrayPos + 3] = this.paint[arrayPos + 3] - 4;

            // mix pixel to right
            if (x < width - 1) {
              this.tempPaint2[arrayPos + 4] =
                    (this.paint[arrayPos + 4] + this.paint[arrayPos]) / 2;
              this.tempPaint2[arrayPos + 5] =
                    (this.paint[arrayPos + 5] + this.paint[arrayPos + 1]) / 2;
              this.tempPaint2[arrayPos + 6] =
                    (this.paint[arrayPos + 6] + this.paint[arrayPos + 2]) / 2;
              this.tempPaint2[arrayPos + 7] = this.paint[arrayPos + 7] + 1;
            }

            // mix pixel to left
            if (x > 0) {
                this.tempPaint2[arrayPos - 4] =
                (this.paint[arrayPos - 4] + this.paint[arrayPos]) / 2;
                this.tempPaint2[arrayPos - 3] =
                (this.paint[arrayPos - 3] + this.paint[arrayPos + 1]) / 2;
                this.tempPaint2[arrayPos - 2] =
                (this.paint[arrayPos - 2] + this.paint[arrayPos + 2]) / 2;
                this.tempPaint2[arrayPos - 1] = this.paint[arrayPos - 1] + 1;
            }

            // mix pixel below
            this.tempPaint2[arrayPos + width * 4] =
              (this.paint[arrayPos + width * 4] + this.paint[arrayPos]) / 2;
              this.tempPaint2[arrayPos + width * 4 + 1] =
              (this.paint[arrayPos + width * 4 + 1] + this.paint[arrayPos + 1]) / 2;
              this.tempPaint2[arrayPos + width * 4 + 2] =
              (this.paint[arrayPos + width * 4 + 2] + this.paint[arrayPos + 2]) / 2;
              this.tempPaint2[arrayPos + width * 4 + 3] =
              this.paint[arrayPos + width * 4 + 3] + 1;

            // mix pixel above
            this.tempPaint2[arrayPos - width * 4] =
              (this.paint[arrayPos - width * 4] + this.paint[arrayPos]) / 2;
              this.tempPaint2[arrayPos - width * 4 + 1] =
              (this.paint[arrayPos - width * 4 + 1] + this.paint[arrayPos + 1]) / 2;
              this.tempPaint2[arrayPos - width * 4 + 2] =
              (this.paint[arrayPos - width * 4 + 2] + this.paint[arrayPos + 2]) / 2;
              this.tempPaint2[arrayPos - width * 4 + 3] =
              this.paint[arrayPos - width * 4 + 3] + 1;
          }

          // gradually dry this.paint
          this.tempPaint2[arrayPos + 3] = this.paint[arrayPos + 3] - this.dryTime;
          if (this.tempPaint2[arrayPos + 3] < 0) {
            this.tempPaint2[arrayPos + 3] = 0;
          }
        }
      }
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let arrayPos = (x + y * width) * 4;
          this.paint[arrayPos] = (this.tempPaint1[arrayPos] + this.tempPaint2[arrayPos]) / 2;
        }
      }
    }
  }

  // render all pixels
  render() {
    loadPixels();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let pix = (x + y * width) * 4;
        let arrayPos = (x + y * width) * 4;
        pixels[pix] = this.paint[arrayPos];
        pixels[pix + 1] = this.paint[arrayPos + 1];
        pixels[pix + 2] = this.paint[arrayPos + 2];
      }
    }
    updatePixels();
  }

  // Save art as jpg.
  keyTyped() {
    if (key === "s") {
      save("myCanvas.jpg");
    }
  }
}
