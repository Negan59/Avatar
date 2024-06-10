package com.sgpd.dao;

import com.sgpd.model.Exercicio;
import com.sgpd.model.Sessao;
import com.sgpd.model.SessaoExercicio;
import com.sgpd.model.SingletonConexao;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class DAOSessaoExercicio {

    public boolean salvar(SessaoExercicio sessaoexercicio) {
        try {
            String sql = "insert into sessao_exercicio (idexercicio, idsessao, ordem, velocidade, duracao, intervalo)" +
            "values ($1, $2, $3, $4, $5, $6)";
            sql = sql.replace("$1", "" + sessaoexercicio.getExercicio().getId());
            sql = sql.replace("$2", "" + sessaoexercicio.getSessao().getId());
            sql = sql.replace("$3", "" + sessaoexercicio.getOrdem());
            sql = sql.replace("$4", "" + sessaoexercicio.getVelocidade());
            sql = sql.replace("$5", "" + sessaoexercicio.getDuracao());
            sql = sql.replace("$6", "" + sessaoexercicio.getIntervalo());
            SingletonConexao con = SingletonConexao.getConexao();
            System.out.println(sql);
            boolean flag = con.manipular(sql);
            
            return flag;
            
        } catch (Exception ee) {
            // Aqui você pode tratar a exceção capturada
            System.out.println("Erro ao salvar no banco de dados: " + ee.getMessage());
            return false;
        }
    }

    public SessaoExercicio buscarUm(int idSessao, int idExercicio) {
        SessaoExercicio sessaoExercicio = null;
        try {
            String sql = "select * from sessao_exercicio where idsessao = " + idSessao + " and idexercicio = " + idExercicio;
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);
            if (rs.next()) {
                sessaoExercicio = new SessaoExercicio();
                sessaoExercicio.setExercicio(new Exercicio().buscar(rs.getInt("idexercicio")));;
                sessaoExercicio.setOrdem(rs.getInt("ordem"));
                sessaoExercicio.setVelocidade(rs.getDouble("velocidade"));
                sessaoExercicio.setDuracao(rs.getInt("duracao"));
                sessaoExercicio.setIntervalo(rs.getInt("intervalo"));
            }
        } catch (Exception ee) {
            System.out.println("Erro ao buscar o registro: " + ee.getMessage());
        }
        return sessaoExercicio;
    }

    public boolean excluir(int idSessao) {
        try {
            String sql = "delete from sessao_exercicio where idsessao = " + idSessao;
            SingletonConexao con = SingletonConexao.getConexao();
            boolean flag = con.manipular(sql);
            return flag;
        } catch (Exception ee) {
            System.out.println("Erro ao excluir o registro: " + ee.getMessage());
            return false;
        }
    }

    public List<SessaoExercicio> buscarTodos(int idSessao) {
        List<SessaoExercicio> lista = new ArrayList<>();
        try {
            String sql = "select * from sessao_exercicio where idsessao = " + idSessao;
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);
            while (rs.next()) {
                SessaoExercicio sessaoExercicio = new SessaoExercicio();
                sessaoExercicio.setExercicio(new Exercicio().buscar(rs.getInt("idexercicio")));
                sessaoExercicio.setOrdem(rs.getInt("ordem"));
                sessaoExercicio.setVelocidade(rs.getDouble("velocidade"));
                sessaoExercicio.setDuracao(rs.getInt("duracao"));
                sessaoExercicio.setIntervalo(rs.getInt("intervalo"));
                lista.add(sessaoExercicio);
            }
        } catch (Exception ee) {
            System.out.println("Erro ao buscar todos os registros: " + ee.getMessage());
        }
        return lista;
    }
}

