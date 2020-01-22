

export default class Request {

    constructor(client, resource, isMultipart) {
        this.client = client;
        this.resource = resource;
        this.isMultipart = isMultipart;
    }

    get_url(method, params) {
        const url = `/api/v1/${this.resource}/`;

        switch (method) {
            case 'create':
                return url;
            case 'list':
                return url;
            case 'update':
                return `${url}${params.id}/`;
            case 'retrieve':
                return `${url}${params.id}/`;
            case 'destroy':
                return `${url}${params.id}/`;
        }
    }

    createOrUpdate = (values, params) => {
        
        let id;

        if(values instanceof FormData) {
            const field = values.getParts().find(field => field.fieldName==='id');    
            if(field)
                id = field.string;
        } else {
            id = values.id;
        }

        if(id)
            return this.update(values, {id, ...params});

        return this.create(values, params);
    }

    create = async (values, params={}) => {
        const url = this.get_url('create');
        let request = this.isMultipart?this.client.futch:this.client.fetch;

        return request(url, {
            method: 'POST',
            body: values,
        }, params.onProgress);
    }

    list = async (params={}) => {
        const url = this.get_url('list');        

        const response = await this.client.get(url, params);
        return response.json();
    }

    retrieve = async (params={}) => {
        const url = this.get_url('retrieve', params);        
        const response = await this.client.get(url);
        return response.json();
    }

    update = async (values, params={}) => {
        const url = this.get_url('update', params);        
        let request = this.isMultipart?this.client.futch:this.client.fetch;

        return request(url, {
            method: 'PATCH',
            body: values,
        }, params.onProgress);
    }

    destroy = async (params) => {
        const url = this.get_url('destroy', params);        

        return this.client.fetch(url, {
            method: 'DELETE',
        });
    }
}
