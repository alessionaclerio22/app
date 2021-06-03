class Infermiere {
  constructor(
    iid,
    nome,
    cognome,
    data_nascita,
    mail,
    foto,
    numero_ordine,
    ordine,
    telefono,
    hash
  ) {
    if (iid) this.iid = iid;
    if (nome) this.nome = nome;
    if (cognome) this.cognome = cognome;
    if (mail) this.mail = mail;
    if (data_nascita) this.data_nascita = data_nascita;
    if (telefono) this.telefono = telefono;
    if (foto) this.foto = foto;
    if (ordine) this.ordine = ordine;
    if (numero_ordine) this.numero_ordine = numero_ordine;
    if (hash) this.hash = hash;
  }
}

export default Infermiere;
