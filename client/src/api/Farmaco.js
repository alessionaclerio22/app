"use strict";

class Farmaco {
  constructor(
    pa,
    confRif,
    ATC,
    AIC,
    farm,
    conf,
    ditta,
    prezzoRif,
    prezzoPub,
    diff,
    nota,
    cge
  ) {
    if (pa) this.pa = pa;

    if (confRif) this.confRif = confRif;

    if (AIC) this.AIC = AIC;

    if (ATC) this.ATC = ATC;

    if (farm) this.farm = farm;

    if (conf) this.conf = conf;

    if (ditta) this.ditta = ditta;

    if (prezzoRif) this.prezzoRif = prezzoRif;

    if (prezzoPub) this.prezzoPub = prezzoPub;

    if (diff) this.diff = diff;

    if (nota) this.nota = nota;

    if (cge) this.cge = cge;
  }
}

export default Farmaco;
