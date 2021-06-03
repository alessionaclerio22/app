class Medicina {
  constructor(
    medid,
    prescid,
    mid,
    pid,
    data,
    tipo,
    note,
    aiuto,
    presa,
    ora_fissata,
    fascia_oraria,
    ora_fascia_n
  ) {
    if (medid) this.medid = medid;

    if (prescid) this.prescid = prescid;

    if (tipo) this.tipo = tipo;

    if (aiuto) this.aiuto = aiuto;

    if (note) this.note = note;

    if (mid) this.mid = mid;

    if (pid) this.pid = pid;

    if (data) this.data = data;

    if (presa) this.presa = presa;

    if (ora_fissata) this.ora_fissata = ora_fissata;

    if (fascia_oraria) this.fascia_oraria = fascia_oraria;

    if (ora_fascia_n) this.ora_fascia_n = ora_fascia_n;
  }
}

export default Medicina;
