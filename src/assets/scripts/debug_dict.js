//logs array in a one-liner
function logArray(array){
    if(array.length > 0){
        let str = '[';
        for(let i = 0; i < array.length - 1; i++)
            str += `${array[i]}, `;
        str += array[array.length - 1] + ']';

        return str;
    } else return '[]';
}

//logs full dictionary information
function debug_dict(dic, hasArrays = false){
    let locateValueEndpoint = hasArrays ? val => {
        if(Array.isArray(val))
            return logArray(val);
        else
            return val;
    } : val => val;

    let str = '{\n';
    for(const [key, val] of Object.entries(dic))
        str += `\t${key}: ${locateValueEndpoint(val)}\n`;
    str += '}';

    console.log(str);
}

export default debug_dict;