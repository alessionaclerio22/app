"use strict";
class Richiesta_MedInf {
  constructor(mid, iid, sender) {
    if (mid) this.mid = mid;
    if (iid) this.iid = iid;
    if (sender) this.sender = sender;
  }
}

module.exports = Richiesta_MedInf;
