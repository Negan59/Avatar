package com.sgpd.model;

import java.time.LocalDateTime;
import java.util.List;

import com.sgpd.dao.DAOResultado;

public class Resultado {
    private int id;
    private Sessao sessao;
    private LocalDateTime data;
    private double porcentagem;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public Sessao getSessao() {
        return sessao;
    }
    public void setSessao(Sessao sessao) {
        this.sessao = sessao;
    }
    public LocalDateTime getData() {
        return data;
    }
    public void setData(LocalDateTime data) {
        this.data = data;
    }
    public double getPorcentagem() {
        return porcentagem;
    }
    public void setPorcentagem(double porcentagem) {
        this.porcentagem = porcentagem;
    }
    public Resultado() {
    }
    public Erro salvar(){
        DAOResultado dao = new DAOResultado();
        if(dao.salvar(this)){
            return new Erro("Sucesso ao salvar", false, 200);
        }
        else{
            return new Erro("Erro ao salvar", true, 400);
        }
    }

    public List<Resultado>buscar(int paciente ){
        DAOResultado dao = new DAOResultado();
        return dao.buscar(paciente);
    }
}
