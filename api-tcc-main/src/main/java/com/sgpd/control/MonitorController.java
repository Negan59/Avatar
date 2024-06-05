package com.sgpd.control;

import java.util.ArrayList;

import com.sgpd.model.Erro;
import com.sgpd.model.Monitor;

public class MonitorController {
    public Erro salvar(Monitor monitor){
        if(!monitor.getEmail().isEmpty()){
            if(!monitor.getNome().isEmpty()){
                if(monitor.getSenha().length() >= 5){
                    if(!monitor.salvar()){
                        return new Erro("Erro no banco de dados", true, 500);
                    }
                }else{
                    return new Erro("Senha muito curta", true, 400);
                }
            }else{
                return new Erro("Por favor, preencha o nome do usuário", true, 400);
            }
        }else{
            return new Erro("Por favor, preencha o email do usuário", true, 500);
        }
        return new Erro("Sucesso", false, 200);
    }

    public Erro alterar(Monitor monitor){
        if(!monitor.getEmail().isEmpty()){
            if(!monitor.getNome().isEmpty()){
                if(monitor.getSenha().length() >= 5){
                    if(!monitor.alterar()){
                        return new Erro("Erro no banco de dados", true, 500);
                    }
                }else{
                    return new Erro("Senha muito curta", true, 400);
                }
            }else{
                return new Erro("Por favor, preencha o nome do usuário", true, 400);
            }
        }else{
            return new Erro("Por favor, preencha o email do usuário", true, 500);
        }
        return new Erro("Sucesso", false, 200);
    }

    public Erro apagar(int id){
        Monitor p = new Monitor();
        if(p.apagar(id)){
            return new Erro("Sucesso", false, 200);
        }
        else{
            return new Erro("Monitor possui funções atribuídas, não pode ser excluido", true, 400);
        }
    }

    public ArrayList<Monitor> buscarTodos(){
        return new Monitor().buscarTodos();
    }

    public ArrayList<Monitor> buscarNome(String nome){
        return new Monitor().buscarNome(nome);
    }

    public Monitor buscarUm(int id){
        return new Monitor().buscarUm(id);
    }
}
