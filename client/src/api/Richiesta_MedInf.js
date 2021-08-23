"use strict";
class Richiesta_MedInf {
  constructor(mid, iid, sender) {
    if (mid) this.mid = mid;
    if (iid) this.iid = iid;
    if (sender) this.sender = sender;
  }
}

export default Richiesta_MedInf;
