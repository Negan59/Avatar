package com.sgpd.model;

public class Erro {
    private String mensagem;
    private boolean tipo;// se é 0 é sucesso, se é 1 é erro
    private int status;

    public Erro(String mensagem, boolean tipo, int status) {
        this.mensagem = mensagem;
        this.tipo = tipo;
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }


    public boolean isTipo() {
        return tipo;
    }

    public void setTipo(boolean tipo) {
        this.tipo = tipo;
    }
}
