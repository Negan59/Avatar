package com.sgpd.dao;

import com.sgpd.model.Exercicio;
import com.sgpd.model.SingletonConexao;

public class DAOExercicio {
    public boolean salvar(Exercicio e){
        try {
            System.out.println("chega aqui?");
            String sql = "insert into exercicio (nome, tipo, grau, arquivo) values ('$1', '$2', '$3', '$4')";
            sql = sql.replace("$1", e.getNome());
            sql = sql.replace("$2", e.getTipo());
            sql = sql.replace("$3", e.getGrau());
            sql = sql.replace("$4", e.getArquivo());
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
}
