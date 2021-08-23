"use strict";

class Comune {
  constructor(nome, sigla) {
    if (nome) this.nome = nome;

    if (sigla) this.sigla = sigla;
  }
}

export default Comune;
