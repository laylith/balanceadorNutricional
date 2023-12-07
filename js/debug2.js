

function adicionarLinha() {
    var tabela = document.getElementById('tabela');
    var novaLinha = tabela.insertRow(tabela.rows.length);
    
    var celula1 = novaLinha.insertCell(0);
    var celula2 = novaLinha.insertCell(1);
    var celula3 = novaLinha.insertCell(2);
    var celula4 = novaLinha.insertCell(3);
    var celulaAcoes = novaLinha.insertCell(4);

    celula1.innerHTML = '<input type="text" class="alimento" name="" id="">';
    celula2.innerHTML = '<input type="text" class="proteina" name="" id="">';
    celula3.innerHTML = '<input type="text" class="carboidrato" name="" id="">';
    celula4.innerHTML = '<input type="text" class="gordura" name="" id="">';

    // Adicionar botão "Remover" exceto para as três primeiras linhas
    if (tabela.rows.length > 3) {
        celulaAcoes.innerHTML = '<button onclick="removerLinha(this)">Remover</button>';
    }
}

function removerLinha(botaoRemover) {
    var tabela = document.getElementById('tabela');
    var rowIndex = botaoRemover.parentNode.parentNode.rowIndex;

    // Garantir que haja no mínimo três linhas antes de remover
    if (tabela.rows.length > 3) {
        tabela.deleteRow(rowIndex);
    }
}


