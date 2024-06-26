package com.sgpd.control;

import java.util.List;

import com.sgpd.model.Erro;
import com.sgpd.model.Resultado;

public class ResultadoController {
    public Erro salvar(Resultado resultado){
        return resultado.salvar();
    }

    public List<Resultado> buscar(int paciente){
        Resultado resultado = new Resultado();
        return resultado.buscar(paciente);
    }
}
