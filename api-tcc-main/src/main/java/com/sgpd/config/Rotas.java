package com.sgpd.config;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sgpd.control.ExercicioController;
import com.sgpd.control.FMSController;
import com.sgpd.control.MonitorController;
import com.sgpd.control.PacienteController;
import com.sgpd.control.ResultadoController;
import com.sgpd.control.SessaoController;
import com.sgpd.control.SessaoExercicioController;
import com.sgpd.model.Erro;
import com.sgpd.model.Exercicio;
import com.sgpd.model.FMS;
import com.sgpd.model.Monitor;
import com.sgpd.model.Paciente;
import com.sgpd.model.Resultado;
import com.sgpd.model.Sessao;
import com.sgpd.model.SessaoExercicio;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@CrossOrigin
@RestController
@RequestMapping("/api")
public class Rotas {

    // Monitor
    @PostMapping("/monitor")
    public ResponseEntity<Erro> inserirMonitor(@RequestBody Monitor u) {
        return new ResponseEntity<>(new MonitorController().salvar(u), HttpStatus.OK);
    }

    @PutMapping("/monitor")
    public ResponseEntity<Erro> alterarMonitor(@RequestBody Monitor u) {
        return new ResponseEntity<>(new MonitorController().alterar(u), HttpStatus.OK);
    }

    @DeleteMapping("/monitor/{id}")
    public ResponseEntity<Erro> apagarMonitor(@PathVariable(value = "id") int id) {
        return new ResponseEntity<>(new MonitorController().apagar(id), HttpStatus.OK);
    }

    @GetMapping("/monitor/{id}")
    public ResponseEntity<Monitor> buscarUmMonitor(@PathVariable(value = "id") int id) {
        return new ResponseEntity<Monitor>(new MonitorController().buscarUm(id), HttpStatus.OK);
    }

    @GetMapping("/monitor")
    public ResponseEntity<Object> buscarTodosMonitor() {
        return new ResponseEntity<>(new MonitorController().buscarTodos(), HttpStatus.OK);
    }

    @GetMapping("/monitornome")
    public ResponseEntity<Object> buscarNomeMonitor(@RequestParam String nome) {
        return new ResponseEntity<>(new MonitorController().buscarNome(nome), HttpStatus.OK);
    }

    // paciente
    @PostMapping(value = "/exercicio", consumes = "multipart/form-data")
    public ResponseEntity<Erro> inserirExercicio(
        @RequestPart("arquivo") MultipartFile arquivo,
        @RequestPart("exercicio") Exercicio exercicio) throws IOException {
        return new ResponseEntity<>(new ExercicioController().salvar(exercicio, arquivo.getInputStream()), HttpStatus.OK);
    }


    @PostMapping(value = "/paciente", consumes = "multipart/form-data")
    public ResponseEntity<Erro> inserirPaciente(
        @RequestPart("foto") MultipartFile foto,
        @RequestPart("paciente") Paciente paciente) throws IOException {
                System.out.println(paciente.getNome());
        return new ResponseEntity<>(new PacienteController().salvar(paciente, foto.getInputStream()), HttpStatus.OK);
    }

    @PostMapping(value = "/pacientea", consumes = "multipart/form-data")
    public ResponseEntity<Erro> alterarPaciente(@RequestPart("foto") MultipartFile foto,
        @RequestPart("paciente") Paciente paciente,@RequestParam("id") int id) throws IOException {
        return new ResponseEntity<>(new PacienteController().alterar(paciente,foto.getInputStream(),id), HttpStatus.OK);
    }

    @DeleteMapping("/paciente/{id}")
    public ResponseEntity<Erro> apagarPaciente(@PathVariable(value = "id") int id) {
        return new ResponseEntity<>(new PacienteController().apagar(id), HttpStatus.OK);
    }

    @GetMapping("/paciente/{id}")
    public ResponseEntity<Paciente> buscarUmPaciente(@PathVariable(value = "id") int id) {
        return new ResponseEntity<Paciente>(new PacienteController().buscarUm(id), HttpStatus.OK);
    }

    @GetMapping("/paciente")
    public ResponseEntity<Object> buscarTodosPaciente() {
        return new ResponseEntity<>(new PacienteController().buscarTodos(), HttpStatus.OK);
    }

