package com.sgpd.dao;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

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

    public Exercicio buscar(long id){
         try {
            String sql = "SELECT * FROM exercicio WHERE id = " + id;
            
            SingletonConexao con = SingletonConexao.getConexao();
            ResultSet rs = con.consultar(sql);

            if (rs.next()) {
                Exercicio exercicio = new Exercicio();
                exercicio.setId(id);
                exercicio.setNome(rs.getString("nome"));
                exercicio.setGrau(rs.getString("grau"));
                exercicio.setTipo(rs.getString("tipo"));
                exercicio.setArquivo(rs.getString("arquivo"));
                
                return exercicio;
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public List<Exercicio> buscarTodos(){
        ArrayList<Exercicio> exercicios = new ArrayList<>();
        try {
           String sql = "SELECT * FROM exercicio";
           
           
           SingletonConexao con = SingletonConexao.getConexao();
           ResultSet rs = con.consultar(sql);

           while(rs.next()) {
               Exercicio exercicio = new Exercicio();
               exercicio.setId(rs.getLong("id"));
               exercicio.setNome(rs.getString("nome"));
               exercicio.setGrau(rs.getString("grau"));
               exercicio.setTipo(rs.getString("tipo"));
               exercicio.setArquivo(rs.getString("arquivo"));
               
               exercicios.add(exercicio);
           }
           

       } catch (Exception e) {
           e.printStackTrace();
       }

       return exercicios;
   }
}
