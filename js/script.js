//Criação de variáveis globais.
var dados = [];
var colValor = 0;
var colFitness = 0;
var percCarboidratos = 0;
var percGorduras = 0;
var percProteinas = 0;
var numRepet = 0;

// Função para baixar histórico de cálculo de Evolução diferencial completo.
function downloadTxt() {
    // Cria um Blob com os dados e define o tipo como texto/plain.
    var blob = new Blob([dados], { type: "text/plain" });

    // Cria um objeto URL para o Blob.a
    var url = window.URL.createObjectURL(blob);

    // Cria um link de download.
    var link = document.createElement("a");
    link.href = url;
    // Nome do arquivo que será baixado.
    link.download = "dados.txt";

    // Adiciona o link ao documento.
    document.body.appendChild(link);

    // Simula um clique no link para iniciar o download.
    link.click();

    // Remove o link do documento.
    document.body.removeChild(link);
}

function adicionarLinha() {
    // Localiza tabela no HTML e insere uma linha.
    var tabela = document.getElementById('tabela');
    var novaLinha = tabela.insertRow(tabela.rows.length);

    // Adiciona celulas/colunas novas.
    var celula1 = novaLinha.insertCell(0);
    var celula2 = novaLinha.insertCell(1);
    var celula3 = novaLinha.insertCell(2);
    var celula4 = novaLinha.insertCell(3);
    var celulaAcoes = novaLinha.insertCell(4);

    // Formata informações da célula como placeholder.
    celula1.innerHTML = '<input type="text" class="alimento campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula1.classList.add('celula');
    celula2.innerHTML = '<input type="text" class="proteina campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula2.classList.add('celula');
    celula3.innerHTML = '<input type="text" class="carboidrato campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula3.classList.add('celula');
    celula4.innerHTML = '<input type="text" class="gordura campo" name="" id="" placeholder="gramas..." maxlength="10">';
    celula4.classList.add('celula');

    // Adiciona botão 'Remover', exceto para as três primeiras linhas.
    if (tabela.rows.length > 3) {
        celulaAcoes.innerHTML = '<button onclick="removerLinha(this)" id="remover">Remover</button>';
    }
    // Adiciona uma classe com nome de 'removerbtn'.
    celulaAcoes.classList.add('removerbtn');
}

function removerLinha(botaoRemover) {
    // Localiza tabela no HTML.
    var tabela = document.getElementById('tabela');
    // Acessa o elemento HTML onde está inserido o botão remover e acessa o nó pai do elemento a fim de localizar seu índice.
    var rowIndex = botaoRemover.parentNode.parentNode.rowIndex;

    // Garante que haja no mínimo três linhas antes de remover.
    if (tabela.rows.length > 3) {
        tabela.deleteRow(rowIndex);
    }
}

