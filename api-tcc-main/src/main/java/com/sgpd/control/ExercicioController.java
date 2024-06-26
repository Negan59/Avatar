package com.sgpd.control;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Random;

import com.sgpd.model.Erro;
import com.sgpd.model.Exercicio;
import com.sgpd.model.FMS;

public class ExercicioController {
    private static final String CARACTERES_PERMITIDOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int TAMANHO_HASH = 8; // Tamanho do hash aleatório
    public Erro salvar(Exercicio exercicio, InputStream arquivo) {
        // Caminho onde o arquivo será salvo (ajuste conforme necessário)
        String caminhoDiretorio = "../front-tcc-main/public/arquivos/";
        // Obter o nome do exercício
        String nomeExercicio = exercicio.getNome();

        // Gerar um hash aleatório
        String hashAleatorio = gerarHashAleatorio();

        // Construir o nome do arquivo com o hash aleatório
        String nomeArquivo = "dados_" + nomeExercicio + "_" + hashAleatorio + ".json";
        
        try {
            // Criando o caminho completo para o arquivo
            Path diretorio = Paths.get(caminhoDiretorio);
            Path destino = diretorio.resolve(nomeArquivo);
            
            // Certificando-se de que o diretório exista
            Files.createDirectories(diretorio);
            
            // Usando Files.copy para salvar o InputStream para o destino
            Files.copy(arquivo, destino, StandardCopyOption.REPLACE_EXISTING);
            
            // Agora, após salvar o arquivo, você pode chamar o método salvar() do exercício
            exercicio.setArquivo(caminhoDiretorio + nomeArquivo);
            return exercicio.salvar();
        } catch (IOException e) {
            e.printStackTrace(); // Tratar o erro apropriadamente
            return new Erro("Erro ao salvar o arquivo", false, 500);
        }
    }

    // Método para gerar um hash aleatório
    private String gerarHashAleatorio() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder(TAMANHO_HASH);
        for (int i = 0; i < TAMANHO_HASH; i++) {
            int index = random.nextInt(CARACTERES_PERMITIDOS.length());
            sb.append(CARACTERES_PERMITIDOS.charAt(index));
        }
        return sb.toString();
    }

    public Exercicio buscar(long id){
        Exercicio exercicio = new Exercicio();
        return exercicio.buscar(id);
    }

    public List<Exercicio>buscarTodos(){
        Exercicio exercicio = new Exercicio();
        return exercicio.buscarTodos();
    }

    public List<Exercicio> buscarTodosPorPaciente(int id) {
        Exercicio exercicio = new Exercicio();
        FMS fms = new FMS();
    
        List<FMS> lista = fms.buscar(id);
        
        // Assumindo que a lista sempre tem 3 elementos
        int nivel1 = lista.get(0).getNivel();
        int nivel2 = lista.get(1).getNivel();
        int nivel3 = lista.get(2).getNivel();
    
        // Agora você pode usar as variáveis nivel1, nivel2, e nivel3 conforme necessário
        
        return exercicio.buscarTodosPaciente(nivel1,nivel2,nivel3);
    }    


}
