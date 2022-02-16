export function RecursiveTree(obj, key) {
    // for (let key of obj) {
    //     if (key[keystring]) {
    //         console.log(key);
    //     }
    // }
    var values = [];
    JSON.stringify(obj, function (k, v) {
        if (k === key) values.push(v);
        return v;
    });
    console.log(values);
    return values;
}