    @GetMapping("/paciente/pag")
    public ResponseEntity<Object> buscarTodosPacientePag(@RequestParam("start")int inicio,@RequestParam("limit")int fim) {
        return new ResponseEntity<>(new PacienteController().buscarTodosLimite(inicio,fim), HttpStatus.OK);
    }

    @GetMapping("/paciente/qtd")
    public ResponseEntity<Integer> contarPacientes() {
        return new ResponseEntity<>(new PacienteController().quantidadePacientes(), HttpStatus.OK);
    }

    @GetMapping("/pacientenome")
    public ResponseEntity<Object> buscarNomePaciente(@RequestParam String nome) {
        return new ResponseEntity<>(new PacienteController().buscarPorNome(nome), HttpStatus.OK);
    }

    //fms
    @PostMapping("/fms")
    public ResponseEntity<Erro> inserirFMS(@RequestBody FMS u) {
        return new ResponseEntity<>(new FMSController().salvar(u), HttpStatus.OK);
    } 

    @DeleteMapping("/fms/apagar/{id}")
    public ResponseEntity<Erro> apagarFMS(@PathVariable(value = "id") int id) {
        return new ResponseEntity<>(new FMSController().excluir(id), HttpStatus.OK);
    }

    @GetMapping("/fms/{id}")
    public ResponseEntity<Object> buscarFMS(@PathVariable(value = "id") int id) {
        return new ResponseEntity<>(new FMSController().buscar(id), HttpStatus.OK);
    }

    @GetMapping("/exercicio/{id}")
    public ResponseEntity<Object> buscarExercicio(@PathVariable("id") long id) {
        return new ResponseEntity<>(new ExercicioController().buscar(id), HttpStatus.OK);
    }

    @GetMapping("/exercicio/buscar")
    public ResponseEntity<Object> buscarExercicioTodos() {
        return new ResponseEntity<>(new ExercicioController().buscarTodos(), HttpStatus.OK);
    }

    @GetMapping("/exercicio/buscar/{id}")
    public ResponseEntity<Object> buscarExercicioTodosPorPaciente(@PathVariable("id")int id) {
        return new ResponseEntity<>(new ExercicioController().buscarTodosPorPaciente(id), HttpStatus.OK);
    }

    //sessão
    @PostMapping("/sessao")
    public ResponseEntity<Object> SalvarSessao(@RequestBody Sessao sessao) {
        return new ResponseEntity<>(new SessaoController().salvar(sessao),HttpStatus.OK);
    }

    @DeleteMapping("/sessao/{id}")
    public ResponseEntity<Object> ExcluirSessao(@PathVariable("id")int id) {
        return new ResponseEntity<>(new SessaoController().excluir(id),HttpStatus.OK);
    }
    
    @GetMapping("/sessao/{id}")
    public ResponseEntity<Object> BuscarSessao(@PathVariable("id")int id) {
        return new ResponseEntity<>(new SessaoController().buscar(id),HttpStatus.OK);
    }

    @GetMapping("/sessao")
    public ResponseEntity<Object> BuscarTodasSessao() {
        return new ResponseEntity<>(new SessaoController().buscarTodos(),HttpStatus.OK);
    }

    //sessao do exercicio
    @PostMapping("/sessaoexercicio")
    public ResponseEntity<Object> SalvarSessaoExercicio(@RequestBody SessaoExercicio sessao) {
        return new ResponseEntity<>(new SessaoExercicioController().salvar(sessao),HttpStatus.OK);
    }

    @DeleteMapping("/sessaoexercicio/{id}")
    public ResponseEntity<Object> DeletarSessaoExercicio(@PathVariable("id") int id) {
        return new ResponseEntity<>(new SessaoExercicioController().excluir(id),HttpStatus.OK);
    }

    @GetMapping("/sessao/ultima")
    public int buscarUltimo() {
        return new SessaoController().buscarUl();
    }
    
    @PostMapping("/resultado")
    public ResponseEntity<Object> salvarResultado(@RequestBody Resultado resultado) {
        return new ResponseEntity<>(new ResultadoController().salvar(resultado),HttpStatus.OK);
    }

    @GetMapping("/resultado/paciente/{idpaciente}")
    public ResponseEntity<Object> BuscarResultado(@PathVariable("idpaciente")int idpaciente) {
        return new ResponseEntity<>(new ResultadoController().buscar(idpaciente),HttpStatus.OK);
    }
    
    
    
    
    
}
