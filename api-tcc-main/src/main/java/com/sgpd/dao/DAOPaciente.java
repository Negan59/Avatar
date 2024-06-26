package com.sgpd.dao;

import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.ArrayList;
import com.sgpd.model.Paciente;
import com.sgpd.model.SingletonConexao;

public class DAOPaciente {
    public boolean salvar(Paciente paciente) {
        try {
            System.out.println(paciente.getFoto());
            String sql = "INSERT INTO paciente (nome, idade, datanascimento, telefone, sexo, cordapele, estadocivil, responsavel, profissaoresponsavel, altura, peso, foto) " +
                         "VALUES ('$1', $2, '$3', '$4', '$5', '$6', '$7', '$8', '$9', $A, $B, '$C')";
            sql = sql.replace("$1", paciente.getNome())
                     .replace("$2", String.valueOf(paciente.getIdade()))
                     .replace("$3", paciente.getDatanascimento().toString())
                     .replace("$4", paciente.getTelefone())
                     .replace("$5", paciente.getSexo())
                     .replace("$6", paciente.getCordapele())
                     .replace("$7", paciente.getEstadocivil())
                     .replace("$8", paciente.getResponsavel())
                     .replace("$9", paciente.getProfissaoresponsavel())
                     .replace("$A",""+(int) paciente.getAltura())
                     .replace("$B", ""+(int)paciente.getPeso())
                     .replace("$C", paciente.getFoto());

            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            
            return flag;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean atualizar(Paciente paciente) {
        try {
            String sql = "UPDATE paciente " +
                         "SET nome = '$1', idade = $2, datanascimento = '$3', telefone = '$4', sexo = '$5', cordapele = '$6', " +
                         "estadocivil = '$7', responsavel = '$8', profissaoresponsavel = '$9', altura = $A, peso = $B, foto = '$C' " +
                         "WHERE id = $D";

            sql = sql.replace("$1", paciente.getNome())
                     .replace("$2", String.valueOf(paciente.getIdade()))
                     .replace("$3", paciente.getDatanascimento().toString())
                     .replace("$4", paciente.getTelefone())
                     .replace("$5", paciente.getSexo())
                     .replace("$6", paciente.getCordapele())
                     .replace("$7", paciente.getEstadocivil())
                     .replace("$8", paciente.getResponsavel())
                     .replace("$9", paciente.getProfissaoresponsavel())
                     .replace("$A", String.valueOf(paciente.getAltura()))
                     .replace("$B", String.valueOf(paciente.getPeso()))
                     .replace("$C", paciente.getFoto())
                     .replace("$D", String.valueOf(paciente.getId()));

            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            
            return flag;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean excluir(int idPaciente) {
        try {
            String sql = "DELETE FROM paciente WHERE id = " + idPaciente;
            
            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            
            return flag;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Paciente buscarPorId(int idPaciente) {
        try {
            String sql = "SELECT * FROM paciente WHERE id = " + idPaciente;
            
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);
            System.out.println(sql);
            if (rs.next()) {
                Paciente paciente = new Paciente();
                paciente.setId(rs.getInt("id"));
                paciente.setNome(rs.getString("nome"));
                paciente.setIdade(rs.getInt("idade"));
                paciente.setDatanascimento(LocalDate.parse(rs.getString("datanascimento")));
                paciente.setTelefone(rs.getString("telefone"));
                paciente.setSexo(rs.getString("sexo"));
                paciente.setCordapele(rs.getString("cordapele"));
                paciente.setEstadocivil(rs.getString("estadocivil"));
                paciente.setResponsavel(rs.getString("responsavel"));
                paciente.setProfissaoresponsavel(rs.getString("profissaoresponsavel"));
                paciente.setAltura(rs.getDouble("altura"));
                paciente.setPeso(rs.getDouble("peso"));
                paciente.setFoto(rs.getString("foto"));
                
                return paciente;
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public ArrayList<Paciente> buscarTodos() {
        ArrayList<Paciente> pacientes = new ArrayList<>();
        SingletonConexao con = SingletonConexao.getConexao();
        try {
            String sql = "SELECT DISTINCT pa.* FROM paciente pa"+
                          " LEFT JOIN fms f ON f.paciente_id = pa.id"+
                          " WHERE f.paciente_id IS NOT NULL"+
                          " ORDER BY nome ASC";
            
            
            ResultSet rs = con.consultar(sql);

            while (rs.next()) {
                Paciente paciente = new Paciente();
                paciente.setId(rs.getInt("id"));
                paciente.setNome(rs.getString("nome"));
                paciente.setIdade(rs.getInt("idade"));
                paciente.setDatanascimento(LocalDate.parse(rs.getString("datanascimento")));
                paciente.setTelefone(rs.getString("telefone"));
                paciente.setSexo(rs.getString("sexo"));
                paciente.setCordapele(rs.getString("cordapele"));
                paciente.setEstadocivil(rs.getString("estadocivil"));
                paciente.setResponsavel(rs.getString("responsavel"));
                paciente.setProfissaoresponsavel(rs.getString("profissaoresponsavel"));
                paciente.setAltura(rs.getDouble("altura"));
                paciente.setPeso(rs.getDouble("peso"));
                paciente.setFoto(rs.getString("foto"));
                pacientes.add(paciente);
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return pacientes;
    }

     public ArrayList<Paciente> buscarTodosLimite(int inicio,int fim) {
        ArrayList<Paciente> pacientes = new ArrayList<>();
        SingletonConexao con = SingletonConexao.getConexao();
        try {
            String sql = "SELECT * FROM paciente ORDER BY nome ASC "+"limit "+inicio+","+fim;
            
            
            ResultSet rs = con.consultar(sql);

            while (rs.next()) {
                Paciente paciente = new Paciente();
                paciente.setId(rs.getInt("id"));
                paciente.setNome(rs.getString("nome"));
                paciente.setIdade(rs.getInt("idade"));
                paciente.setDatanascimento(LocalDate.parse(rs.getString("datanascimento")));
                paciente.setTelefone(rs.getString("telefone"));
                paciente.setSexo(rs.getString("sexo"));
                paciente.setCordapele(rs.getString("cordapele"));
                paciente.setEstadocivil(rs.getString("estadocivil"));
                paciente.setResponsavel(rs.getString("responsavel"));
                paciente.setProfissaoresponsavel(rs.getString("profissaoresponsavel"));
                paciente.setAltura(rs.getDouble("altura"));
                paciente.setPeso(rs.getDouble("peso"));
                paciente.setFoto(rs.getString("foto"));
                pacientes.add(paciente);
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return pacientes;
    }

    public ArrayList<Paciente> buscarPorNome(String nome) {
        ArrayList<Paciente> pacientes = new ArrayList<>();
        SingletonConexao con = SingletonConexao.getConexao();
        try {
            String sql = "SELECT * FROM paciente WHERE nome LIKE '%" + nome + "%' ORDER BY nome ASC";
            
            
            ResultSet rs = con.consultar(sql);

            while (rs.next()) {
                Paciente paciente = new Paciente();
                paciente.setId(rs.getInt("id"));
                paciente.setNome(rs.getString("nome"));
                paciente.setIdade(rs.getInt("idade"));
                paciente.setDatanascimento(LocalDate.parse(rs.getString("datanascimento")));
                paciente.setTelefone(rs.getString("telefone"));
                paciente.setSexo(rs.getString("sexo"));
                paciente.setCordapele(rs.getString("cordapele"));
                paciente.setEstadocivil(rs.getString("estadocivil"));
                paciente.setResponsavel(rs.getString("responsavel"));
                paciente.setProfissaoresponsavel(rs.getString("profissaoresponsavel"));
                paciente.setAltura(rs.getDouble("altura"));
                paciente.setPeso(rs.getDouble("peso"));
                paciente.setFoto(rs.getString("foto"));
                pacientes.add(paciente);
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return pacientes;
    }

    public int quantidadePacientes(){
        try {
            String sql = "SELECT count(*) as qtd from paciente";
            int qtd = 0;
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);
            System.out.println(sql);
            if (rs.next()) {
                qtd = rs.getInt("qtd");
                
                return qtd;
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return 0;
    }
}
