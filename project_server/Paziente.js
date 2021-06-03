"use strict";

class Paziente {
  constructor(
    pid,
    nome,
    cognome,
    data_nascita,
    hash,
    mail,
    foto,
    telefono,
    codice_fiscale,
    tesserino_sanitario,
    indirizzo
  ) {
    if (pid) this.pid = pid;
    if (nome) this.nome = nome;
    if (cognome) this.cognome = cognome;
    if (data_nascita) this.data_nascita = data_nascita;
    if (hash) this.hash = hash;
    if (mail) this.mail = mail;
    if (foto) this.foto = foto;
    if (telefono) this.telefono = telefono;
    if (codice_fiscale) this.codice_fiscale = codice_fiscale;
    if (tesserino_sanitario) this.tesserino_sanitario = tesserino_sanitario;
    if (indirizzo) this.indirizzo = indirizzo;
  }
}

module.exports = Paziente;
