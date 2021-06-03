class Slot {

    constructor(tid, day, s_time, duration, eid, sid, mark, present, whitdrawn, oraltaken){
        this.tid = tid;
        this.day = day;
        this.time = s_time;
        this.eid = eid;
        this.duration = duration;
        this.present = present;
        this.whitdrawn = whitdrawn;
        this.oraltaken = oraltaken;
        if(sid)
            this.sid = sid;
        if(mark)
            this.mark = mark;

    }



}

module.exports = Slot;