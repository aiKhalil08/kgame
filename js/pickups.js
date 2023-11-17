import { Vector } from "./vector.js";

export class ActivatePickup {
    constructor(pickup, time, player) {
        this.pickup = pickup;
        pickup.active = true;
        //this.spent = pickup.spent = false;
        this.type = pickup.pickupType;
        this.time = time;
    }
    addTime() {
        this.time += 10;
    }
    activate(player) {
        switch (this.type) {
            case 'lavaShield':
                player.shields.push(this.type);
                break;
            case 'jumper':
                this.normalSpeed = player.speed;
                player.speed = new Vector(this.normalSpeed.x, this.normalSpeed.y * 5);
                break; 
        }
    }
    deactivate(pickup, player) {
        switch (this.type) {
            case 'lavaShield':
                player.shields.some((e, i, arr) => {
                    if (e == 'lavaShield') {
                        player.shields = arr.splice(i,0);
                        return true;
                    }
                });
                break;
            case 'jumper':
                player.speed = this.normalSpeed;
                break; 
        }
        this.pickup.active = false;
        this.pickup.spent = true;
    }
}