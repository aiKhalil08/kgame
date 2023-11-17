import { levels } from "./levels.js";
import { Level } from "./level.js";
import { State } from "./state.js";
import { Graphics } from "./graphics.js";
import { movablesObj } from "./movables.js";
import { cloneState } from "./clone.js";
let clone = false;
let timer = {};
function runLevel(level) {
    let plan = levels[level];
    let newLevel = new Level(plan, `LEVEL ${level}`);
    let newState = new State(newLevel);
    let parent = document.getElementById('parent');
    let graphics = new Graphics(parent, newLevel, newState);
    newState.movables = graphics.createBackground();
    let lastCheckpoint;
    function run (time) {
        //let start = Date.now();
        run.lastTime = run.lastTime || time;
        let timeStep = Math.min((time - run.lastTime), 20); 
        timeStep /= 1000;
        let start = Date.now();
        newState.trackKeys();
        //timer['track keys'] = (Date.now() - start) / 1000
        start = Date.now();
        newState = newState.update(timeStep);
        //timer['update movables'] = (Date.now() - start) / 1000
        // if (newState.lastCheckpoint) {
        //     if (!lastCheckpoint || clone) {
        //         //console.log('setting first checkpoint')
        //         start = Date.now();
        //         lastCheckpoint = cloneState(newState);
        //         timer['first clone state'] = (Date.now() - start) / 1000
        //         lastCheckpoint.player.position = newState.lastCheckpoint; 
        //         lastCheckpoint.keys = [];
        //         //lastCheckpoint.status = 'playing';
        //         clone = false;
        //     } else if (lastCheckpoint.player.position.x != newState.lastCheckpoint.x && lastCheckpoint.player.position.y != newState.lastCheckpoint.y) {
        //         //console.log('setting subsequent checkpoint')
        //         start = Date.now();
        //         lastCheckpoint = cloneState(newState);
        //         timer['more clone state'] = (Date.now() - start) / 1000
        //         lastCheckpoint.player.position = newState.lastCheckpoint; 
        //         lastCheckpoint.keys = [];
        //         //lastCheckpoint.status = 'playing';
        //     }
        // }
        start = Date.now();
        graphics.updateMovables(newState.movables)
        //timer['graphics update'] = (Date.now() - start) / 1000
        start = Date.now();
        graphics.keepPlayerAtCenter(newState.player)
        run.lastTime = time;
        //timer['player at center'] = (Date.now() - start) / 1000
        //requestAnimationFrame(run)
        if (newState.status == 'playing') {
            //console.log('playing')
            //states.push(newState);
            //run.instance++;
            requestAnimationFrame(run)
        } else if (newState.status == 'lost') {
            // if (newState.lastCheckpoint) {
            //     clone = true;
            //     console.log('are uou here')
            //     newState = lastCheckpoint;
            //     setTimeout(function () {
            //         //console.log('respawn')
            //         //checkpointState.player.position = position;
            //         start = Date.now();
            //         graphics.clearBackground();
            //         timer['respawn clear graphics'] = (Date.now() - start) / 1000
            //         start = Date.now();
            //         graphics = new Graphics(parent, newLevel, newState);
            //         newState.movables = graphics.createBackground();
            //         timer['respawn create graphics'] = (Date.now() - start) / 1000
            //         //console.log(ew)
            //         //checkpointState.status = 'playing';
            //         requestAnimationFrame(run)
            //     }, 2000);
            // } else {
                console.log('checkpint doesnt exists')
                setTimeout(function () {
                    graphics.background.remove();
                    runLevel(level);
                }, 2000)
             //}
        }
        //console.log(timer)
        // else if (newState.status == 'won') {
        //     level++;
        //     if (level < levels.length) {
        //         setTimeout(function () {
        //             graphics.background.remove();
        //             runLevel(level);
        //         }, 2000)
        //     } else if (level == levels.length) {
        //         setTimeout(function () {
        //             graphics.background.remove();
        //             alert('you have reached the end of the game');
        //         }, 2000)
        //     }
        // } 
    }
    requestAnimationFrame(run)
}

runLevel(0);