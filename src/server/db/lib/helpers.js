module.exports = Object.assign({}, {
    getItemProperties : async function(item) {
        let queryString = ``;
        let keys = Object.keys(item);
        for await (let x of keys) {
            let str = keys.indexOf(x) != keys.length-1  ? `${getString(x,item[x])},` : `${getString(x,item[x])}`;
            queryString += str;
        }
        return queryString;
    }
});
const getString = function(key, value) {
    if(key !== null && key !== undefined && value !== null && value !== undefined) {
        if(typeof(value) === 'number') {
            return `${key}=${value}`;
        }else if(typeof(value) === 'string') {
            return `${key}='${value}'`;
        }else if(typeof(value) === 'boolean') {
            let val =  value == true ? 1 : 0;
            return `${key}='${val}'`;
        }
    }else {
        return new Error("invalid parameters");
    }
}