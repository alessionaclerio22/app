"use strict" ;

class Nota{

    constructor(mid, pid, data, testo){
        if(mid)
            this.mid = mid;

        if(pid)
            this.pid = pid;

        if(data)
            this.data = data;

        if(testo)
            this.testo = testo;
    }
}

module.exports = Nota;

