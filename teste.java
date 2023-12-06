import java.util.Vector;

class Prato {
    private Vector alimentos;

    public Prato() {
        alimentos = new Vector(5);
        for (int i = 0; i < 5; i++)
            alimentos.add(i, java.lang.Math.random() * 200);
    }

    public Prato(int tamanho) {
        alimentos = new Vector(tamanho);
    }

    public void add(double valor) {
        getAlimentos().add(valor);
    }

    public String toString() {
        String prato = "[";
        for (int i = 0; i < 5; i++) {
            prato += ((Double) getAlimentos().get(i)).toString();
            if (i < 4)
                prato += ", ";
        }
        prato += "]";
        return prato;
    }

    /**
     * @return the alimentos
     */
    public Vector getAlimentos() {
        return alimentos;
    }

    /**
     * @param alimentos the alimentos to set
     */
    public void setAlimentos(Vector alimentos) {
        this.alimentos = alimentos;
    }
}

class EvolucaoDiferencial {
    private Vector pratos;
    private int tamanho;
    private static double CR = 0.3;
    private static double F = 0.8;

    public EvolucaoDiferencial(int tamanho) {
        this.tamanho = tamanho;
        pratos = new Vector(this.getTamanho());
    }

    public Vector populacao() {
        for (int i = 0; i < this.getTamanho(); i++) {
            getPratos().add(new Prato());
        }
        return getPratos();
    }

    public double fitness(Prato umPrato) {
        // prato/refeição deve possuir 30% de proteína, 15% de gorduras e 55% de carboidratos
        double carboidratos = ((Double) umPrato.getAlimentos().get(0)) * 0.05
                + ((Double) umPrato.getAlimentos().get(1)) * 0.24
                + ((Double) umPrato.getAlimentos().get(2)) * 0.26
                + ((Double) umPrato.getAlimentos().get(3)) * 0.15
                + ((Double) umPrato.getAlimentos().get(4)) * 0.29;

        double proteinas = ((Double) umPrato.getAlimentos().get(0)) * 0.23
                + ((Double) umPrato.getAlimentos().get(1)) * 0.02
                + ((Double) umPrato.getAlimentos().get(2)) * 0.026
                + ((Double) umPrato.getAlimentos().get(3)) * 0.13
                + ((Double) umPrato.getAlimentos().get(4)) * 0.095;

        double gorduras = ((Double) umPrato.getAlimentos().get(0)) * 0.05
                + ((Double) umPrato.getAlimentos().get(1)) * 0.00
                + ((Double) umPrato.getAlimentos().get(2)) * 0.01
                + ((Double) umPrato.getAlimentos().get(3)) * 0.089
                + ((Double) umPrato.getAlimentos().get(4)) * 0.014;

        double total, porcaoCarboidratos, porcaoProteinas, porcaoGorduras;
        double diffTotal, diffCarboidratos, diffProteinas, diffGorduras;

        total = carboidratos + proteinas + gorduras;
        porcaoCarboidratos = (carboidratos / total) * 100;
        porcaoProteinas = (proteinas / total) * 100;
        porcaoGorduras = (gorduras / total) * 100;

        diffCarboidratos = java.lang.Math.abs(porcaoCarboidratos - 55);
        diffProteinas = java.lang.Math.abs(porcaoProteinas - 30);
        diffGorduras = java.lang.Math.abs(porcaoGorduras - 15);

        diffTotal = diffCarboidratos + diffProteinas + diffGorduras;
        return diffTotal;
    }

    public Prato mutacao(int parental, Vector vetores3) {
        int cont = 0;
        Prato A, B, C;
        double X;
        Prato pratoParental = (Prato) getPratos().get(parental);
        Prato tentativa = new Prato(5);

        A = (Prato) vetores3.get(0);
        B = (Prato) vetores3.get(1);
        C = (Prato) vetores3.get(2);

        while (cont < pratoParental.getAlimentos().size()) {
            double R = java.lang.Math.random();
            if (R < getCR()) {
                X = (Double) A.getAlimentos().get(cont) + getF() * ((Double) B.getAlimentos().get(cont)
                        - (Double) C.getAlimentos().get(cont));
            } else {
                X = (Double) pratoParental.getAlimentos().get(cont);
            }
            tentativa.add(X);
            cont++;
        }
        return tentativa;
    }

    public int melhorVetor() {
        Vector notas = new Vector();
        int melhor = 0;
        for (int i = 0; i < this.getTamanho(); i++) {
            notas.add(fitness((Prato) getPratos().get(i)));
        }
        for (int i = 0; i < notas.size(); i++) {
            if ((Double) notas.get(melhor) > (Double) notas.get(i))
                melhor = i;
        }
        return melhor;
    }

    public void removeVetor(int indice) {
        getPratos().remove(indice);
    }

    public void addPrato(Prato umPrato) {
        getPratos().add(umPrato);
    }

    public Vector seleciona3(int parental) {
        Vector p2 = new Vector();
        Vector vetores3 = new Vector(3);
        for (int i = 0; i < this.getTamanho(); i++) {
            if (parental != i)
                p2.add((Prato) getPratos().get(i));
        }
        for (int i = 0; i < 3; i++) {
            int indice = (int) (java.lang.Math.random() * (p2.size() - i));
            vetores3.add((Prato) p2.get(indice));
            p2.remove(indice);
        }
        return vetores3;
    }

    public String toString() {
        String populacao = "[";
        for (int i = 0; i < this.getTamanho(); i++)
            populacao += getPratos().get(i);
        populacao += "]";
        return populacao;
    }

    /**
     * @return the pratos
     */
    public Vector getPratos() {
        return pratos;
    }

    /**
     * @param pratos the pratos to set
     */
    public void setPratos(Vector pratos) {
        this.pratos = pratos;
    }

    /**
     * @return the tamanho
     */
    public int getTamanho() {
        return tamanho;
    }

    /**
     * @param tamanho the tamanho to set
     */
    public void setTamanho(int tamanho) {
        this.tamanho = tamanho;
    }

    /**
     * @return the CR
     */
    public static double getCR() {
        return CR;
    }

    /**
     * @param aCR the CR to set
     */
    public static void setCR(double aCR) {
        CR = aCR;
    }

    /**
     * @return the F
     */
    public static double getF() {
        return F;
    }

    /**
     * @param aF the F to set
     */
    public static void setF(double aF) {
        F = aF;
    }
}

public class Teste {
    public static void main(String[] args) {
        double F = 0.8; // peso diferencial (entre 0 e 2)
        double CR = 0.3; // taxa mutação (entre 0 e 1)
        Vector tres;
        Prato tentativa;
        EvolucaoDiferencial ed = new EvolucaoDiferencial(5);
        ed.populacao();
        for (int i = 0; i < 1000; i++) {
            for (int j = 0; j < 5; j++) {
                tres = ed.seleciona3(j);
                tentativa = ed.mutacao(j, tres);
                if (ed.fitness(tentativa) < ed.fitness((Prato) ed.getPratos().get(j))) {
                    ed.removeVetor(j);
                    ed.addPrato(tentativa);
                }
            }
            System.out.println(ed.melhorVetor() + " - " + (Prato) ed.getPratos().get(ed.melhorVetor()));
            System.out.println("Fitness: " + ed.fitness((Prato) ed.getPratos().get(ed.melhorVetor())));
        }
    }
}
