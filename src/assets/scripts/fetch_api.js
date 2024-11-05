class fetch_api {
    constructor(args){
        this.host = args.host;
        this.port = args.port;

        if(args.host == "localhost")
            this.ssl = false;
        else
            this.ssl = true;
    }

    getServerAddress(){
        return "http" + (this.ssl ? "s" : "") + "://" + this.host + ":" + this.port;
    }

    /*
    getJson(route, callback=null){
        fetch(this.getServerAddress() + route).then(res => res.json())
        .then(data => {
            if(callback != null)
                callback(data);
        }).catch(err => console.error(err));
    }
        */

    postJson(route, body, callback=null){
        fetch(this.getServerAddress() + route, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(data => { if(callback != null) callback(data) })
        .catch(err => console.error(err));
    }

    getPdf(route, callback=null){
        fetch(this.getServerAddress() + route, {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf",
            }
        }).then(res => {
            if (res.ok)
                return res.blob();
            else
                throw new Error("Failed to download resume.");
        }).then(blob => { if(callback != null) callback(blob) })
        .catch(err => console.error(err));
    }
}

export default fetch_api;