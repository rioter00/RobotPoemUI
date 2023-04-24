// Triangle class

console.log('user draw tris loaded');


class tri {
    constructor(id, canvasX, canvasY) {
        this.id = id;
        this.position = {
            x: 0,
            y: 0
        };

        var v1 = random(0, 255);
        var v2 = random(0, 255);
        var v3 = random(0, 255);

        this.alpha = 255;
        this.color = createVector(v1, v2, v3);
        this.active = false;

        this.previousSize = 7;
        this.pPositions = new Array(this.previousSize);
        this.defaultSize = 20;
        this.drawTails = true;

        this.width = canvasX;
        this.height = canvasY;
        console.log('receiver canvas: ' + this.width + ' x ' + this.height);
    }

    draw() {
        if (this.active) {
            stroke(this.color.x, this.color.y, this.color.z, this.alpha);

            for (var i = this.previousSize; i > -1; i--) {
                if (this.pPositions[i] == undefined) continue;
                stroke(this.color.x, this.color.y, this.color.z, this.alpha);
                let scaledSize = (((this.defaultSize - 4) * (this.previousSize - i) / this.previousSize)) + 4;

                fill(204, 153, 0);
                translate(this.pPositions[i].x, this.pPositions[i].y);
                let a = atan2(this.pPositions[i].y- this.pPositions[i-1].y, this.pPositions[i].x - this.pPositions[i-1].x) + 90;
                rotate(a);
                triangle(0, 0, -10, 10, 10, 10);
 
                pop();
                //ellipse(this.pPositions[i].x * this.width, this.pPositions[i].y * this.height, scaledSize, scaledSize);
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

    setPosition(x, y) {
        for (var i = this.previousSize - 1; i > -1; i--) {
            // if(this.pPositions[i] == undefined) continue;
            this.pPositions[i + 1] = this.pPositions[i];
            console.log('added previous positions!');
        }
        this.pPositions[0] = {
            x: this.position.x,
            y: this.position.y
        };

        this.position.x = x;
        this.position.y = y;
    }

    setColor(color) {
        this.color = color;
    }

    clearPreviousPositions() {
        this.pPositions = new Array(this.previousSize);
        console.log('cleared positions');
        this.position.x = undefined;
        this.position.y = undefined;
    }
}