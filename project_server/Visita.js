"use strict" ;

class Visita{
    constructor(mid, pid, data, ora, fatto, delega){

        if(mid)
            this.mid = mid;
        
        if(pid)
            this.pid = pid;

        if(data)
            this.data = data;
        
        if(ora)
            this.ora = ora;
        
        if(fatto)
            this.fatto = fatto;

        if(delega)
            this.delega = delega;
    }
}

module.exports = Visita;