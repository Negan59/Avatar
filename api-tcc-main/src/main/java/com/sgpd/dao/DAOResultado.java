package com.sgpd.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.sgpd.model.Resultado;
import com.sgpd.model.Sessao;
import com.sgpd.model.SingletonConexao;

public class DAOResultado {
    public boolean salvar(Resultado resultado){
        try {
            String sql = "insert into resultados (id_sessao, data, porcentagem) values ($1, '$2', $3)";
            sql = sql.replace("$1", ""+resultado.getSessao().getId());
            sql = sql.replace("$2", "" + Timestamp.valueOf(LocalDateTime.now()));
            sql = sql.replace("$3", "" + resultado.getPorcentagem());
            SingletonConexao con = SingletonConexao.getConexao();
            System.out.println(sql);
            boolean flag = con.manipular(sql);
            return flag;
        } catch (Exception ee) {
            System.out.println("Erro ao salvar no banco de dados: " + ee.getMessage());
            return false;
        }
    }

    public List<Resultado> buscar(int paciente) {
        List<Resultado> resultados = new ArrayList<>();
        try {
            StringBuilder sql = new StringBuilder("select * from resultados res inner join sessao ses on ses.id = res.id_sessao where 1=1");
            
            if (paciente != 0) {
                sql.append(" and ses.id_paciente = ").append(paciente); // Assumindo que há um campo id_paciente
            }

            SingletonConexao con = SingletonConexao.getConexao();
            System.out.println(sql.toString());
            ResultSet rs = con.consultar(sql.toString());
            
            while (rs.next()) {
                // Supondo que a classe Resultado tem um construtor que aceita ResultSet como parâmetro
                Resultado resultado = new Resultado();
                resultado.setData(rs.getTimestamp("data").toLocalDateTime());
                resultado.setId(rs.getInt("id_resultado"));
                resultado.setPorcentagem(rs.getDouble("porcentagem"));
                resultado.setSessao(new Sessao().buscar(rs.getInt("id_sessao")));
                resultados.add(resultado);
            }
        } catch (SQLException e) {
            System.out.println("Erro ao buscar no banco de dados: " + e.getMessage());
        }
        return resultados;
    }
}
