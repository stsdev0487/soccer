export const snakeToCamelCase = (value) => {
    return value.replace(/(_[a-z])/g, ($1) => {
        return $1.toUpperCase().replace('_','');
    });
}

export const camelToSnakeCase = (value) => {
    return value.replace(/([A-Z])/g, ($1) => {
        return "_"+$1.toLowerCase();
    });
}

export const camelToSnakeCaseKeys = (obj) => {
    if(!obj) return obj;

    let newObj = {};
    for(const key in obj){
        newObj[camelToSnakeCase(key)] = obj[key];
    }
    return newObj;
}

export const snakeToCamelCaseKeys = (obj) => {
    if(!obj) return obj;

    let newObj = {};
    for(const key in obj){
        newObj[snakeToCamelCase(key)] = obj[key];
    }
    return newObj;
}
