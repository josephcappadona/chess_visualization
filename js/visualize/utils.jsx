export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

export const format = (theString, argumentArray) => {
    var regex = /%s/;
    var _r=function(p,c){return p.replace(regex,c);}
    return argumentArray.reduce(_r, theString);
}


export const formatTimeControl = (timeControl) => {
    const spl = timeControl.split("+");
    return format("%s+%s",
                  [parseInt(spl[0]) / 60,
                   spl[1]]);
};