package com.sgpd.model;

import com.sgpd.dao.DAOSessaoExercicio;

public class SessaoExercicio {
    private Sessao sessao;
    private Exercicio exercicio;
    private int ordem;
    private double velocidade;
    private int duracao;
    private int intervalo;
    public Sessao getSessao() {
        return sessao;
    }
    public void setSessao(Sessao sessao) {
        this.sessao = sessao;
    }
    public Exercicio getExercicio() {
        return exercicio;
    }
    public void setExercicio(Exercicio exercicio) {
        this.exercicio = exercicio;
    }
    public int getOrdem() {
        return ordem;
    }
    public void setOrdem(int ordem) {
        this.ordem = ordem;
    }
    public double getVelocidade() {
        return velocidade;
    }
    public void setVelocidade(double velocidade) {
        this.velocidade = velocidade;
    }
    public int getDuracao() {
        return duracao;
    }
    public void setDuracao(int duracao) {
        this.duracao = duracao;
    }
    public int getIntervalo() {
        return intervalo;
    }
    public void setIntervalo(int intervalo) {
        this.intervalo = intervalo;
    }
    public SessaoExercicio() {
    } 

    public Erro salvar(){
        DAOSessaoExercicio dao = new DAOSessaoExercicio();
        if(dao.salvar(this)){
            return new Erro("Sucesso ao salvar exercicio da sessão", false, 200);
        }
        else{
            return new Erro("Erro ao salvar exercício da sessão", true, 500);
        }
    }

    public Erro excluir(int id){
        DAOSessaoExercicio dao = new DAOSessaoExercicio();
        if(dao.excluir(id)){
            return new Erro("Sucesso ao excluir exercicio da sessão", false, 200);
        }
        else{
            return new Erro("Erro ao excluir exercício da sessão", true, 500);
        }
    }
}
