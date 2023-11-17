export class Graphics {
    constructor(parent, level, state) {
        this.parent = parent;
        this.state = state;
        this.unit = 40;
        this.map = state.map;
        this.movables = state.movables;
        this.name = level.name;
        this.status = state.status;
        this.background = document.createElement('div');
        this.background.id = 'background';
        let width = this.map[0].length * this.unit;
        let height = this.map.length * this.unit;
        this.background.style.width = `${width}px`;
        this.background.style.height = `${height}px`;
        this.parent.appendChild(this.background)
    }
    createBackground() {
        this.map.forEach((row, y) => {
            row.forEach((obj, x) => {
                let element = document.createElement('div')
                element.style.position = 'absolute';
                switch (obj) {
                    case 2:
                        element.style.width = `${this.unit * 1}px`;
                        element.style.height = `${this.unit * 1}px`;
                        element.style.top = `${this.unit * y}px`;
                        element.style.left = `${this.unit * x}px`;
                        element.className = 'walls';
                        break;
                    case 2.1:
                        element.style.width = `${this.unit * 1}px`;
                        element.style.height = `${this.unit * 1}px`;
                        element.style.top = `${this.unit * y}px`;
                        element.style.left = `${this.unit * x}px`;
                        element.className = 'checkpointWalls';
                        break;
                    case 5:
                        element.style.width = `${this.unit * 1}px`;
                        element.style.height = `${this.unit * 1}px`;
                        element.style.top = `${this.unit * y}px`;
                        element.style.left = `${this.unit * x}px`;
                        element.className = 'lava';
                        break;
                    default:
                        if ([2.2, 2.3, 2.4, 2.5].includes(obj)) {
                            //console.log('a pickup wall')
                            //if (obj == 2.2) console.log('one lava shield')
                            element.style.width = `${this.unit * 1}px`;
                            element.style.height = `${this.unit * 1}px`;
                            element.style.top = `${this.unit * y}px`;
                            element.style.left = `${this.unit * x}px`;
                            element.className = 'pickupWalls';
                        }
                        break;  
                }
                this.background.appendChild(element);
            })
        });
        let coins = 0;
        let lava = 0;
        let pickups = 0;
        this.movables.forEach((movable) => {
            console.log()
            let element = document.createElement('div');
            element.style.position = 'absolute';
            switch (movable.type) {
                case 'player':
                    element.style.width = `${this.unit * movable.size.x}px`;
                    element.style.height = `${this.unit * movable.size.y}px`;
                    element.style.top = `${this.unit * movable.position.y}px`;
                    element.style.left = `${this.unit * movable.position.x}px`;
                    element.id = 'player';
                    movable.setId();
                    break;
                case 'coin':
                    //console.log('I am here again')
                    coins++;
                    element.style.width = `${this.unit * movable.size.x}px`;
                    element.style.height = `${this.unit * movable.size.y}px`;
                    element.style.top = `${this.unit * movable.position.y}px`;
                    element.style.left = `${this.unit * movable.position.x}px`;
                    element.className = 'coins';
                    element.id = 'coin'+coins;
                    movable.setId = coins;
                    //alert('after coin '+element.style.top+' '+element.style.left)
                    break;
                case 'lava':
                    lava++;
                    //alert('lava')
                    element.style.width = `${this.unit * movable.size.x}px`;
                    element.style.height = `${this.unit * movable.size.y}px`;
                    if (movable.drip) {
                        let baseLava = element.cloneNode();
                        //alert(baseLava.style)
                        baseLava.className = 'lava';
                        baseLava.style.top = `${this.unit * movable.drip.y}px`;
                        baseLava.style.left = `${this.unit * movable.drip.x}px`;
                        this.background.appendChild(baseLava);
                    }
                    element.style.top = `${this.unit * movable.position.y}px`;
                    element.style.left = `${this.unit * movable.position.x}px`;
                    element.className = 'lava';
                    element.id = 'lava'+lava;
                    movable.setId = lava;
                    //alert('after coin '+element.style.top+' '+element.style.left)
                    break;
                default:
                    break;
            }
            this.background.appendChild(element);
        })
        //alert('inside graphics '+this.movables)
        return this.movables;
    }
    clearBackground() {
        Array.from(this.background.children).forEach(element => element.remove());
        this.background.remove();
    }
    createPickup(movable) {
        this.createPickup.pickups = this.createPickup.pickups || 1;
        let element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.width = `${this.unit * movable.size.x}px`;
        element.style.height = `${this.unit * movable.size.y}px`;
        element.style.top = `${this.unit * movable.position.y}px`;
        element.style.left = `${this.unit * movable.position.x}px`;
        element.className = 'pickups';
        element.id = 'pickup'+this.createPickup.pickups;
        movable.setId = this.createPickup.pickups;
        let parent = document.getElementsByClassName('pickupWalls');
        parent = Array.from(parent).find(e => {
            let top = e.style.top.slice(0, e.style.top.length - 2);
            let left = e.style.left.slice(0, e.style.left.length - 2);
            //console.log(top, //left)
            let movableTop = Math.round(movable.position.y);
            let movableLeft = Math.round(movable.position.x);
            if (Math.round(top / this.unit) == movableTop && Math.round(left / this.unit) == movableLeft) return true;
        });
        //console.log(parent)
        parent.style.backgroundColor = 'brown';
        this.background.appendChild(element);
        //console.log(this.background.lastElementChild)
        movable.created = true;
        this.createPickup.pickups++;
    }
    createPickupIcon(state) {
        this.createPickupIcon.id = this.createPickupIcon.id || 1; 
        //console.log('creating pickup icon')
        //console.log('agert icon',state.movables)
        let pickups = state.pickups;
        let pickup = pickups[pickups.length - 1]; // lastly collected pickup
        //console.log('to create icon for ',pickup)
        let existed = pickups.filter(e => pickup.pickupType == e.pickupType);
        //console.log(existed);
        let iconTray = document.getElementById('collectedPickups');
        if (existed.length >= 2) { //one already exists
            //console.log('is this existing')
            let existingIcons = Array.from(iconTray.querySelectorAll('div.pickupIcons'));
            let icon = existingIcons.find(e => {
                let type = e.getAttribute('data-pickupType');
                if (type == pickup.pickupType) return true;
            });
            icon.querySelector('span.count').innerText = existed.length; 
            return;
        }
        let icon = document.createElement('div');
        //icon.id = `pickup${this.createPickupIcon.id}`;
        //pickup.setId(this.createPickupIcon.id);
        icon.className = 'pickupIcons';
        icon.setAttribute('data-pickupType', pickup.pickupType);
        icon.innerText = pickup.pickupType.slice(0,2);
        let count = document.createElement('span');
        count.style.position = 'absolute';
        count.style.width = '30%';
        count.style.height = '30%';
        count.style.backgroundColor = 'green';
        count.style.color = 'white';
        count.className = 'count';
        icon.appendChild(count);
        //console.log(icon)
        iconTray.appendChild(icon);
        //console.log('creating pickup icon')
        icon.addEventListener('click', e => {
            e.stopPropagation();
            //pickup.activationTime;
            pickup.activate(state.player);
            this.clearPickup(this.state, icon); //updates pickups
        })
        this.createPickupIcon.id++;
    }
    clearPickup(state, icon) {
        //console.log('here')
        //let player = state.player;
        let count = icon.querySelector('span.count').innerText;
        if (count > 1) {
            icon.querySelector('span.count').innerText--;
        } else {
            //let type = icon.getAttribute('data-pickupType');
            icon.remove();
            // state.player.toBeUsedPickups.find((e, i) => {
            //     if (e.pickupType == type) {
            //         state.player.toBeUsedPickups.splice(i, 1);
            //         return true;
            //     }
            // })
        }
        state.pickups = state.pickups.filter(e => e.pickupType != icon.getAttribute('data-pickupType'));
        //let iconTray = document.getElementById('collectedPickups');
        // let existingIcons = Array.from(iconTray.querySelectorAll('div.pickupIcons'));
        // player.toBeUsedPickups.map((pickup, i) => {
        //     let icon = existingIcons.find(e => {
        //         let type = e.getAttribute('data-pickupType');
        //         if (type == pickup.pickupType) return true;
        //     });
        //     if (pickup.active && !pickup.deducted) {
        //         if (icon.querySelector('span.count').innerText > 1) {
        //             icon.querySelector('span.count').innerText--;
        //         } else {
        //             icon.remove();
        //         }
        //         console.log(icon)
        //         if (icon.querySelector('span.count').innerText == 0) pickup.deducted = true;
        //         pickup.deducted = true;
        //         state.pickups = state.pickups.filter(e => e.id != pickup.id);
        //     } else if (pickup.spent) {
        //         console.log('youve come here')
           // }
       // })
    }
    updateMovables(movables) {
        //let start = Date.now();
        for (let movable of movables) {
            let element = document.getElementById(movable.id);
            if (movable.type == 'pickup' && !movable.created) {
                this.createPickup(movable);
                //movable.parent.style.backgroundColor = 'brown';
                continue;
            }
            if (movable.type == 'coin' && movable.collected) {
                let index = movables.findIndex(e => e.id == movable.id);
                movables.splice(index, 1)[0];
                element.remove();
                continue;
            }
            if (movable.type == 'pickup' && movable.collected) {
                let index = movables.findIndex(e => e.id == movable.id);
                //console.log('b4 slicecing',movables)
                movables.splice(index, 1)[0];
                //console.log('are uou not slicecing',movables)
                element.remove();
                this.createPickupIcon(this.state);
                continue;
            }
            // if (movable.type == 'pickup' && movable.spent) {
            //     this.clearPickup(this.state);
            //     continue; 
            // }
            if (movable.type == 'pickup' && movable.risen) {
                continue; 
            }
            //console.log(movable.id)
            try {element.style.top = `${this.unit * movable.position.y}px`;
            element.style.left = `${this.unit * movable.position.x}px`;}
            catch (e) {}//console.log(movable)}
        }
        if (this.state.status == 'lost') {
            let player  = document.getElementById(this.state.player.id);
            player.style.backgroundColor = 'red';
        }
        if (this.state.status == 'won') {
            let player  = document.getElementById(this.state.player.id);
            player.style.backgroundColor = 'pink';
        }
        //console.log((Date.now() - start) / 1000)
    }
    keepPlayerAtCenter() {
        let width = this.parent.style.width;
        let height = this.parent.style.height;
        width = Number(width.slice(0, width.length - 2));
        height = Number(height.slice(0, height.length - 2));
        let xSections = (width / 3);
        let ySections = (height / 3);
        let leftTran = (this.parent.scrollLeft + xSections) - this.state.player.position.x * this.unit;
        let rightTran = (this.state.player.position.x * (this.unit + 1)) - (this.parent.scrollLeft + (2 * xSections));
        let upTran = (this.parent.scrollTop + ySections) - this.state.player.position.y * this.unit;
        let downTran = (this.state.player.position.y * (this.unit + 1)) - (this.parent.scrollTop + (2 * ySections));
        if (leftTran > 0) {
            this.parent.scrollLeft -= leftTran;
        }
        if (rightTran > 0) {
            this.parent.scrollLeft += rightTran;
        }
        if (upTran > 0) {
            this.parent.scrollTop -= upTran;
        }
        if (downTran > 0) {
            this.parent.scrollTop += downTran;
        }
    }
}