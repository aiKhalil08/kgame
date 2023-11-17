import { movablesObj } from "./movables.js";
import { Vector } from "./vector.js";
import { Checkpoint } from "./checkpoint.js";
import { cloneState } from "./clone.js";

export class State {
    constructor(level) {
        this.level = level;
        this.map = level.map;
        this.movables = level.movables;
        this.status = 'playing';
        this.keys = [];
        this.lastCheckpoint;
        this.pickups = [];
        //console.log('new statewas')
    }
    static start (level) {
        return new State(level);
    }
    get player() {
        return this.movables.find(e => e.type == 'player');
    }
    get coins() {
        let coins = this.movables.filter(e => e.type == 'coin' && !e.collected);
        return coins.length;
    }
    endLevel(status) {
        this.status = status;
    }
    reachedCheckpoint() {
        //this.reachedCheckpoint.position = this.reachedCheckpoint.position || null;
        let y = Math.round(this.player.position.y);
        y = y + 1 >= this.map.length ? y : y + 1;
        let x = this.player.position.x;
        //console.log(this.player)
        if (this.map[y][Math.ceil(x)] == 2.1 || this.map[y][Math.floor(x)] == 2.1) {
            x = [Math.ceil(x), Math.floor(x)].find(e => this.map[y][e] == 2.1);
            this.map[y][x] = 2;
            let position = new Vector(x, y - 1);
            if (this.lastCheckpoint && this.lastCheckpoint.x == position.x && this.lastCheckpoint.y == position.y) return;
            this.lastCheckpoint = position;
            //this.lastCheckpoint = cloneState(this);
            //this.lastCheckpoint.player.position = position;
        }
        /* let position;
        if (this.level.map[y][Math.floor(x)] == 2.1) {
            position = new Vector(Math.floor(x), y - 1);
            if (this.reachedCheckpoint.position) {
                if (this.reachedCheckpoint.position.x != position.x && this.reachedCheckpoint.position.y != position.y){
                    console.log('creating new checkpint')
                    let state = new Checkpoint(this)
                    this.lastCheckpoint = {position, state};//, number: this.reachedCheckpoint.number}
                    this.reachedCheckpoint.position = position;
                } 
            } else {
                console.log('creating new checkpint')
                let state = new Checkpoint(this)
                this.lastCheckpoint = {position, state};//, number: this.reachedCheckpoint.number}
                this.reachedCheckpoint.position = position;
            }
        } else if (this.level.map[y][Math.ceil(x)] == 2.1) {
            position = new Vector(Math.ceil(x), y - 1);
            if (this.reachedCheckpoint.position) {
                if (this.reachedCheckpoint.position.x != position.x && this.reachedCheckpoint.position.y != position.y){
                    console.log('creating new checkpint')
                    let state = new Checkpoint(this)
                    this.lastCheckpoint = {position, state};//, number: this.reachedCheckpoint.number};
                    this.reachedCheckpoint.position = position;
                }
            } else {
                console.log('creating new checkpint')
                let state = new Checkpoint(this)
                this.lastCheckpoint = {position, state};//, number: this.reachedCheckpoint.number};
                this.reachedCheckpoint.position = position;
            }
        } */
    }
    trackKeys() {
        window.addEventListener('keydown', e => {
            e.preventDefault();
            if (e.key == 'ArrowUp' && !this.keys.includes('ArrowUp')) {
                this.keys.push('ArrowUp');
            }
            if (e.key == 'ArrowLeft') {
                if (!this.keys.includes('ArrowLeft') && !this.keys.includes('ArrowRight'))
                this.keys.push('ArrowLeft');
            }
            if (e.key == 'ArrowRight') {
                if (!this.keys.includes('ArrowLeft') && !this.keys.includes('ArrowRight'))
                this.keys.push('ArrowRight');
            }
        });
        window.addEventListener('keyup', e => {
            e.preventDefault();
            if (e.key == 'ArrowUp' && this.keys.includes('ArrowUp')) {
                this.keys = this.keys.filter(key => key != e.key)
            }
            if (e.key == 'ArrowLeft') {
                if (this.keys.includes('ArrowLeft')) this.keys = this.keys.filter(key => key != e.key)
            }
            if (e.key == 'ArrowRight') {
                if (this.keys.includes('ArrowRight')) this.keys = this.keys.filter(key => key != e.key)
            }
        });
    }
    update(time) {
        //console.log(time.toFixed(5))
        //let start = Date.now();
        let status = false;
        for (let movable of this.movables) {
            if (movable.type != 'coin') {
                status = movable.update(this.map, time, this.keys, this.movables);
            }
            //if (!this.player.floating) this.reachedCheckpoint();
            if ((typeof status == 'string' && status == 'lava') || (typeof status == 'object' && status.type == 'lava')) {
                if (this.player.shields.includes('lavaShield')) continue;
                this.endLevel('lost');
            } else if (typeof status == 'object' && status.type == 'coin') {
                console.log('collided with ', status.id)
                status.collected = true;
                if (this.coins == 0) {
                    this.endLevel('won')
                }
            } else if (typeof status == 'object' && status.type == 'pickup') {
                if (!status.collected) status.collect(this);
                //console.log('we here', status.collected)
            }
            //console.log(this.movables[this.movables.length - 1].type)
        }
        //console.log((Date.now() - start) / 1000)
        return this;
    }
}