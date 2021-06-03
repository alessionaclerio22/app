"use strict";

class Misurazione {
  constructor(
    misid,
    prescid,
    mid,
    pid,
    data_fissata,
    tipo,
    valore,
    note,
    timestamp_fatto,
    aiuto,
    ora_fissata,
    fascia_oraria,
    ora_fascia_n
  ) {
    if (misid) this.misid = misid;

    if (prescid) this.prescid = prescid;

    if (mid) this.mid = mid;

    if (pid) this.pid = pid;

    if (data_fissata) this.data_fissata = data_fissata;

    if (tipo) this.tipo = tipo;

    if (valore) this.valore = valore;

    if (note) this.note = note;

    if (timestamp_fatto) this.timestamp_fatto = timestamp_fatto;

    if (aiuto) this.aiuto = aiuto;

    if (ora_fissata) this.ora_fissata = ora_fissata;

    if (fascia_oraria) this.fascia_oraria = fascia_oraria;

    if (ora_fascia_n) this.ora_fascia_n = ora_fascia_n;
  }
}

module.exports = Misurazione;
