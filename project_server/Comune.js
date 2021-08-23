"use strict";
class Comune {
  constructor(nome, sigla) {
    if (sigla) this.sigla = sigla;
    if (nome) this.nome = nome;
  }
}

module.exports = Comune;
