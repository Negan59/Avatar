package com.sgpd.model;

import java.util.ArrayList;

import com.sgpd.dao.DAOFMS;

public class FMS {
    private Paciente paciente;
    private int questao;
    private int nivel;
    private String descricao;
    public Paciente getPaciente() {
        return paciente;
    }
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    public int getQuestao() {
        return questao;
    }
    public void setQuestao(int questao) {
        this.questao = questao;
    }
    public int getNivel() {
        return nivel;
    }
    public void setNivel(int nivel) {
        this.nivel = nivel;
    }
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public FMS(Paciente paciente, int questao, int nivel, String descricao) {
        this.paciente = paciente;
        this.questao = questao;
        this.nivel = nivel;
        this.descricao = descricao;
    }
    public FMS() {
    }

    public boolean salvar(){
        DAOFMS dao = new DAOFMS();
        if(!dao.salvar(this)){
            return false;
        }
        else{
            return true;
        }
    }

    public boolean excluir(int id){
        DAOFMS dao = new DAOFMS();
        if(!dao.excluir(id)){
            return false;
        }
        else{
            return true;
        }
    }

    public ArrayList<FMS> buscar(int id){
        DAOFMS dao = new DAOFMS();
        return dao.buscar(id);
    }



}
