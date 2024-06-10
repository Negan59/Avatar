package com.sgpd.control;

import java.util.List;

import com.sgpd.model.Erro;
import com.sgpd.model.Sessao;

public class SessaoController {
    public Erro salvar(Sessao sessao){
        return sessao.salvar(sessao);
    }

    public Erro excluir(int id){
        return new Sessao().excluir(id);
    }

    public Sessao buscar(int id){
        return new Sessao().buscar(id);
    }

    public List<Sessao> buscarTodos(){
        return new Sessao().buscarTodos();
    }

    public int buscarUl(){
        return new Sessao().buscarUl();
    }
}
