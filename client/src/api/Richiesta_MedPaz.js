"use strict";
class Richiesta_MedPaz {
  constructor(mid, pid, sender) {
    if (mid) this.mid = mid;
    if (pid) this.pid = pid;
    if (sender) this.sender = sender;
  }
}
export default Richiesta_MedPaz;
