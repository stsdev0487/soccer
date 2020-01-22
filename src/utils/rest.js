export const objectToFormData = (obj, options, form, namespace) => {

    let fd = form || new FormData();
    let formKey;

    for(var property in obj) {
        if(obj.hasOwnProperty(property)) {

            if(namespace && !options.hideProperty && !options.hideIndex) {
                formKey = namespace + '[' + property + ']';
            } else if(namespace && options.hideProperty && options.hideIndex) {
                formKey = namespace;
            } else if(namespace && options.hideIndex) {
                formKey = namespace + '[]';
            } else {
                formKey = property;
            }

            if(typeof obj[property] === 'object' &&
                obj[property] &&
                !(obj[property] instanceof File) &&
                !obj[property].uri //FIXME: dirty fix for react native file
            ) { 

                objectToFormData(obj[property], options, fd, property);

            } else {

                // if it's a string or a File object
                fd.append(formKey, obj[property]);
            }

        }
    }

    return fd;

};
