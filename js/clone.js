export function cloneState(state) {
    // console.log('HERE IN CLONE')
    let newObj = JSON.parse(JSON.stringify(state));
    Object.setPrototypeOf(newObj, Object.getPrototypeOf(state));
    function clone(prop, parent, stateParent) {
        if (typeof parent[prop] == 'string' || typeof parent[prop] == 'number') return; 
        if (typeof parent[prop] == 'object') {
            if (Array.isArray(parent[prop])) {
                for (let i = 0; i < parent[prop].length; i++) {
                    clone(i, parent[prop], stateParent[prop]);
                }
            } else {
                Object.setPrototypeOf(parent[prop], Object.getPrototypeOf(stateParent[prop]));
                for (let element in parent[prop]) {
                    clone(element, parent[prop], stateParent[prop]);
                }
            }
        }
    }
    for (let prop in newObj) {
        clone(prop, newObj, state)
    }
    return newObj;
}