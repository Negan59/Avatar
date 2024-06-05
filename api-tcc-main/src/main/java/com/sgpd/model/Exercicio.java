package com.sgpd.model;

import com.sgpd.dao.DAOExercicio;

public class Exercicio {
    private long id;
    private String nome;
    private String tipo;
    private String grau;
    private String arquivo;
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public String getGrau() {
        return grau;
    }
    public void setGrau(String grau) {
        this.grau = grau;
    }
    public String getArquivo() {
        return arquivo;
    }
    public void setArquivo(String arquivo) {
        this.arquivo = arquivo;
    }
    public Exercicio() {
    }

    public Erro salvar(){
        DAOExercicio dao = new DAOExercicio();
        if(dao.salvar(this)){
            return new Erro("sucesso", false, 200);
        }
        else{
            return new Erro("erro", true, 500);
        }
    }
}
