package com.sgpd.dao;

import java.sql.ResultSet;
import java.util.ArrayList;

import com.sgpd.model.Monitor;
import com.sgpd.model.SingletonConexao;



public class DAOMonitor {
    public boolean salvar(Monitor u) {
        try {
            System.out.println("chega aqui?");
            String sql = "insert into monitor (nome, email, ra_matricula, cpf,senha,nivel) values ('$1', '$2', '$3', '$4','$5',1)";
            sql = sql.replace("$1", u.getNome());
            sql = sql.replace("$2", u.getEmail());
            sql = sql.replace("$3", u.getRa());
            sql = sql.replace("$4", u.getCpf());
            sql = sql.replace("$5", u.getSenha());
            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            
            return flag;
            
        } catch (Exception e) {
            // Aqui você pode tratar a exceção capturada
            System.out.println("Erro ao salvar no banco de dados: " + e.getMessage());
            return false;
        }
    }

   // Método para atualizar um monitor no banco de dados
    public boolean atualizar(Monitor monitor) {
        try {
            String sql = "UPDATE monitor SET nome = '$1', email = '$2', ra_matricula = '$3', cpf = '$4', senha = '$5' WHERE id = $6";
            sql = sql.replace("$1", monitor.getNome());
            sql = sql.replace("$2", monitor.getEmail());
            sql = sql.replace("$3", monitor.getRa());
            sql = sql.replace("$4", monitor.getCpf());
            sql = sql.replace("$5", monitor.getSenha());
            sql = sql.replace("$6", String.valueOf(monitor.getId())); // Suponha que você tenha um campo "id" no objeto Monitor
            
            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            System.out.println(sql);
            
            return flag;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Método para excluir um monitor do banco de dados
    public boolean excluir(int idMonitor) {
        try {
            String sql = "DELETE FROM monitor WHERE id = " + idMonitor;
            
            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            
            return flag;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Método para buscar um monitor pelo ID no banco de dados
    public Monitor buscarPorId(int idMonitor) {
        try {
            String sql = "SELECT * FROM monitor WHERE id = " + idMonitor;
            
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);

            if (rs.next()) {
                Monitor monitor = new Monitor();
                monitor.setId(rs.getInt("id"));
                monitor.setNome(rs.getString("nome"));
                monitor.setEmail(rs.getString("email"));
                monitor.setRa(rs.getString("ra_matricula"));
                monitor.setCpf(rs.getString("cpf"));
                monitor.setSenha(rs.getString("senha"));
                monitor.setNivel(rs.getInt("nivel"));
                
                return monitor;
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    // Método para buscar todos os monitores no banco de dados
    public ArrayList<Monitor> buscarTodos() {
        ArrayList<Monitor> monitores = new ArrayList<>();

        try {
            String sql = "SELECT * FROM monitor where nivel = 1 order by nome asc";
            
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);

            while (rs.next()) {
                Monitor monitor = new Monitor();
                monitor.setId(rs.getInt("id"));
                monitor.setNome(rs.getString("nome"));
                monitor.setEmail(rs.getString("email"));
                monitor.setRa(rs.getString("ra_matricula"));
                monitor.setCpf(rs.getString("cpf"));
                monitor.setSenha(rs.getString("senha"));
                monitor.setNivel(rs.getInt("nivel"));
                monitores.add(monitor);
            }
            
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return monitores;
    }

    public ArrayList<Monitor> buscarPorNome(String nome) {
        ArrayList<Monitor> monitores = new ArrayList<>();

        try {
            String sql = "SELECT * FROM monitor where nome like '%"+nome+"%' and nivel = 1 order by nome asc";
            
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);

            while (rs.next()) {
                Monitor monitor = new Monitor();
                monitor.setId(rs.getInt("id"));
                monitor.setNome(rs.getString("nome"));
                monitor.setEmail(rs.getString("email"));
                monitor.setRa(rs.getString("ra_matricula"));
                monitor.setCpf(rs.getString("cpf"));
                monitor.setSenha(rs.getString("senha"));
                monitor.setNivel(rs.getInt("nivel"));
                monitores.add(monitor);
            }
            
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return monitores;
    }
    

}