function processa() {
    var tam = document.getElementsByClassName('alimento');
    var tamCarb = document.getElementsByClassName('carboidrato');
    var tamProt = document.getElementsByClassName('proteina');
    var tamGord = document.getElementsByClassName('gordura');
    for (var i = 0; i < tam.length; i++) {
        // console.log('Repetição ' + (i + 1) + ': Valor do input - ' + tam[i].value);
    }
    
class Prato {
    
    constructor(tamanho = tam.length) {
        this.alimentos = Array.from({ length: tamanho }, () => Math.random() * 100);
    }

    add(valor) {
        this.alimentos.push(valor);
    }

    toString() {
        return `[${this.alimentos.map(alimento => alimento.toFixed(2)).join(', ')}]`;
    }
}

class EvolucaoDiferencial {
    constructor(tamanho) {
        this.tamanho = tamanho;
        this.pratos = Array.from({ length: tamanho }, () => new Prato());
    }

    populacao() {
        this.pratos = Array.from({ length: this.tamanho }, () => new Prato());
        this.pratos.forEach(prato => prato.alimentos = new Array(prato.alimentos.length).fill(0).map(() => Math.random() * 100));
        return this.pratos;
    }    

    // fitness(umPrato) {
    //     // const pesoCarboidratos = [0.05, 0.24, 0.26, 0.15];
    //     // const pesoProteinas = [0.23, 0.02, 0.026, 0.13];
    //     // const pesoGorduras = [0.05, 0.0, 0.01, 0.089];

    //     let pesoCarboidratos = [];
    //     let pesoProteinas = [];
    //     let pesoGorduras = [];
        
    //     for (var i = 0; i < tam.length; i++) {
    //         pesoCarboidratos.push(tamCarb[i].value);
    //         pesoProteinas.push(tamProt[i].value);
    //         pesoGorduras.push(tamGord[i].value);
            
    //     }
    //     const [carboidratos, proteinas, gorduras] = umPrato.alimentos.reduce((total, valor, index) => {
    //         total[0] += valor * pesoCarboidratos[index];
    //         total[1] += valor * pesoProteinas[index];
    //         total[2] += valor * pesoGorduras[index];
    //         return total;
    //     }, [0, 0, 0]).map(Number);
        
    //     // Agora, carboidratos, proteinas e gorduras são do tipo number
        

    //     const total = carboidratos + proteinas + gorduras;
    //     const porcaoCarboidratos = (carboidratos / total) * 100;
    //     const porcaoProteinas = (proteinas / total) * 100;
    //     const porcaoGorduras = (gorduras / total) * 100;

    //     const diffCarboidratos = Math.abs(porcaoCarboidratos - 55);
    //     const diffProteinas = Math.abs(porcaoProteinas - 30);
    //     const diffGorduras = Math.abs(porcaoGorduras - 15);

    //     const diffTotal = diffCarboidratos + diffProteinas + diffGorduras;
    //     console.log(diffTotal);

    //     // return diffTotal;
    // }

    fitness(umPrato) {
        // console.log(umPrato)
        // prato/refeição deve possuir 30% de proteína, 15% de gorduras e 55% de carboidratos
        let pesoCarboidratos = [];
        let pesoProteinas = [];
        let pesoGorduras = [];
        var carboidratos = 0;
        let proteinas = 0;
        let gorduras = 0;
            
            for (var i = 0; i < tam.length; i++) {
                pesoCarboidratos.push(tamCarb[i].value);
                pesoProteinas.push(tamProt[i].value);
                pesoGorduras.push(tamGord[i].value);
                
            }
        
        for (var i = 0; i < tam.length; i++) {

            carboidratos = carboidratos + umPrato.alimentos[i] * pesoCarboidratos[i]
            proteinas = proteinas + umPrato.alimentos[i] * pesoProteinas[i]
            gorduras = gorduras + umPrato.alimentos[i] * pesoGorduras[i]
        }
            
    
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
        // console.log(diffTotal);
        return diffTotal;
    }
    

    mutacao(parental, vetores3) {
        const pratoParental = this.pratos[parental];
        const [A, B, C] = vetores3;
        let tentativa = new Prato();

        for (let cont = 0; cont < 0; cont++) {
            const R = Math.random();
            const X = R < EvolucaoDiferencial.CR ? A.alimentos[cont] + (EvolucaoDiferencial.F * (B.alimentos[cont] - C.alimentos[cont])) : pratoParental.alimentos[cont];
            tentativa.add(X);
            // console.log(tentativa);
        }
        
        return tentativa;
    }

    melhorVetor() {
        const notas = this.pratos.map(prato => this.fitness(prato));
        return notas.indexOf(Math.min(...notas));
    }

    removeVetor(indice) {
        // console.log(indice)
        this.pratos.splice(indice, 1);
    }    

    addPrato(umPrato) {
        // console.log(umPrato);
        this.pratos.push(umPrato);
    }

    seleciona3(parental) {
        const p2 = this.pratos.filter((prato, i) => i !== parental);
        const vetores3 = Array.from({ length: 3 }, () => {
            const indice = Math.floor(Math.random() * p2.length);
            return p2.splice(indice, 1)[0];
        });
        return vetores3;
    }

    toString() {
        return `[${this.pratos.map(prato => prato.toString()).join(', ')}]`;
    }
}

EvolucaoDiferencial.CR = 0.3;
EvolucaoDiferencial.F = 0.8;

class Teste {
    static main() {
        const ed = new EvolucaoDiferencial(5);
        ed.populacao();
        for (let i = 0; i < 3000; i++) {
            for (let j = 0; j < 5; j++) {
                const tres = ed.seleciona3(j);
                // console.log(ed.seleciona3())
                
                const tentativa = ed.mutacao(j, tres);

                // console.log(tentativa);
                // console.log(ed.fitness(tentativa));
                // console.log(ed.pratos[j]);
                // if (!isNaN(tentativa)) {
                //     // Adiciona o valor ao prato de tentativa.
                //     console.log("teste");
                //   } else {
                //     // Se X for NaN, pular valor e seguir com outro loop.
                //   }
                // console.log(ed.fitness(tentativa));
                // console.log(ed.fitness(ed.pratos[j]));
                if (ed.fitness(tentativa) < ed.fitness(ed.pratos[j])) {
                    ed.removeVetor(j);
                    ed.addPrato(tentativa);
                }

            }
            const melhorIndice = ed.melhorVetor();
            const fitnessFormatado = ed.fitness(ed.pratos[melhorIndice]).toFixed(2);
            console.log(`Geração ${i + 1}:`);
            console.log(`Melhor Prato - ${ed.pratos[melhorIndice].toString()}`);
            console.log(`Fitness - ${fitnessFormatado}`);
        }
    }
}

Teste.main();
}