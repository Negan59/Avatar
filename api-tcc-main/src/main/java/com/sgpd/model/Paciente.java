package com.sgpd.model;

import java.time.LocalDate;
import java.util.ArrayList;

import com.sgpd.dao.DAOPaciente;

public class Paciente {
    private int id;
    private String nome;
    private int idade;
    private LocalDate datanascimento;
    private String telefone;
    private String sexo;
    private String cordapele;
    private String estadocivil;
    private String responsavel;
    private String profissaoresponsavel;
    private double altura;
    private double peso;
    private String foto;
    //private GMFCS gmfcs;
    //private MACS macs;  //serão implementados em breve
    //private FMS fms;

    public Paciente(String nome, int idade, LocalDate datanascimento, String telefone, String sexo, String cordapele,
            String estadocivil, String responsavel, String profissaoresponsavel, double altura, double peso,
            String foto) {
        this.nome = nome;
        this.idade = idade;
        this.datanascimento = datanascimento;
        this.telefone = telefone;
        this.sexo = sexo;
        this.cordapele = cordapele;
        this.estadocivil = estadocivil;
        this.responsavel = responsavel;
        this.profissaoresponsavel = profissaoresponsavel;
        this.altura = altura;
        this.peso = peso;
        this.foto = foto;
    }

    public Paciente(int id, String nome, int idade, LocalDate datanascimento, String telefone, String sexo,
            String cordapele, String estadocivil, String responsavel, String profissaoresponsavel, double altura,
            double peso, String foto) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.datanascimento = datanascimento;
        this.telefone = telefone;
        this.sexo = sexo;
        this.cordapele = cordapele;
        this.estadocivil = estadocivil;
        this.responsavel = responsavel;
        this.profissaoresponsavel = profissaoresponsavel;
        this.altura = altura;
        this.peso = peso;
        this.foto = foto;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
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
    public int getIdade() {
        return idade;
    }
    public void setIdade(int idade) {
        this.idade = idade;
    }
    public LocalDate getDatanascimento() {
        return datanascimento;
    }
    public void setDatanascimento(LocalDate datanascimento) {
        this.datanascimento = datanascimento;
    }
    public String getTelefone() {
        return telefone;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    public String getSexo() {
        return sexo;
    }
    public void setSexo(String sexo) {
        this.sexo = sexo;
    }
    public String getCordapele() {
        return cordapele;
    }
    public void setCordapele(String cordapele) {
        this.cordapele = cordapele;
    }
    public String getEstadocivil() {
        return estadocivil;
    }
    public void setEstadocivil(String estadocivil) {
        this.estadocivil = estadocivil;
    }
    public String getResponsavel() {
        return responsavel;
    }
    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }
    public String getProfissaoresponsavel() {
        return profissaoresponsavel;
    }
    public void setProfissaoresponsavel(String profissaoresponsavel) {
        this.profissaoresponsavel = profissaoresponsavel;
    }
    public double getAltura() {
        return altura;
    }
    public void setAltura(double altura) {
        this.altura = altura;
    }
    public double getPeso() {
        return peso;
    }
    public void setPeso(double peso) {
        this.peso = peso;
    }
    public Paciente() {
    }
    
    public boolean salvar() {
        DAOPaciente dao = new DAOPaciente();
        if (dao.salvar(this)) {
            return true;
        }
        return false;
    }

    public boolean alterar() {
        DAOPaciente dao = new DAOPaciente();
        if (dao.atualizar(this)) {
            return true;
        }
        return false;
    }

    public ArrayList<Paciente> buscarTodos() {
        DAOPaciente dao = new DAOPaciente();
        return dao.buscarTodos();
    }

    public ArrayList<Paciente> buscarTodos(int inicio, int fim) {
        DAOPaciente dao = new DAOPaciente();
        return dao.buscarTodosLimite(inicio,fim);
    }

    public ArrayList<Paciente> buscarNome(String nome) {
        DAOPaciente dao = new DAOPaciente();
        return dao.buscarPorNome(nome);
    }

    public boolean apagar(int id) {
        DAOPaciente dao = new DAOPaciente();
        return dao.excluir(id);
    }

    public Paciente buscarUm(int id) {
        DAOPaciente dao = new DAOPaciente();
        return dao.buscarPorId(id);
    }

    public int contar() {
        DAOPaciente dao = new DAOPaciente();
        return dao.quantidadePacientes();
    }
    
}
