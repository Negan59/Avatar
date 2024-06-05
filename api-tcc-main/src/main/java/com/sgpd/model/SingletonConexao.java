package com.sgpd.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SingletonConexao {
    private Connection connect;
    private String driver = "com.mysql.cj.jdbc.Driver";
    private String local = "jdbc:mysql://localhost/";
    private String banco = "tcc";
    private String usuario = "root";
    private String senha = "Fifa2015U";
    private String erro="";
    private static SingletonConexao conexao;

    public Connection getConnect() {
        return connect;
    }
    private SingletonConexao(){
        try {
            Class.forName(this.driver); //"org.postgresql.Driver");
            String url = this.local+this.banco; //"jdbc:postgresql://localhost/"+banco;
            connect = DriverManager.getConnection( url, this.usuario,this.senha);
        }
        catch ( ClassNotFoundException cnfex )
        { erro="Falha ao ler o driver JDBC: " + cnfex.toString();
        System.out.println(erro);
        }
        catch ( SQLException sqlex )
        { erro="Impossivel conectar com a base de dados: " + sqlex.toString(); }
        catch ( Exception ex )
        { erro="Outro erro: " + ex.toString(); }
    }

    public static SingletonConexao getConexao(){
        if(conexao == null){
            conexao = new SingletonConexao();
        }
        return conexao;
    }
    public String getMensagemErro() {
        return erro;
    }
    public boolean getEstadoConexao() {
        if(connect==null)  return false;
        else return true;
    }
    public boolean manipular(String sql) // inserir, alterar,excluir
	{
        try {
            Statement statement = connect.createStatement();
            int result = statement.executeUpdate( sql );
            statement.close();
            if(result>=1)
                return true;
        }
        catch ( SQLException sqlex )
        {  erro="Erro: "+sqlex.toString();
           return false;
        }
        return false;
    }
    public ResultSet consultar(String sql)
    {   ResultSet rs=null;
    System.out.println(sql);
        try {
           Statement statement = connect.createStatement();
             //ResultSet.TYPE_SCROLL_INSENSITIVE,
             //ResultSet.CONCUR_READ_ONLY);
           rs = statement.executeQuery( sql );
           //statement.close();
        }
        catch ( SQLException sqlex )
        { erro="Erro: "+sqlex.toString();
          return null;
        }
        return rs;
    }
    public int getMaxPK(String tabela,String chave) 
    {
        String sql="select max("+chave+") from "+tabela;
        int max=0;
        ResultSet rs= consultar(sql);
        try 
        {
            if(rs.next())
                max=rs.getInt(1);
        }
        catch (SQLException sqlex)
        { 
             erro="Erro: " + sqlex.toString();
             return -1;
        }
        return max;
    }
    public boolean fecharConexao()
    {
        boolean flag=true;
        try
        {
        //connect.commit();
        conexao =null;
        }
        catch(Exception e)
        {
            flag=false;
        }
        return flag;
    }
    

}