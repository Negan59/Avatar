package com.sgpd.model;

import java.time.LocalDateTime;
import java.util.List;

import com.sgpd.dao.DAOSessao;

public class Sessao {
    private int id;
    private String nome;
    private Paciente paciente;
    private LocalDateTime data;
    private LocalDateTime dataExecucao;
    private List<SessaoExercicio>lista;
    public List<SessaoExercicio> getLista() {
        return lista;
    }
    public void setLista(List<SessaoExercicio> lista) {
        this.lista = lista;
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
    public Paciente getPaciente() {
        return paciente;
    }
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    public LocalDateTime getData() {
        return data;
    }
    public void setData(LocalDateTime data) {
        this.data = data;
    }
    public LocalDateTime getDataExecucao() {
        return dataExecucao;
    }
    public void setDataExecucao(LocalDateTime dataExecucao) {
        this.dataExecucao = dataExecucao;
    }
    public Sessao() {
    }

    public Sessao buscar(int id){
        DAOSessao dao = new DAOSessao();
        return dao.buscarUm(id);
    }

    public Erro salvar(Sessao sessao){
        DAOSessao dao = new DAOSessao();
        if(dao.salvar(this)){
            return new Erro("Sucesso ao salvar a sessão", false, 200);
        }
        else{
            return new Erro("Erro ao salvar Sessao", true, 500);
        }
    }

    public Erro excluir(int id){
        DAOSessao dao = new DAOSessao();
        if(dao.excluir(id)){
            return new Erro("Sucesso ao excluir a sessão", false, 200);
        }
        else{
            return new Erro("Erro ao excluir Sessao", true, 500);
        }
    }

    public List<Sessao> buscarTodos(){
        DAOSessao dao = new DAOSessao();
        return dao.buscarTodos();
    }

    public int buscarUl(){
        DAOSessao dao = new DAOSessao();
        return dao.buscarUltimo();
    }


}
