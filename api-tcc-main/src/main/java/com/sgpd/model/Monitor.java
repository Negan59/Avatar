package com.sgpd.model;

import java.util.ArrayList;

import com.sgpd.dao.DAOMonitor;

public class Monitor  {
    private int id;
    private String nome;
    private String email;
    private String ra;
    private String cpf;
    private String senha;
    private int nivel;
    public int getNivel() {
        return nivel;
    }
    public void setNivel(int nivel) {
        this.nivel = nivel;
    }
    public Monitor(String nome, String email, String ra, String cpf, String senha, int nivel) {
        this.nome = nome;
        this.email = email;
        this.ra = ra;
        this.cpf = cpf;
        this.senha = senha;
        this.nivel = nivel;
    }
    public Monitor(int id, String nome, String email, String ra, String cpf, String senha, int nivel) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.ra = ra;
        this.cpf = cpf;
        this.senha = senha;
        this.nivel = nivel;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRa() {
        return ra;
    }
    public void setRa(String ra) {
        this.ra = ra;
    }
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
   
    public Monitor() {
    }

    public boolean salvar() {
        DAOMonitor dao = new DAOMonitor();
        if (dao.salvar(this)) {
            return true;
        }
        return false;
    }

    public boolean alterar() {
        DAOMonitor dao = new DAOMonitor();
        if (dao.atualizar(this)) {
            return true;
        }
        return false;
    }

    public ArrayList<Monitor> buscarTodos() {
        DAOMonitor dao = new DAOMonitor();
        return dao.buscarTodos();
    }

    public ArrayList<Monitor> buscarNome(String nome) {
        DAOMonitor dao = new DAOMonitor();
        return dao.buscarPorNome(nome);
    }

    public boolean apagar(int id) {
        DAOMonitor dao = new DAOMonitor();
        return dao.excluir(id);
    }

    public Monitor buscarUm(int id) {
        DAOMonitor dao = new DAOMonitor();
        return dao.buscarPorId(id);
    }
}
