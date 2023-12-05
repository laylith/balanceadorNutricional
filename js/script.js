class Prato {
     //Inicializa e define o tamanho do array de alimentos no prato. (fixo em 5 por enquanto)
    constructor(tamanho = 5) {
      this.alimentos = new Array(tamanho);

      for (let i = 0; i < tamanho; i++)
        //Preenche o array com valores aleatórios entre 0 e 100 para testar quantidades de cada alimento.
        this.alimentos[i] = Math.random() * 100;
    }
    
    //Adiciona um valor ao final do array de alimentos.
    add(valor) {
      this.alimentos.push(valor);
    }
  
    toString() {
      //Representa o início do prato.
      let prato = "[";

      for (let i = 0; i < this.alimentos.length; i++) {
        // Adiciona o valor atual ao string prato.
        prato += this.alimentos[i].toString();
        // Adiciona uma vírgula e um espaço se não for o último elemento do array.
        if (i < this.alimentos.length - 1) prato += ", ";
      }

      //Adiciona "]" para representar o final do prato.
      prato += "]";

      //Retorna a string final que representa o prato.
      return prato;
    }
  }
  
  class EvolucaoDiferencial {
    //Inicializa a propriedade pratos e indica quantos serão gerados.
    constructor(tamanho) {
      this.tamanho = tamanho;
      //Cria um array de pratos dentro da classe EvolucaoDiferencial.
      this.pratos = new Array(this.tamanho);
    }
    
    //Preenche o array pratos com o número de instâncias Prato definido no construtor.
    populacao() {
      for (let i = 0; i < this.tamanho; i++) {
        this.pratos[i] = new Prato();
      }
      return this.pratos;
    }
  
    fitness(umPrato) {
      //Cálculo das quantidades de carboidratos, proteínas e gorduras com base nos alimentos do prato.
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
      
      //Cálculo das porcentagens de cada componente em relação ao total.
      porcaoCarboidratos = (carboidratos / total) * 100;
      porcaoProteinas = (proteinas / total) * 100;
      porcaoGorduras = (gorduras / total) * 100;

      //Cálculo das diferenças em relação às metas desejadas, math.abs() garante que os valores sejam sempre avaliados como positivos.
      diffCarboidratos = Math.abs(porcaoCarboidratos - 55);
      diffProteinas = Math.abs(porcaoProteinas - 30);
      diffGorduras = Math.abs(porcaoGorduras - 15);

      //Cálculo da soma das diferenças para obter o valor total de fitness.
      diffTotal = diffCarboidratos + diffProteinas + diffGorduras;
      
      //Retorna o valor total do fitness para o prato.
      return diffTotal;
    }
  
    mutacao(parental, vetores3) {
      let cont = 0;
      let A, B, C;
      let X;
      
      //Obtém novo prato parental e cria uma tentativa de Prato.
      let pratoParental = this.pratos[parental];
      let tentativa = new Prato();
      
      //Atribui A, B e C a pratos aleatórios da população.
      A = vetores3[0];
      B = vetores3[1];
      C = vetores3[2];
      
       //Percorre os alimentos do prato parental e gera um número aleatório de 0 a 1.
      while (cont < pratoParental.alimentos.length) {
        let R = Math.random();
        //Verifica se R é menor que o parâmetro de taxa de crossover (CR).
        if (R < EvolucaoDiferencial.CR) {
          X = A.alimentos[cont] + EvolucaoDiferencial.F * (B.alimentos[cont] - C.alimentos[cont]);
        } else {
          //Se R não for menor que CR, mantém o valor do prato parental.
          X = pratoParental.alimentos[cont];
        }

        // Adiciona o valor ao prato de tentativa.
        tentativa.add(X);
        cont++;
      }
      return tentativa;
    }
  
    melhorVetor() {
      let notas = [];
      let melhor = 0;

      //Cálculo do fitness para cada prato na população.
      for (let i = 0; i < this.tamanho; i++) {
        notas.push(this.fitness(this.pratos[i]));
      }

      //Encontra o índice do vetor prato com o melhor fitness.
      for (let i = 0; i < notas.length; i++) {
        if (notas[melhor] > notas[i]) melhor = i;
      }
      return melhor;
    }
    
    //Remove um elemento da população pratos pelo índice.
    removeVetor(indice) {
      this.pratos.splice(indice, 1);
    }
    
    //Adiciona o prato fornecido ao final da população usando o método push.
    addPrato(umPrato) {
      this.pratos.push(umPrato);
    }
  
    seleciona3(parental) {
      let p2 = [];
      let vetores3 = [];
      
      //Adiciona elementos ao array p2, excluindo o elemento na posição parental.
      for (let i = 0; i < this.tamanho; i++) {
        if (parental !== i) p2.push(this.pratos[i]);
      }
      
      //Loop para selecionar aleatoriamente 3 elementos de p2.
      for (let i = 0; i < 3; i++) {
        //Gera um índice aleatório dentro dos limites de p2.
        let indice = Math.floor(Math.random() * (p2.length - i));
        //Adiciona o elemento correspondente ao índice gerado ao array vetores3.
        vetores3.push(p2[indice]);
        //Remove o elemento selecionado de p2 para evitar repetições.
        p2.splice(indice, 1);
      }
      //Retorna o array contendo os 3 elementos aleatórios selecionados.
      return vetores3;
    }
  
    toString() {
      let populacao = "[";
      for (let i = 0; i < this.tamanho; i++)
        //Concatena cada elemento do array convertido para string à variável populacao.
        populacao += this.pratos[i].toString();
      populacao += "]";
      return populacao;
    }
  }
  
  //Probabilidade de Crossover.
  EvolucaoDiferencial.CR = 0.3;
  //Peso Diferencial.
  EvolucaoDiferencial.F = 0.8;
  
  class Teste {
    static main() {
      let tres;
      let tentativa;
      //Instancia a classe EvolucaoDiferencial passando o parâmetro 5 ao construtor.
      let ed = new EvolucaoDiferencial(5);

      //Inicializa a população.
      ed.populacao();

      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < 5; j++) {
          //Chama o método de seleção de três elementos do vetor.
          tres = ed.seleciona3(j);
          //Chama o método de mutação de três elementos do vetor e parental.
          tentativa = ed.mutacao(j, tres);
          //Compara o fitness da tentativa com o fitness do vetor atual e, se a tentativa for melhor, atualiza a população.
          if (ed.fitness(tentativa) < ed.fitness(ed.pratos[j])) {
            ed.removeVetor(j);
            ed.addPrato(tentativa);
          }
        }
        //Exibe informações sobre o melhor vetor atual.
        console.log(
          ed.melhorVetor() + " - " + ed.pratos[ed.melhorVetor()].toString()
        );
        //Exibe o fitness do melhor vetor atual.
        console.log(
          "Fitness: " + ed.fitness(ed.pratos[ed.melhorVetor()])
        );
      }
    }
  }
  
Teste.main();
  