function processa() {
    // Obtém os valores de porcentagem dos nutrientes inseridos pelo usuário.
    percCarboidratos = parseInt(document.getElementById('percCarboidratos').value);
    percGorduras = parseInt(document.getElementById('percGorduras').value);
    percProteinas = parseInt(document.getElementById('percProteinas').value);
    numRepet = document.getElementById('numRepet').value;

    // Realiza verificações dos campos de inserção de porcentagem dos nutrientes, como se algum algum dos valores é do tipo NaN, se o campo não foi preenchido, se a soma ultrapassa ou não atinge 100%.
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

    // Atribui variáveis a campos inseridos no HTML através da classe.
    var tam = document.getElementsByClassName('alimento');
    var tamCarb = document.getElementsByClassName('carboidrato');
    var tamProt = document.getElementsByClassName('proteina');
    var tamGord = document.getElementsByClassName('gordura');

    // Valida se tofos os campos de inserção na tabela de alimentos e quantidade de iterações foram preenchidos.
    for (var i = 0; i < tam.length; i++) {
        tamCarb[i].value = tamCarb[i].value.replace(",", ".");
        tamProt[i].value = tamProt[i].value.replace(",", ".");
        tamGord[i].value = tamGord[i].value.replace(",", ".");
        if (tamCarb[i].value == "" || tamProt[i].value == "" || tamGord[i].value == "") {
            alert("Preencha ao menos todos os campos de 5 alimentos!")
            return;
        } else if (numRepet == "") {
            alert("Preencha o número de repetições!");
            return;
        }
    }

    // Altera a visibilidade das divs para simular um avanço de tela.
    document.getElementById("corpo").classList.toggle("hidden");
    document.getElementById("balanceamento").classList.toggle("hidden");

    class Prato {
        // Construtor recebe o tamanho do vetor de alimentos.
        constructor(tamanho = tam.length) {
            // Preenche o veotr com valores aleatórios de 0 a 100.
            this.alimentos = Array.from({ length: tamanho }, () => Math.random() * 100);
        }

        // Recebe parâmetro valor e adiciona ao vetor alimentos.
        add(valor) {
            this.alimentos.push(valor);
        }

        // Formata o vetor e aredonda os valores decimais para duas casas depois da vírgula.
        toString() {
            return `[${this.alimentos.map(alimento => alimento.toFixed(2)).join(', ')}]`;
        }
    }

    class EvolucaoDiferencial {
        // Construtor recebe um parâmetro para armazenar tamanho da população e cria um array de objetos Prato.
        constructor(tamanho) {
            this.tamanho = tamanho;
            this.pratos = Array.from({ length: tamanho }, () => new Prato());
        }

        // Reinicializa a população com um novo array de alimentos preenchido aleatoriamente.
        populacao() {
            this.pratos = Array.from({ length: this.tamanho }, () => new Prato());
            this.pratos.forEach(prato => prato.alimentos = new Array(prato.alimentos.length).fill(0).map(() => Math.random() * 100));
            return this.pratos;
        }

        fitness(umPrato) {
            // Declara vairáveis de cada um dos nutrientes e seus respectivos pesos.
            let pesoCarboidratos = [];
            let pesoProteinas = [];
            let pesoGorduras = [];
            let carboidratos = 0;
            let proteinas = 0;
            let gorduras = 0;

            // Roda um loop de para substituir sinais de vírgula nos decimais por ponto.
            for (var i = 0; i < tam.length; i++) {
                tamCarb[i].value = tamCarb[i].value.replace(",", ".");
                tamProt[i].value = tamProt[i].value.replace(",", ".");
                tamGord[i].value = tamGord[i].value.replace(",", ".");
                pesoCarboidratos.push(tamCarb[i].value);
                pesoProteinas.push(tamProt[i].value);
                pesoGorduras.push(tamGord[i].value);

            }

            // Loop para multiplicar a quantidade de alimento no prato pelo peso de cada nutriente em questão.
            for (var i = 0; i < tam.length; i++) {
                carboidratos = carboidratos + umPrato.alimentos[i] * pesoCarboidratos[i]
                proteinas = proteinas + umPrato.alimentos[i] * pesoProteinas[i]
                gorduras = gorduras + umPrato.alimentos[i] * pesoGorduras[i]
            }

            // Calcula as porções de cada nutriente dividindo o mesmo pelo total de macronutrientes do prato, trnasformando em porcentagem.
            let total, porcaoCarboidratos, porcaoProteinas, porcaoGorduras;
            let diffTotal, diffCarboidratos, diffProteinas, diffGorduras;

            total = carboidratos + proteinas + gorduras;
            porcaoCarboidratos = (carboidratos / total) * 100;
            porcaoProteinas = (proteinas / total) * 100;
            porcaoGorduras = (gorduras / total) * 100;

            // Compara a diferença entre as porções obtidas e o percentual ideal de nutrientes infomado pelo usuário.
            diffCarboidratos = Math.abs(porcaoCarboidratos - percCarboidratos);
            diffProteinas = Math.abs(porcaoProteinas - percProteinas);
            diffGorduras = Math.abs(porcaoGorduras - percGorduras);

            // Veirifica a diferença total entre os valores obtidos e o ideal.
            diffTotal = diffCarboidratos + diffProteinas + diffGorduras;
            return diffTotal;
        }

        // Recebe um prato parental e um vetor com 3 pratos selecionados aleatoriamente para mutação.
        mutacao(parental, vetores3) {
            const pratoParental = this.pratos[parental];
            const [A, B, C] = vetores3;
            let tentativa = new Prato();

            /*O loop roda um valor de roleta aleatório, que é então comparado com o valor de crossover definido.
            Caso o valor seja menor que o crossover, a seguinte conta será executada fórmula: Ai + F * (Bi - Ci).
            Se o valor calculado foi melhor que o parental, este será subtituido*/
            for (let cont = 0; cont < 0; cont++) {
                const R = Math.random();
                const X = R < EvolucaoDiferencial.CR ? A.alimentos[cont] + (EvolucaoDiferencial.F * (B.alimentos[cont] - C.alimentos[cont])) : pratoParental.alimentos[cont];
                tentativa.add(X);
            }
            return tentativa;
        }

        // Percorre cada elemento do vetor e calcula sua adaptidão(fitness), armazenando estas 'notas' de classificação da população em um novo array.
        melhorVetor() {
            const notas = this.pratos.map(prato => this.fitness(prato));
            return notas.indexOf(Math.min(...notas));
        }

        // Remove o elemento do vetor indicado no índice.
        removeVetor(indice) {
            this.pratos.splice(indice, 1);
        }

        // Adiciona um elemento ao final do array.
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

        //Seleciona 3 elementos com indice diferente do 'parental'
        seleciona3(parental) {
            const p2 = this.pratos.filter((prato, i) => i !== parental);
            const vetores3 = Array.from({ length: 3 }, () => {
                const indice = Math.floor(Math.random() * p2.length);
                return p2.splice(indice, 1)[0];
            });

            return vetores3;
        }

        //Mapeia cada elemento para uma representação em String
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
            for (let i = 0; i < numRepet; i++) {
                for (let j = 0; j < 5; j++) {
                    const tres = ed.seleciona3(j);
                    const tentativa = ed.mutacao(j, tres);

                    //Analisa se o fitness encontrado é melhor que o anterior, caso não for mantem o resultado anterior
                    if (ed.fitness(tentativa) < ed.fitness(ed.pratos[j])) {
                        ed.removeVetor(j);
                        ed.addPrato(tentativa);
                    }
                }

                //Adicionar os dados de cada execução em um vetor para ser gerado um arquivo de download caso desejado
                const melhorIndice = ed.melhorVetor();
                const fitnessFormatado = ed.fitness(ed.pratos[melhorIndice]).toFixed(2);
                dados.push(`Geração ${i + 1}:`);
                dados.push('\n');
                dados.push(`Melhor Prato - ${ed.pratos[melhorIndice].toString()}`);
                dados.push('\n');
                dados.push(`Fitness - ${fitnessFormatado}`);
                dados.push('\n\n');

                colValor = ed.pratos[melhorIndice].toString()
                colFitness = fitnessFormatado;
            }
        }
    }

    Teste.main();
}
//Função que adiciona colunas de acordo com a quantia de alimentos inseridas para mostrar o resultado
function coluna() {

    colValor = colValor.replace("[", "");
    colValor = colValor.replace("]", "");
    colValor = colValor.split(", ")

    let tam = document.getElementsByClassName('alimento');
    let tabela = document.getElementById('tabela2');
    let fitness = document.getElementById('fitness');

    //Cria colunas para cada alimento informado, imprimindo o melhor resultado na tela
    for (let cont = 0; cont < tam.length; cont++) {
        let celula1 = tabela.rows[0].insertCell(tabela.rows[0].cells.length);
        let celula2 = tabela.rows[1].insertCell(tabela.rows[1].cells.length);
        celula1.innerHTML = '<td>' + tam[cont].value + '</td>';
        celula1.id = "vetorNomes";
        celula2.innerHTML = '<td>' + colValor[cont] + '</td>';
        celula2.id = "vetorResultados";
    }
    //imprime o valor do melhor Fitiness
    fitness.innerHTML = 'Melhor Fitness: ' + colFitness;

}

//Recarrega a pagina para limpar os valores caso desejavel um novo balancemento
function recarregarPagina() {
    location.reload();
}