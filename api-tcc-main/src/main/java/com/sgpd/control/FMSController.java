package com.sgpd.control;

import java.util.ArrayList;

import com.sgpd.model.Erro;
import com.sgpd.model.FMS;

public class FMSController {
    public Erro salvar(FMS fms) {
        // Validações
        if (fms.getPaciente() == null || fms.getPaciente().getId() <= 0) {
            return new Erro("ID do paciente inválido", true, 400);
        }

        if (fms.getQuestao() <= 0 || fms.getQuestao() > 3) {
            return new Erro("Questão inválida", true, 400);
        }

        if (fms.getNivel() <= 0 || fms.getNivel() > 6) {
            return new Erro("Nível inválido", true, 400);
        }

        if (fms.getDescricao() == null || fms.getDescricao().isEmpty()) {
            return new Erro("Descrição inválida", true, 400);
        }

        if(fms.salvar()){
            return new Erro("sucesso", false, 200);
        }
        else{
            return new Erro("Erro ao salvar", true, 400);
        }
       
    }

    public Erro excluir(int id){
        try {
            FMS fms = new FMS();
            boolean excluiu = fms.excluir(id);
            
            if (excluiu) {
                return new Erro("Registro excluído com sucesso", false, 200);
            } else {
                return new Erro("Falha ao excluir registro", true, 500);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new Erro("Erro interno", true, 500);
        }
    }

    public ArrayList<FMS> buscar(int id){
        return new FMS().buscar(id);
    }
}
