package com.sgpd.dao;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.sgpd.model.Sessao;
import com.sgpd.model.SingletonConexao;

public class DAOSessao {

    public boolean salvar(Sessao sessao) {
        try {
            String sql = "insert into sessao (nome, id_paciente, data) values ('$1', $2, '$3')";
            sql = sql.replace("$1", sessao.getNome());
            sql = sql.replace("$2", "" + sessao.getPaciente().getId());
            sql = sql.replace("$3", "" + Timestamp.valueOf(LocalDateTime.now()));
            SingletonConexao con = SingletonConexao.getConexao();
            System.out.println(sql);
            boolean flag = con.manipular(sql);
            return flag;
        } catch (Exception ee) {
            System.out.println("Erro ao salvar no banco de dados: " + ee.getMessage());
            return false;
        }
    }

    public Sessao buscarUm(int idSessao) {
        Sessao sessao = null;
        try {
            String sql = "select * from sessao where id = " + idSessao;
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);
            if (rs.next()) {
                sessao = new Sessao();
                sessao.setId(rs.getInt("id"));
                sessao.setNome(rs.getString("nome"));
                sessao.setData(rs.getTimestamp("data").toLocalDateTime());
                sessao.setLista(new DAOSessaoExercicio().buscarTodos(sessao.getId()));
                // Assumindo que existe um método para buscar o paciente pelo ID
                sessao.setPaciente(new DAOPaciente().buscarPorId(rs.getInt("id_paciente")));
            }
        } catch (Exception ee) {
            System.out.println("Erro ao buscar o registro: " + ee.getMessage());
        }
        return sessao;
    }

    public boolean excluir(int idSessao) {
        try {
            String sql = "delete from sessao where id = " + idSessao + " AND data_execucao IS NULL";
            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            return flag;
        } catch (Exception ee) {
            System.out.println("Erro ao excluir o registro: " + ee.getMessage());
            return false;
        }
    }

    public List<Sessao> buscarTodos() {
        List<Sessao> lista = new ArrayList<>();
        try {
            String sql = "select * from sessao";
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);
            while (rs.next()) {
                Sessao sessao = new Sessao();
                sessao.setId(rs.getInt("id"));
                sessao.setNome(rs.getString("nome"));
                sessao.setData(rs.getTimestamp("data").toLocalDateTime());
                // Assumindo que existe um método para buscar o paciente pelo ID
                sessao.setPaciente(new DAOPaciente().buscarPorId(rs.getInt("id_paciente")));
                sessao.setLista(new DAOSessaoExercicio().buscarTodos(sessao.getId()));
                lista.add(sessao);
            }
        } catch (Exception ee) {
            System.out.println("Erro ao buscar todos os registros: " + ee.getMessage());
        }
        return lista;
    }

    public int buscarUltimo(){
        SingletonConexao con = SingletonConexao.getConexao();
        return con.getMaxPK("sessao", "id");
    }
}
