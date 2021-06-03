"use strict";

class Medico {
  constructor(
    mid,
    nome,
    cognome,
    data_nascita,
    sede_ambulatorio,
    spec,
    telefono,
    mail,
    foto,
    ordine,
    numero_ordine,
    hash
  ) {
    if (mid) this.mid = mid;
    if (nome) this.nome = nome;
    if (cognome) this.cognome = cognome;
    if (mail) this.mail = mail;
    if (data_nascita) this.data_nascita = data_nascita;
    if (telefono) this.telefono = telefono;
    if (foto) this.foto = foto;
    if (sede_ambulatorio) this.sede_ambulatorio = sede_ambulatorio;
    if (spec) this.spec = spec;
    if (ordine) this.ordine = ordine;
    if (numero_ordine) this.numero_ordine = numero_ordine;
    if (hash) this.hash = hash;
  }
}

module.exports = Medico;
