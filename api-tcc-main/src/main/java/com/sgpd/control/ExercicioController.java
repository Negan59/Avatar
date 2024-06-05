package com.sgpd.control;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Random;

import com.sgpd.model.Erro;
import com.sgpd.model.Exercicio;

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
}
