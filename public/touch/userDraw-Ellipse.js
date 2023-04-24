// Ellipse class
console.log("user draw ellipse loaded");

class user {
  constructor(id, cnvWidth, cnvHeight) {
    this.id = id;
    this.position = {
      x: 0,
      y: 0,
    };

    var v1 = random(0, 255);
    var v2 = random(0, 255);
    var v3 = random(0, 255);

    this.alpha = 255;
    this.color = createVector(v1, v2, v3);
    console.log('setting color:', this.color);
    this.active = false;

    this.previousSize = 4;
    this.pPositions = new Array(this.previousSize);
    this.defaultSize = 20;
    this.drawTails = true;

    this.section = 0;

    this.cnvWidth = cnvWidth;
    this.cnvHeight = cnvHeight;
  }

  // drawWatercolor(){
  //   if (this.pPositions[0] == undefined) return;
  //   watercolor.addPaint(this.pPositions[0].x, this.pPositions[0].y, this.color[0], this.color[1], this.color[2]);
  // }

  draw() {
    if (this.active) {
      console.log("drawing user:", this.section);
      if (this.section == 0 || this.section == 2) {
        for (var i = this.previousSize; i > -1; i--) {
          if (this.pPositions[i] == undefined) continue;
          stroke(this.color.x, this.color.y, this.color.z, this.alpha);
          let scaledSize =
            ((this.defaultSize - 4) * (this.previousSize - i)) /
              this.previousSize +
            4;
          ellipse(
            this.pPositions[i].x * this.cnvWidth,
            this.pPositions[i].y * this.cnvHeight,
            scaledSize,
            scaledSize
          );
        }
      }

      // triangles
      if (this.section == 1) {
        stroke(this.color.x, this.color.y, this.color.z, this.alpha);
        for (var i = 1; i > -1; i--) {
          if (this.pPositions[i] == undefined) continue;
          if (this.pPositions[i - 1] == undefined) continue;
          // print(this.pPositions[i].x, this.pPositions[i].y);
          stroke(this.color.x, this.color.y, this.color.z, this.alpha);
          fill(204, 153, 0);
          // console.log(this.pPositions[i].x * this.cnvWidth, this.pPositions[i].y * this.cnvHeight);
          push();
          translate(
            this.pPositions[i].x * this.cnvWidth,
            this.pPositions[i].y * this.cnvHeight
          );

          let a =
            atan2(
              (this.pPositions[i].y - this.pPositions[i - 1].y) *
                this.cnvHeight,
              (this.pPositions[i].x - this.pPositions[i - 1].x) * this.cnvWidth
            ) - 90;
          rotate(a);
          triangle(0, 0, -10, 10, 10, 10);
          pop();
        }
      }

      if (this.section == 3) {
        stroke(this.color.x, this.color.y, this.color.z, this.alpha);
        for (var i = 1; i > -1; i--) {
          if (this.pPositions[i] == undefined) continue;
          if (this.pPositions[i - 1] == undefined) continue;
          // print(this.pPositions[i].x, this.pPositions[i].y);

          let val = random(0, 100);

          let size = random(.5, 1.2);

          stroke(this.color.x, this.color.y, this.color.z, val);
          fill(204, 153, 0, val);
          // console.log(this.pPositions[i].x * this.cnvWidth, this.pPositions[i].y * this.cnvHeight);
          push();
          translate(
            this.pPositions[i].x * this.cnvWidth,
            this.pPositions[i].y * this.cnvHeight
          );
          let a =
            atan2(
              (this.pPositions[i].y - this.pPositions[i - 1].y) *
                this.cnvHeight,
              (this.pPositions[i].x - this.pPositions[i - 1].x) * this.cnvWidth
            ) - 90;
          rotate(a);
          triangle(0, 0, -10 * size, 10 * size, 10 * size, 10 * size);
          pop();
        }
      }

      if (this.section == 4) {
        for (var i = 1; i > -1; i--) {
          if (this.pPositions[i] == undefined) continue;
          if (this.pPositions[i - 1] == undefined) continue;

          let val = random(0, 10);
          fill(this.color.x, this.color.y, this.color.z, val);
          noStroke();
          let size = random(.3, 1.6);

          translate(this.pPositions[0].x * this.cnvWidth, this.pPositions[0].y * this.cnvHeight) ;
          for (let i = 0; i < 4; i ++) {
            ellipse(0, 0, 10 * size, 40 * size);
            ellipse(0, 0, 40 * size, 10 * size);
          }
          // for (let i = 0; i < 10; i++) {
            
          //   ellipse(0, 30*size, 20*size, 80 * size);
          //   rotate(PI / 5);
          // }
        }
      }
    }
  }

  getID() {
    return this.id;
  }

  getPosition() {
    return this.position;
  }

  getColor() {
    return this.color;
  }

  isActive() {
    return this.active;
  }

  setActive(active) {
    this.active = active;
  }

  setSection(section) {
    console.log("set section " + section);
    if (section == 5) {
      let rnd = floor(random(0, 4));
      console.log("random section:", rnd);
      this.section = rnd.toString();
      this.setSection(rnd);
      return
    }else{
    this.section = section.toString();
    }
  }

  setPosition(x, y) {
    for (var i = this.previousSize - 1; i > -1; i--) {
      // if(this.pPositions[i] == undefined) continue;
      this.pPositions[i + 1] = this.pPositions[i];
    }
    this.pPositions[0] = { x: this.position.x, y: this.position.y };

    this.position.x = x;
    this.position.y = y;
  }

  setColor(color) {
    this.color = color;
  }

  clearPreviousPositions() {
    this.pPositions = new Array(this.previousSize);
    console.log("cleared positions");
    this.position.x = undefined;
    this.position.y = undefined;
  }
}
