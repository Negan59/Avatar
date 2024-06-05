package com.sgpd.control;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import com.sgpd.model.Erro;
import com.sgpd.model.Paciente;

public class PacienteController {
    public Erro salvar(Paciente paciente, InputStream fotoInputStream) {
        System.out.println("salvar : "+paciente.getNome());
        if (!paciente.getNome().isEmpty()) {
            if (paciente.getIdade() > 0) {
                if (paciente.getDatanascimento() != null && paciente.getDatanascimento().isBefore(LocalDate.now())) {
                    if (!paciente.getTelefone().isEmpty()) {
                        if (!paciente.getSexo().isEmpty()) {
                            if (!paciente.getCordapele().isEmpty()) {
                                if (!paciente.getEstadocivil().isEmpty()) {
                                    if (!paciente.getResponsavel().isEmpty()) {
                                        if (!paciente.getProfissaoresponsavel().isEmpty()) {
                                            if (paciente.getAltura() > 0) {
                                                if (paciente.getPeso() > 0) {
                                                    System.out.println("passa da validação?");
                                                    if (fotoInputStream != null) {
                                                        // Salvar a foto
                                                        String caminhoFoto = salvarFoto(paciente, fotoInputStream);
                                                        if (caminhoFoto != null) {
                                                            System.out.println(caminhoFoto);
                                                            paciente.setFoto(caminhoFoto);
                                                        } else {
                                                            return new Erro("Erro ao salvar a foto", true, 500);
                                                        }
                                                    } else {
                                                        // A foto é opcional, então não faz nada aqui
                                                        paciente.setFoto(null);
                                                    }

                                                    if (!paciente.salvar()) {
                                                        return new Erro("Erro no banco de dados", true, 500);
                                                    }

                                                } else {
                                                    return new Erro("Peso inválido", true, 400);
                                                }
                                            } else {
                                                return new Erro("Altura inválida", true, 400);
                                            }
                                        } else {
                                            return new Erro("Por favor, preencha a profissão do responsável", true,
                                                    400);
                                        }
                                    } else {
                                        return new Erro("Por favor, preencha o nome do responsável", true, 400);
                                    }
                                } else {
                                    return new Erro("Por favor, preencha o estado civil", true, 400);
                                }
                            } else {
                                return new Erro("Por favor, preencha a cor da pele", true, 400);
                            }
                        } else {
                            return new Erro("Por favor, preencha o sexo do paciente", true, 400);
                        }
                    } else {
                        return new Erro("Por favor, preencha o telefone do paciente", true, 400);
                    }
                } else {
                    return new Erro("Data de nascimento inválida", true, 400);
                }
            } else {
                return new Erro("Idade inválida", true, 400);
            }
        } else {
            return new Erro("Por favor, preencha o nome do paciente", true, 400);
        }
        System.out.println("Salvou?");
        return new Erro("Sucesso", false, 200);
    }

