// Ellipse class

console.log('user draw loaded');

class user {
    constructor(id) {
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

        this.previousSize = 4;
        this.pPositions = new Array(this.previousSize);
        this.defaultSize = 10;
        this.drawTails = true;
    }

    draw() {
        if (this.active) {
            for (var i = this.previousSize; i > -1; i--) {
                if(this.pPositions[i] == undefined) continue;
                stroke(this.color.x, this.color.y, this.color.z, this.alpha);
                let scaledSize = (((this.defaultSize-4) * (this.previousSize-i) / this.previousSize)) + 4 ;
                console.log('scaled size: ' + scaledSize, i);
                ellipse(this.pPositions[i].x, this.pPositions[i].y, scaledSize, scaledSize);
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
        for (var i = this.previousSize-1 ; i > -1; i--) {
            // if(this.pPositions[i] == undefined) continue;
            this.pPositions[i+1] = this.pPositions[i];
            console.log('added previous positions!');
        }
        this.pPositions[0] = { x: this.position.x, 
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