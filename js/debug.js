class Prato {
    constructor(tamanho = 5) {
        this.alimentos = new Array(tamanho).fill(0).map(() => Math.random() * 100);
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
        this.pratos = new Array(tamanho);
    }

    populacao() {
        this.pratos = Array.from({ length: this.tamanho }, () => new Prato());
        return this.pratos;
    }

    fitness(umPrato) {
        const pesoCarboidratos = [0.05, 0.24, 0.26, 0.15, 0.29];
        const pesoProteinas = [0.23, 0.02, 0.026, 0.13, 0.095];
        const pesoGorduras = [0.05, 0.0, 0.01, 0.089, 0.014];

        const carboidratos = umPrato.alimentos.reduce((total, valor, index) => total + valor * pesoCarboidratos[index], 0);
        const proteinas = umPrato.alimentos.reduce((total, valor, index) => total + valor * pesoProteinas[index], 0);
        const gorduras = umPrato.alimentos.reduce((total, valor, index) => total + valor * pesoGorduras[index], 0);

        const total = carboidratos + proteinas + gorduras;
        const porcaoCarboidratos = (carboidratos / total) * 100;
        const porcaoProteinas = (proteinas / total) * 100;
        const porcaoGorduras = (gorduras / total) * 100;

        const diffCarboidratos = Math.abs(porcaoCarboidratos - 55);
        const diffProteinas = Math.abs(porcaoProteinas - 30);
        const diffGorduras = Math.abs(porcaoGorduras - 15);

        const diffTotal = diffCarboidratos + diffProteinas + diffGorduras;
        return diffTotal;
    }

    mutacao(parental, vetores3) {
        let cont = 0;
        let X;
        const pratoParental = this.pratos[parental];
        const [A, B, C] = vetores3;
        const tentativa = new Prato();

        while (cont < pratoParental.alimentos.length) {
            const R = Math.random();
            if (R < EvolucaoDiferencial.CR) {
                X = A.alimentos[cont] + EvolucaoDiferencial.F * (B.alimentos[cont] - C.alimentos[cont]);
            } else {
                X = pratoParental.alimentos[cont];
            }
            tentativa.add(X);
            cont++;
        }
        return tentativa;
    }

    melhorVetor() {
        const notas = this.pratos.map(prato => this.fitness(prato));
        let melhor = 0;
        for (let i = 0; i < notas.length; i++) {
            if (notas[melhor] > notas[i]) {
                melhor = i;
            }
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
        const p2 = this.pratos.filter((prato, i) => i !== parental);
        const vetores3 = Array.from({ length: 3 }, () => {
            const indice = Math.floor(Math.random() * (p2.length));
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
        for (let i = 0; i < 1000; i++) {
            for (let j = 0; j < 5; j++) {
                const tres = ed.seleciona3(j);
                const tentativa = ed.mutacao(j, tres);
                if (ed.fitness(tentativa) < ed.fitness(ed.pratos[j])) {
                    ed.removeVetor(j);
                    ed.addPrato(tentativa);
                }
            }
            console.log(`${ed.melhorVetor()} - ${ed.pratos[ed.melhorVetor()].toString()}`);
            console.log(`Fitness: ${ed.fitness(ed.pratos[ed.melhorVetor()])}`);
        }
    }
}

Teste.main();