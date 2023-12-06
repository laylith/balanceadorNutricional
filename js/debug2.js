class Prato {
    constructor(tamanho = 5) {
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
        return this.pratos;
    }

    fitness(umPrato) {
        const pesoCarboidratos = [0.05, 0.24, 0.26, 0.15, 0.29];
        const pesoProteinas = [0.23, 0.02, 0.026, 0.13, 0.095];
        const pesoGorduras = [0.05, 0.0, 0.01, 0.089, 0.014];

        const [carboidratos, proteinas, gorduras] = umPrato.alimentos.reduce((total, valor, index) => {
            total[0] += valor * pesoCarboidratos[index];
            total[1] += valor * pesoProteinas[index];
            total[2] += valor * pesoGorduras[index];
            return total;
        }, [0, 0, 0]);

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
        const pratoParental = this.pratos[parental];
        const [A, B, C] = vetores3;
        const tentativa = new Prato();

        for (let cont = 0; cont < pratoParental.alimentos.length; cont++) {
            const R = Math.random();
            const X = R < EvolucaoDiferencial.CR ? A.alimentos[cont] + EvolucaoDiferencial.F * (B.alimentos[cont] - C.alimentos[cont]) : pratoParental.alimentos[cont];
            tentativa.add(X);
        }

        return tentativa;
    }

    melhorVetor() {
        const notas = this.pratos.map(prato => this.fitness(prato));
        return notas.indexOf(Math.min(...notas));
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
        for (let i = 0; i < 1000; i++) {
            for (let j = 0; j < 5; j++) {
                const tres = ed.seleciona3(j);
                const tentativa = ed.mutacao(j, tres);
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