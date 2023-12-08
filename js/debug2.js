var dados = [];
var colValor = 0;
let percCarboidratos = 0;
let percGorduras = 0;
let percProteinas = 0;

function downloadTxt() {
    // Cria um Blob com os dados e define o tipo MIME como texto/plain
    var blob = new Blob([dados], { type: "text/plain" });

    // Cria um objeto URL para o Blob
    var url = window.URL.createObjectURL(blob);

    // Cria um link de download
    var link = document.createElement("a");
    link.href = url;
    link.download = "dados.txt"; // Nome do arquivo que será baixado

    // Adiciona o link ao documento
    document.body.appendChild(link);

    // Simula um clique no link para iniciar o download
    link.click();

    // Remove o link do documento
    document.body.removeChild(link);
}

function adicionarLinha() {
    var tabela = document.getElementById('tabela');
    var novaLinha = tabela.insertRow(tabela.rows.length);

    var celula1 = novaLinha.insertCell(0);
    var celula2 = novaLinha.insertCell(1);
    var celula3 = novaLinha.insertCell(2);
    var celula4 = novaLinha.insertCell(3);
    var celulaAcoes = novaLinha.insertCell(4);

    celula1.innerHTML = '<input type="text" class="alimento campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula1.classList.add('celula');
    celula2.innerHTML = '<input type="text" class="proteina campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula2.classList.add('celula');
    celula3.innerHTML = '<input type="text" class="carboidrato campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula3.classList.add('celula');
    celula4.innerHTML = '<input type="text" class="gordura campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula4.classList.add('celula');

    // Adicionar botão "Remover" exceto para as três primeiras linhas
    if (tabela.rows.length > 3) {
        celulaAcoes.innerHTML = '<button onclick="removerLinha(this)" id="remover">Remover</button>';
    }

    celulaAcoes.classList.add('removerbtn');
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
    percCarboidratos = parseInt(document.getElementById('percCarboidratos').value);
    percGorduras = parseInt(document.getElementById('percGorduras').value);
    percProteinas = parseInt(document.getElementById('percProteinas').value);

    if (isNaN(percCarboidratos) || isNaN(percGorduras) || isNaN(percProteinas)) {
        alert("Preencha a Porcentagem!");
        return;
    } else if ((percCarboidratos + percGorduras + percProteinas) < 100) {
        alert("Menos de 100%");
        return;
    } else if ((percCarboidratos + percGorduras + percProteinas) > 100) {
        alert("Mais de 100%");
        return;
    }

    var tam = document.getElementsByClassName('alimento');
    var tamCarb = document.getElementsByClassName('carboidrato');
    var tamProt = document.getElementsByClassName('proteina');
    var tamGord = document.getElementsByClassName('gordura');

    for (var i = 0; i < tam.length; i++) {
        tamCarb[i].value = tamCarb[i].value.replace(",", ".");
        tamProt[i].value = tamProt[i].value.replace(",", ".");
        tamGord[i].value = tamGord[i].value.replace(",", ".");
        if (tamCarb[i].value == "" || tamProt[i].value == "" || tamGord[i].value == "") {
            alert("Preencha todos os campos!")
            return;
        }
    }



    // for (var i = 0; i < tam.length; i++) {
    //     console.log('Repetição ' + (i + 1) + ': Valor do input - ' + tam[i].value);
    // }

    document.getElementById("corpo").classList.toggle("hidden");
    document.getElementById("balanceamento").classList.toggle("hidden");



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


        fitness(umPrato) {
            // prato/refeição deve possuir 30% de proteína, 15% de gorduras e 55% de carboidratos
            let pesoCarboidratos = [];
            let pesoProteinas = [];
            let pesoGorduras = [];
            var carboidratos = 0;
            let proteinas = 0;
            let gorduras = 0;

            for (var i = 0; i < tam.length; i++) {
                tamCarb[i].value = tamCarb[i].value.replace(",", ".");
                if (tamCarb[i].value == "") {
                    console.log("teste")
                    return;
                }
                tamProt[i].value = tamProt[i].value.replace(",", ".");
                tamGord[i].value = tamGord[i].value.replace(",", ".");
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



            diffCarboidratos = Math.abs(porcaoCarboidratos - percCarboidratos);
            diffProteinas = Math.abs(porcaoProteinas - percProteinas);
            diffGorduras = Math.abs(porcaoGorduras - percGorduras);

            diffTotal = diffCarboidratos + diffProteinas + diffGorduras;
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
            for (let i = 0; i < 500; i++) {
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
                // console.log(`Geração ${i + 1}:`);
                // console.log(`Melhor Prato - ${ed.pratos[melhorIndice].toString()}`);
                // console.log(`Fitness - ${fitnessFormatado}`);
                dados.push(`Geração ${i + 1}:`);
                dados.push('\n');
                dados.push(`Melhor Prato - ${ed.pratos[melhorIndice].toString()}`);
                dados.push('\n');
                dados.push(`Fitness - ${fitnessFormatado}`);
                dados.push('\n\n');

                colValor = ed.pratos[melhorIndice].toString()
            }
        }
    }

    Teste.main();
}

function coluna() {

    colValor = colValor.replace("[", "");
    colValor = colValor.replace("]", "");
    colValor = colValor.split(", ")

    var tam = document.getElementsByClassName('alimento');
    var tabela = document.getElementById('tabela2');

    for (let cont = 0; cont < tam.length; cont++) {
        var celula1 = tabela.rows[0].insertCell(tabela.rows[0].cells.length);
        var celula2 = tabela.rows[1].insertCell(tabela.rows[1].cells.length);
        celula1.innerHTML = '<th id="vetorResultado">' + tam[cont].value + '</th>';
        celula2.innerHTML = '<td>' + colValor[cont] + '</td>';
    }

}

function recarregarPagina() {
    location.reload();
}

function porcentagem() {

}