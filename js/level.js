import { movablesObj as movables} from "./movables.js"
import { Vector } from "./vector.js";

export class Level {
    constructor(plan, name) {
        this.name = name;
        this.movables = [];
        this.map = [];
        this.checkpoints = [];
        this.rows = plan.trim().split(/\n/).map(line => [...line]);
        this.chars = this.rows.forEach((row, y) => {
            let rowArray = []; 
            row.forEach((ch, x) => {
                switch (ch) {
                    case '.':
                        rowArray[x] = 0;// empty space
                        break;
                    case '*':
                        rowArray[x] = 1;// player
                        this.movables.push(movables.player.create(new Vector(x, y)));
                        break;
                    case '#':
                        rowArray[x] = 2;// wall
                        break;
                    case 'c':
                        rowArray[x] = 2.1;// checkpoint wall
                        this.checkpoints.push(y, x);
                        break;
                    case '(':
                        rowArray[x] = 2.2;// lava shield wall
                        break;
                    case ')':
                        rowArray[x] = 2.3;// shrub shield wall
                        break;
                    case '[':
                        rowArray[x] = 2.4;// predator shield wall
                        break;
                    case '^':
                        rowArray[x] = 2.5;// jumper wall
                        break;
                    case '%':
                        rowArray[x] = 2.6;// coins pickup wall
                        break;
                    case '$':
                        rowArray[x] = 3;// coin
                        this.movables.push(movables.coin.create(new Vector(x, y)));
                        break;
                    case '=':
                        rowArray[x] = 4;// horizontal moving lava
                        this.movables.push(movables.lava.create(new Vector(x, y), new Vector(1, 0)));
                        break;
                    case '|':
                        rowArray[x] = 4;// vertical moving lava
                        this.movables.push(movables.lava.create(new Vector(x, y), new Vector(0, 1)));
                        break;
                    case '!':
                        rowArray[x] = 4;// dripping lava
                        this.movables.push(movables.lava.create(new Vector(x, y), new Vector(0, 1), new Vector(x, y)));
                        break;
                    case '+':
                        rowArray[x] = 5;//stagnant lava
                        break;
                    default:
                        throw new Error('Undefined character type');
                }
            });
            this.map.push(rowArray)
        });
        // this.movables.forEach(movable => {
        //     if (movable.type == 'lava') {
        //         movable.map = this.map;
        //     }
        //     if (movable.type == 'player') {
        //         movable.map = this.map;
        //     }
        // });
    }
    static create(plan) {
        return new Level(plan);
    }
}