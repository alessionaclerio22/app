class Prescrizione {
  constructor(
    prescid,
    data,
    pid,
    mid,
    nome,
    frequenza,
    data_inizio,
    data_fine,
    note,
    quantita_giorno,
    farm_mis_n
  ) {
    if (prescid) this.prescid = prescid;

    if (nome) this.nome = nome;

    if (data) this.data = data;

    if (mid) this.mid = mid;

    if (pid) this.pid = pid;

    if (frequenza) this.frequenza = frequenza;

    if (data_inizio) this.data_inizio = data_inizio;

    if (data_fine) this.data_fine = data_fine;

    if (note) this.note = note;

    if (quantita_giorno) this.quantita_giorno = quantita_giorno;

    if (farm_mis_n) this.farm_mis_n = farm_mis_n;
  }
}

export default Prescrizione;
