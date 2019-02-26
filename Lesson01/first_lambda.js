exports.handler = (event, context, callback) => {
    // TODO implement
    let minnum = 0;
    let maxnum = 10;
    let generatednumber = Math.floor(Math.random() * maxnum) + minnum
    callback(null, generatednumber); 
};