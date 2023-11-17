import { Vector } from "./vector.js";
import { ActivatePickup } from "./pickups.js"
class Movables {
    constructor(position) {
        this.position = position;
        this.walls = [2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6];
    }
    id(id) {
        this.id = id;
    }
    type(type) {
        this.type = type;
    }
    reachedBound(newPoses, map, direction, movables) {
        let newPosX = newPoses[0];
        let newPosY = newPoses[1];
        let gameX = map[0].length - 1;
        let gameY = map.length - 1;
        let reached = false;
        switch (direction) {
            case 'left':  //left boundary
                if (newPosX <= 0) {
                    reached = true;
                } else {
                    let x = Math.floor(newPosX);
                    newPosY = Number(newPosY.toFixed(1));
                    reached = this.walls.includes(map[Math.ceil(newPosY)][x]) || this.walls.includes(map[Math.floor(newPosY)][x]);
                }
                break;
            case 'right': //right boundary
                if (newPosX >= gameX) {
                    reached = true;
                } else {
                    let x = Math.ceil(newPosX);
                    newPosY = Number(newPosY.toFixed(1));
                    reached = this.walls.includes(map[Math.ceil(newPosY)][x]) || this.walls.includes(map[Math.floor(newPosY)][x]);
                }
                break;
            case 'top':
                if (newPosY <= 0) { //top boundary
                    reached = true;
                } else {
                    let y = Math.floor(newPosY);
                    newPosX = Number(newPosX.toFixed(1));
                    reached = this.walls.includes(map[y][Math.ceil(newPosX)]) || this.walls.includes(map[y][Math.floor(newPosX)]);
                    if (reached && (this.walls.slice(2).includes(map[y][Math.ceil(newPosX)]) || this.walls.slice(2).includes(map[y][Math.floor(newPosX)]))) {
                        this.createPickup(map, newPosX, y, movables);
                        //console.log('pickup wall touched');
                    }
                }
                break;
            case 'down':
            //console.log(this.walls)
                if (newPosY >= gameY) { //down boundary
                    reached = true;
                } else {
                    let y = Math.ceil(newPosY);
                    newPosX = Number(newPosX.toFixed(1));
                    reached = this.walls.includes(map[y][Math.ceil(newPosX)]) || this.walls.includes(map[y][Math.floor(newPosX)]);
                }
                break;
        }
        return reached;
    }
}
class Player extends Movables {
    constructor(position) {
        super(position);
        super.type('player');
        this.size = new Vector(1, 1);
        this.speed = new Vector(3, 10);
        this.weight = 1;
        this.floating;
        this.toBeUsedPickups = [];
        this.shields = [];
        this.pickupClasses = [];
    }
    static create(position) {
        return new Player(position)
    }
    setId() {
        super.id('player');
    }
    collidesWith([x, y], obstacle) {
        let [posX, posY] = [x, y];
        let size = this.size;
        let obPos = obstacle.position;
        let obSize = obstacle.size;
        return (posX + size.x > obPos.x) && (posX < obPos.x + obSize.x) && (posY + size.y > obPos.y) && (posY < obPos.y + obSize.y);;
    }
    createPickup (map, x, y, movables) {
        let index;
        let pickup = [map[y][Math.ceil(x)], map[y][Math.floor(x)]].filter((e, i) => {
            if (this.walls.slice(2).includes(e)) {
                index = i;
                return true;
            }
        })[0];
        x = index == 0 ? Math.ceil(x) : Math.floor(x);
        pickup += 4;
        if (map[y-1][x] != pickup) {
            map[y-1][x] = pickup;
            map[y][x] = 2;
            //console.log(movables.length)
            movables.push(Pickup.create(pickup, [x, y]));
            //console.log(movables[movables.length - 1].created)
        }
    }
    usePickup(time, player) {
        this.usePickup.time = this.usePickup.time || 0;
        if (this.pickupClasses.length > 0) {
            this.pickupClasses.map((pickup, i, arr) => {
                //console.log( - pickup.time);
                if (this.usePickup.time - pickup.time > 10) {
                    console.log('deactinvating', this.usePickup.time - pickup.time)
                    arr[i].deactivate(pickup, this);
                    this.pickupClasses.splice(i, 1);
                    this.toBeUsedPickups.find((e, i) => {
                        if (e.pickupType == pickup.type) {
                            this.toBeUsedPickups.splice(i, 1);
                            return true;
                        }
                    })
                }
            })
        }
         //if (this.toBeUsedPickups.length > 0) console.log('player',this.toBeUsedPickups)
        let pickups = this.toBeUsedPickups.filter(e => !e.spent && !e.active);
        if (pickups.length > 0) {
            let pickup = pickups.shift();
            let pickupClass = new ActivatePickup(pickup, this.usePickup.time, player);
            this.pickupClasses.push(pickupClass);
            pickupClass.activate(this);
        }
        this.usePickup.time += time;
    } 
    update(map, time, keys, movables) {
        //console.log(player.pickup);
        this.usePickup(time, this);
        let newPosX = this.position.x;
        let newPosY = this.position.y;
        this.floating = !super.reachedBound([newPosX, newPosY], map, 'down');
        let touchesLava = false;
        if (this.weight < 0) {// levitation
            newPosY -= this.speed.y * time * Math.abs(this.weight);
            if (super.reachedBound([newPosX, newPosY], map, 'top', movables)) {
                newPosY = Math.ceil(newPosY);
                this.weight = this.weight + 0.1;
            }
            this.position.y = newPosY;
            this.weight += time * 2.5;
        }   
        if (this.weight >= 0 && this.floating) {//gravitation
            newPosY += this.speed.y * time * (this.weight / 2);
            if (super.reachedBound([newPosX, newPosY], map, 'down')) {
                this.floating = false;
                newPosY = Math.floor(newPosY);
                this.weight = 1;
            }
            this.position = new Vector(newPosX, newPosY);
            this.weight += time * 2.5;
        }
        if (keys.length > 0) {
            if (keys.includes('ArrowLeft')) {
                newPosX -= this.speed.x * time;
                newPosX = super.reachedBound([newPosX, newPosY], map, 'left') ? this.position.x : newPosX;
                this.position.x = newPosX;
            }
            if (keys.includes('ArrowRight')) {
                newPosX += this.speed.x * time; 
                if (super.reachedBound([newPosX, newPosY], map, 'right')) {
                    newPosX = Math.floor(newPosX);
                }
                this.position.x = newPosX;
            }
            if (keys.includes('ArrowUp')) {
                if (!this.floating) {
                    this.floating = true;
                    this.weight = -1;
                    newPosY -= this.speed.y * time;
                    newPosY = super.reachedBound([newPosX, newPosY], map, 'top') ? this.position.y : newPosY;
                    this.position.y = newPosY;
                }
            }
        }
        touchesLava = map[Math.ceil(newPosY)][Math.floor(newPosX)] == 5 || map[Math.ceil(newPosY)][Math.ceil(newPosX)] == 5;
        if (touchesLava) return 'lava';
        for (let movable of movables) {
            if (movable.type == 'player') continue;
            if (this.collidesWith([newPosX, newPosY], movable)) {
                this.position = new Vector(newPosX, newPosY);
                return movable;
            }
        }
        this.position = new Vector(newPosX, newPosY);
    }
}
class Coin extends Movables {
    constructor(position) {
        super(position)
        super.type('coin');
        this.size = new Vector(1, 1) 
    }
    static create(position) {
        return new Coin(position)
    }
    set setId(id) {
        let identity = 'coin'+id;
        super.id(identity);
    }
}
class Lava extends Movables {
    constructor(position, speed, drip) {
        super(position);
        super.type('lava');
        this.size = new Vector(1, 1);
        this.speed = speed;
        this.drip = drip;
    }
    static create(position, speed, drip) {
        return new Lava(position, speed, drip);
    }
    set setId(id) {
        let identity = 'lava'+id;
        super.id(identity);
    }
    update(map, time) {
        let dir = this.speed.times(time);
        let orientation = dir.x == 0 ? 'vertical' : 'horizontal';
        let newPosX = this.position.x + dir.x;
        let newPosY = this.position.y + dir.y;
        if (orientation == 'vertical') {
            if (dir.y >= 0 && super.reachedBound([newPosX, newPosY], map, 'down')) {
                if (this.drip) {
                    newPosY = this.drip.y + 1;
                } else {
                    newPosY = Math.floor(newPosY);
                    this.speed = this.speed.times(-1)
                }
            }
            if (dir.y < 0 && super.reachedBound([newPosX, newPosY], map, 'top')) {
                newPosY = this.position.y;
                this.speed = this.speed.times(-1)
            }
        }
        if (orientation == 'horizontal') {
            if (dir.x >= 0 && super.reachedBound([newPosX, newPosY], map, 'right')) {
                newPosX = Math.floor(newPosX);
                this.speed = this.speed.times(-1)
            }
            if (dir.x < 0 && super.reachedBound([newPosX, newPosY], map, 'left')) {
                newPosX = this.position.x;
                this.speed = this.speed.times(-1)
            }
        }
        this.position = new Vector(newPosX, newPosY);
    }
}
class Pickup extends Movables {
    constructor(type, pos, origin) {
        super(pos);
        switch (type) {
            case 6.2:
                this.pickupType = 'lavaShield';
                break;
            case 6.3:
                this.pickupType = 'shrubShield';
                break;
            case 6.4:
                this.pickupType = 'predatorShield';
                break;
            case 6.5:
                this.pickupType = 'jumper';
                break;
            case 6.6:
                this.pickupType = 'coins';
                break;
        }
        super.type('pickup');
        this.origin = origin;
        this.size = new Vector(1, 1);
        this.speed = new Vector(0, -0.3);
        this.risen = false;
        this.created = false;
        this.collected = false;
        this.active = false;
        this.spent = false;
        this.deducted = false;
    }
    static create(type, pos) {
        return new this(type, new Vector(...pos), new Vector(...pos));
    }
    collect(state) {
        //console.log('collecting')
        this.collected = true;
        state.pickups.push(this);
        //console.log(this)
    }
    set setId(id) {
        super.id('pickup'+id);
    }
    update(map, time) {
        if (this.position.y <= this.origin.y - this.size.y) {
            this.risen = true;
            return;
        }
        let dist = this.speed.times(time);
        //let newPosX = this.position.x + dist.x;
        let newPosY = this.position.y + dist.y;
        if (newPosY <= this.origin.y - this.size.y) {
            newPosY = this.origin.y - 1;
        }
        //this.position.x = newPosX;
        this.position.y = newPosY;
        // console.log('y',this.position.y);
    }
    activate(player) {
        console.log(this.active,'activated')
        let existsAlready = player.pickupClasses.some((e, i) => {
            if (e.type == this.pickupType) {
                player.pickupClasses[i].addTime();
                console.log(player.pickupClasses[i])
                return true;
            }
        });
        if (existsAlready) return;// {
        //     console.log(player.pickupClasses[i])
        //     // //console.log('pickup type already active')
        //     // let clonePickup = JSON.parse(JSON.stringify(this));
        //     // console.log('in player',player.toBeUsedPickups[0])
        //     // console.log('new clone',clonePickup)
        //     // player.toBeUsedPickups.push(clonePickup);

        //     return;
        // }
        player.toBeUsedPickups.push(this);
        console.log(this.spent,'activated')
   //     console.log(player.toBeUsedPickups)
    }
}
export let movablesObj = {player: Player, coin: Coin, lava: Lava, pickup: Pickup};