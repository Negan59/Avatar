package com.sgpd.control;

import com.sgpd.model.Erro;
import com.sgpd.model.SessaoExercicio;

public class SessaoExercicioController {
    public Erro salvar(SessaoExercicio se){
        return se.salvar();
    }

    public Erro excluir(int id){
        return new SessaoExercicio().excluir(id);
    }
}
