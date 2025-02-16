export namespace main {
	
	export class Tusk {
	    id: number;
	    text: string;
	    done: boolean;
	    data: string;
	    priority: string;
	
	    static createFrom(source: any = {}) {
	        return new Tusk(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.text = source["text"];
	        this.done = source["done"];
	        this.data = source["data"];
	        this.priority = source["priority"];
	    }
	}

}

