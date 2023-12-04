class Prato {
     // Inicializa a propriedade alimentos com um array de tamanho específico
    constructor(tamanho = 5) {
      this.alimentos = new Array(tamanho);
      for (let i = 0; i < tamanho; i++)
        // Preenche o array com valores aleatórios entre 0 e 200
        this.alimentos[i] = Math.random() * 200;
    }
  
    add(valor) {
      this.alimentos.push(valor);
    }
  
    toString() {
      let prato = "[";
      for (let i = 0; i < this.alimentos.length; i++) {
        prato += this.alimentos[i].toString();
        if (i < this.alimentos.length - 1) prato += ", ";
      }
      prato += "]";
      return prato;
    }
  }
  
  class EvolucaoDiferencial {
    constructor(tamanho) {
      this.tamanho = tamanho;
      this.pratos = new Array(this.tamanho);
    }
  
    populacao() {
      for (let i = 0; i < this.tamanho; i++) {
        this.pratos[i] = new Prato();
      }
      return this.pratos;
    }
  
    fitness(umPrato) {
      let carboidratos =
        umPrato.alimentos[0] * 0.05 +
        umPrato.alimentos[1] * 0.24 +
        umPrato.alimentos[2] * 0.26 +
        umPrato.alimentos[3] * 0.15 +
        umPrato.alimentos[4] * 0.29;
  
      let proteinas =
        umPrato.alimentos[0] * 0.23 +
        umPrato.alimentos[1] * 0.02 +
        umPrato.alimentos[2] * 0.026 +
        umPrato.alimentos[3] * 0.13 +
        umPrato.alimentos[4] * 0.095;
  
      let gorduras =
        umPrato.alimentos[0] * 0.05 +
        umPrato.alimentos[1] * 0.00 +
        umPrato.alimentos[2] * 0.01 +
        umPrato.alimentos[3] * 0.089 +
        umPrato.alimentos[4] * 0.014;
  
      let total, porcaoCarboidratos, porcaoProteinas, porcaoGorduras;
      let diffTotal, diffCarboidratos, diffProteinas, diffGorduras;
  
      total = carboidratos + proteinas + gorduras;
  
      porcaoCarboidratos = (carboidratos / total) * 100;
      porcaoProteinas = (proteinas / total) * 100;
      porcaoGorduras = (gorduras / total) * 100;
      diffCarboidratos = Math.abs(porcaoCarboidratos - 55);
      diffProteinas = Math.abs(porcaoProteinas - 30);
      diffGorduras = Math.abs(porcaoGorduras - 15);
      diffTotal = diffCarboidratos + diffProteinas + diffGorduras;
  
      return diffTotal;
    }
  
    mutacao(parental, vetores3) {
      let cont = 0;
      let A, B, C;
      let X;
  
      let pratoParental = this.pratos[parental];
      let tentativa = new Prato();
  
      A = vetores3[0];
      B = vetores3[1];
      C = vetores3[2];
  
      while (cont < pratoParental.alimentos.length) {
        let R = Math.random();
        if (R < EvolucaoDiferencial.CR) {
          X =
            A.alimentos[cont] +
            EvolucaoDiferencial.F * (B.alimentos[cont] - C.alimentos[cont]);
        } else {
          X = pratoParental.alimentos[cont];
        }
        tentativa.add(X);
        cont++;
      }
      return tentativa;
    }
  
    melhorVetor() {
      let notas = [];
      let melhor = 0;
      for (let i = 0; i < this.tamanho; i++) {
        notas.push(this.fitness(this.pratos[i]));
      }
      for (let i = 0; i < notas.length; i++) {
        if (notas[melhor] > notas[i]) melhor = i;
      }
      return melhor;
    }
  
    removeVetor(indice) {
      this.pratos.splice(indice, 1);
    }
  
    addPrato(umPrato) {
      this.pratos.push(umPrato);
    }
  
    seleciona3(parental) {
      let p2 = [];
      let vetores3 = [];
  
      for (let i = 0; i < this.tamanho; i++) {
        if (parental !== i) p2.push(this.pratos[i]);
      }
  
      for (let i = 0; i < 3; i++) {
        let indice = Math.floor(Math.random() * (p2.length - i));
        vetores3.push(p2[indice]);
        p2.splice(indice, 1);
      }
      return vetores3;
    }
  
    toString() {
      let populacao = "[";
      for (let i = 0; i < this.tamanho; i++)
        populacao += this.pratos[i].toString();
      populacao += "]";
      return populacao;
    }
  }
  
  EvolucaoDiferencial.CR = 0.3;
  EvolucaoDiferencial.F = 0.8;
  
  class Teste {
    static main() {
      let tres;
      let tentativa;
      let ed = new EvolucaoDiferencial(5);
      ed.populacao();
      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < 5; j++) {
          tres = ed.seleciona3(j);
          tentativa = ed.mutacao(j, tres);
          if (ed.fitness(tentativa) < ed.fitness(ed.pratos[j])) {
            ed.removeVetor(j);
            ed.addPrato(tentativa);
          }
        }
        console.log(
          ed.melhorVetor() + " - " + ed.pratos[ed.melhorVetor()].toString()
        );
        console.log(
          "Fitness: " + ed.fitness(ed.pratos[ed.melhorVetor()])
        );
      }
    }
  }
  
Teste.main();
  