    private String salvarFoto(Paciente paciente, InputStream fotoInputStream) {
        try {
            System.out.println("Salvando foto");
            Calendar cal = Calendar.getInstance();
            Date now = cal.getTime();
            // Gerar um hash único com base na data e hora atual
            String timeStamp = new SimpleDateFormat("yyyyMMddHHmmss").format(now);
            String uniqueHash = calcularHash(timeStamp);

            // Obter a extensão do arquivo da imagem (supondo que a imagem seja sempre uma
            // extensão .jpg)
            String extensao = ".jpg";

            // Nome do arquivo com base no nome do paciente, hash único e extensão
            String nomeArquivo = "foto_" + paciente.getNome().replaceAll("\\s+", "_") + "_" + uniqueHash + extensao;

            // Caminho absoluto para a pasta "arquivos" (altere para o seu caminho desejado)
            String caminhoPasta = "../front-tcc-main/public/arquivos/";


            File pastaArquivos = new File(caminhoPasta);
            if (!pastaArquivos.exists()) {
                if (!pastaArquivos.mkdirs()) {
                    throw new IOException("Não foi possível criar a pasta 'arquivos'. Verifique as permissões.");
                }
            }

            // Caminho completo do arquivo
            String caminhoArquivo = caminhoPasta + nomeArquivo;
            String nomeSalvar= "arquivos/"+nomeArquivo;

            try (FileOutputStream outputStream = new FileOutputStream(caminhoArquivo)) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = fotoInputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                return nomeSalvar;
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    private String calcularHash(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = md.digest(input.getBytes());
        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public Erro alterar(Paciente paciente,InputStream fotoInputStream,int id) {
        System.out.println(id);
        Paciente pacienteA = buscarUm(id);
        
        if (!paciente.getNome().isEmpty()) {
            if (paciente.getIdade() > 0) {
                if (paciente.getDatanascimento() != null && paciente.getDatanascimento().isBefore(LocalDate.now())) {
                    if (!paciente.getTelefone().isEmpty()) {
                        if (!paciente.getSexo().isEmpty()) {
                            if (!paciente.getCordapele().isEmpty()) {
                                if (!paciente.getEstadocivil().isEmpty()) {
                                    if (!paciente.getResponsavel().isEmpty()) {
                                        if (!paciente.getProfissaoresponsavel().isEmpty()) {
                                            if (paciente.getAltura() > 0) {
                                                if (paciente.getPeso() > 0) {
                                                    if (pacienteA.getFoto() != null && !pacienteA.getFoto().isEmpty()) {
                                                        // Caminho da foto existente
                                                        String caminhoFotoExistente = pacienteA.getFoto();
    
                                                        // Apagar a foto existente, se houver
                                                        apagarFoto(caminhoFotoExistente);
    
                                                        // Salvar a nova foto
                                                        
                                                    }
                                                    String caminhoNovaFoto = salvarFoto(paciente, fotoInputStream);
                                                        paciente.setFoto(caminhoNovaFoto);
                                                        if (caminhoNovaFoto == null) {
                                                            return new Erro("Erro ao salvar a nova foto", true, 500);
                                                        }
                                                    if (!paciente.alterar()) {
                                                        return new Erro("Erro no banco de dados", true, 500);
                                                    }
                                                } else {
                                                    return new Erro("Peso inválido", true, 400);
                                                }
                                            } else {
                                                return new Erro("Altura inválida", true, 400);
                                            }
                                        } else {
                                            return new Erro("Por favor, preencha a profissão do responsável", true, 400);
                                        }
                                    } else {
                                        return new Erro("Por favor, preencha o nome do responsável", true, 400);
                                    }
                                } else {
                                    return new Erro("Por favor, preencha o estado civil", true, 400);
                                }
                            } else {
                                return new Erro("Por favor, preencha a cor da pele", true, 400);
                            }
                        } else {
                            return new Erro("Por favor, preencha o sexo do paciente", true, 400);
                        }
                    } else {
                        return new Erro("Por favor, preencha o telefone do paciente", true, 400);
                    }
                } else {
                    return new Erro("Data de nascimento inválida", true, 400);
                }
            } else {
                return new Erro("Idade inválida", true, 400);
            }
        } else {
            return new Erro("Por favor, preencha o nome do paciente", true, 400);
        }
        return new Erro("Sucesso", false, 200);
    }
    

    private void apagarFoto(String caminhoFotoExistente) {
        if (caminhoFotoExistente != null && !caminhoFotoExistente.isEmpty()) {
            String caminhoPasta = "../front-tcc-main/public/"+caminhoFotoExistente;
            File fotoExistente = new File(caminhoPasta);
            
            if (fotoExistente.exists()) {
                if (fotoExistente.delete()) {
                    System.out.println("Foto anterior excluída com sucesso.");
                } else {
                    System.err.println("Erro ao excluir a foto anterior.");
                }
            }
        }
    }

    public Erro apagar(int id) {
        Paciente paciente = new Paciente();
        paciente = buscarUm(id);
        apagarFoto(paciente.getFoto());
        if (paciente.apagar(id)) {
            return new Erro("Sucesso", false, 200);
        } else {
            return new Erro("Não foi possível excluir o paciente", true, 400);
        }
    }

    public ArrayList<Paciente> buscarTodos() {
        return new Paciente().buscarTodos();
    }

    public ArrayList<Paciente> buscarTodosLimite(int inicio, int fim) {
        return new Paciente().buscarTodos(inicio,fim);
    }

    public ArrayList<Paciente> buscarPorNome(String nome) {
        return new Paciente().buscarNome(nome);
    }

    public Paciente buscarUm(int id) {
        return new Paciente().buscarUm(id);
    }

    public int quantidadePacientes() {
        return new Paciente().contar();
    }
}
