import * as Kalidokit from "../dist";
//Import Helper Functions from Kalidokit
const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;
const fixedYPosition = 0
let dadosArquivo = []
let lista = [];
let exerciciosGuarda = []
let executando = false

let cadeia1 = []
let cadeia2 = []
let cadeia3 = []


/* THREEJS WORLD SETUP */
let currentVrm;
let avatarAuxiliar;

// renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// camera
const orbitCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
orbitCamera.position.set(0.0, 0.6, 4);



// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8B4513); // Marrom como cor de fundo

scene.scale.set(0.7, 0.7, 0.7);

// Criando um plano (chão)
const groundGeometry = new THREE.PlaneGeometry(10, 10); // Dimensões do plano
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x996633 }); // Marrom claro como cor do chão
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotaciona o plano para que ele fique no chão
scene.add(ground);

// light
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

// Main Render Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    if (currentVrm) {
        // Update model to render physics
        currentVrm.update(clock.getDelta());
    }
    renderer.render(scene, orbitCamera);
}
animate();

/* VRM CHARACTER SETUP */

// Import Character VRM
const loader = new THREE.GLTFLoader();
const loader2 = new THREE.GLTFLoader();
loader.crossOrigin = "anonymous";
loader2.crossOrigin = "anonymous"
// Import model from URL, add your own model here
loader.load(
    "avatarFeminino.vrm",

    (gltf) => {
        THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

        THREE.VRM.from(gltf).then((vrm) => {
            vrm.scene.position.set(0.5, fixedYPosition, 0);
            scene.add(vrm.scene);
            currentVrm = vrm;
            currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
        });
    },

    (progress) => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),

    (error) => console.error(error)
);

loader2.load(
    "avatarGuia.vrm",

    (gltf) => {
        THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

        THREE.VRM.from(gltf).then((vrm) => {

            vrm.scene.position.set(-1, fixedYPosition, 0);
            scene.add(vrm.scene);
            avatarAuxiliar = vrm;
            avatarAuxiliar.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
        });
    },

    (progress) => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),

    (error) => console.error(error)
);



// Animate Rotation Helper function
const rigRotation = (name, rotation = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    if (!currentVrm) {
        return;
    }
    const Part = currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
    if (!Part) {
        return;
    }

    let euler = new THREE.Euler(
        rotation.x * dampener,
        rotation.y * dampener,
        rotation.z * dampener,
        rotation.rotationOrder || "XYZ"
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

// Animate Position Helper Function
const rigPosition = (name, position = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    if (!currentVrm) {
        return;
    }
    const Part = currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
    if (!Part) {
        return;
    }
    let vector = new THREE.Vector3(position.x * dampener, position.y * dampener, position.z * dampener);
    Part.position.lerp(vector, lerpAmount); // interpolate
};

let oldLookTarget = new THREE.Euler();
const rigFace = (riggedFace) => {
    if (!currentVrm) {
        return;
    }
    rigRotation("Neck", riggedFace.head, 0.7);

    // Blendshapes and Preset Name Schema
    const Blendshape = currentVrm.blendShapeProxy;
    const PresetName = THREE.VRMSchema.BlendShapePresetName;

    // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    // for VRM, 1 is closed, 0 is open.
    riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
    riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
    riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);
    Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);

    // Interpolate and set mouth blendshapes
    Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I), 0.5));
    Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A), 0.5));
    Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E), 0.5));
    Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O), 0.5));
    Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U), 0.5));

    //PUPILS
    //interpolate pupil and keep a copy of the value
    let lookTarget = new THREE.Euler(
        lerp(oldLookTarget.x, riggedFace.pupil.y, 0.4),
        lerp(oldLookTarget.y, riggedFace.pupil.x, 0.4),
        0,
        "XYZ"
    );
    oldLookTarget.copy(lookTarget);
    currentVrm.lookAt.applyer.lookAt(lookTarget);
};

const rigRotationAvatarAuxiliar = (name, rotation = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    if (!avatarAuxiliar) {
        return;
    }
    const Part = avatarAuxiliar.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
    if (!Part) {
        return;
    }

    let euler = new THREE.Euler(
        rotation.x * dampener,
        rotation.y * dampener,
        rotation.z * dampener,
        rotation.rotationOrder || "XYZ"
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

// Animate Position Helper Function
const rigPositionAvatarAuxiliar = (name, position = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    if (!avatarAuxiliar) {
        return;
    }
    const Part = avatarAuxiliar.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
    if (!Part) {
        return;
    }
    let vector = new THREE.Vector3(position.x * dampener, position.y * dampener, position.z * dampener);
    Part.position.lerp(vector, lerpAmount); // interpolate
};

const rigFaceAvatarAuxiliar = (riggedFace) => {
    if (!avatarAuxiliar) {
        return;
    }
    rigRotation("Neck", riggedFace.head, 0.7);

    // Blendshapes and Preset Name Schema
    const Blendshape = avatarAuxiliar.blendShapeProxy;
    const PresetName = THREE.VRMSchema.BlendShapePresetName;

    // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    // for VRM, 1 is closed, 0 is open.
    riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
    riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
    riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);
    Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);

    // Interpolate and set mouth blendshapes
    Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I), 0.5));
    Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A), 0.5));
    Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E), 0.5));
    Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O), 0.5));
    Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U), 0.5));

    //PUPILS
    //interpolate pupil and keep a copy of the value
    let lookTarget = new THREE.Euler(
        lerp(oldLookTarget.x, riggedFace.pupil.y, 0.4),
        lerp(oldLookTarget.y, riggedFace.pupil.x, 0.4),
        0,
        "XYZ"
    );
    oldLookTarget.copy(lookTarget);
    avatarAuxiliar.lookAt.applyer.lookAt(lookTarget);
};

/* VRM Character Animator */
const animateVRM = (vrm, results) => {
    if (!vrm) {
        return;
    }
    // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
    let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

    const faceLandmarks = results.faceLandmarks;
    // Pose 3D Landmarks are with respect to Hip distance in meters
    const pose3DLandmarks = results.ea;
    // Pose 2D landmarks are with respect to videoWidth and videoHeight
    const pose2DLandmarks = results.poseLandmarks;
    // Be careful, hand landmarks may be reversed
    const leftHandLandmarks = results.rightHandLandmarks;
    const rightHandLandmarks = results.leftHandLandmarks; 

    if(executando == true){
        dadosArquivo.push(results)
    }

    // Animate Face
    if (faceLandmarks) {
        riggedFace = Kalidokit.Face.solve(faceLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigFace(riggedFace);
    }

    // Animate Pose
    if (pose2DLandmarks && pose3DLandmarks) {
        riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigRotation("Hips", riggedPose.Hips.rotation, 0.7);
        rigPosition(
            "Hips",
            {
                x: riggedPose.Hips.position.x, // Reverse direction
                y: riggedPose.Hips.position.y + 1, // Add a bit of height
                z: -riggedPose.Hips.position.z, // Reverse direction
            },
            1,
            0.07
        );

        rigRotation("Chest", riggedPose.Spine, 0.25, 0.3);
        rigRotation("Spine", riggedPose.Spine, 0.45, 0.3);

        rigRotation("RightUpperArm", riggedPose.RightUpperArm, 1, 0.3);
        rigRotation("RightLowerArm", riggedPose.RightLowerArm, 1, 0.3);
        rigRotation("LeftUpperArm", riggedPose.LeftUpperArm, 1, 0.3);
        rigRotation("LeftLowerArm", riggedPose.LeftLowerArm, 1, 0.3);

        rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, 0.3);
        rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, 0.3);
        rigRotation("RightUpperLeg", riggedPose.RightUpperLeg, 1, 0.3);
        rigRotation("RightLowerLeg", riggedPose.RightLowerLeg, 1, 0.3);
    }
};



/* VRM Character Animator */
const animateVRMAvatarAuxiliar = (vrm, results) => {
    if (!vrm) {
        return;
    }

    // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
    let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

    const faceLandmarks = results.faceLandmarks;
    // Pose 3D Landmarks are with respect to Hip distance in meters
    const pose3DLandmarks = results.ea;
    // Pose 2D landmarks are with respect to videoWidth and videoHeight
    const pose2DLandmarks = results.poseLandmarks;
    // Be careful, hand landmarks may be reversed
    const leftHandLandmarks = results.rightHandLandmarks;
    const rightHandLandmarks = results.leftHandLandmarks;

    

    // Animate Face
    if (faceLandmarks) {
        riggedFace = Kalidokit.Face.solve(faceLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigFaceAvatarAuxiliar(riggedFace);
    }

    // Animate Pose
    if (pose2DLandmarks && pose3DLandmarks) {
        riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigRotationAvatarAuxiliar("Hips", riggedPose.Hips.rotation, 0.7);
        rigPositionAvatarAuxiliar(
            "Hips",
            {
                x: riggedPose.Hips.position.x, // Reverse direction
                y: riggedPose.Hips.position.y + 1, // Add a bit of height
                z: -riggedPose.Hips.position.z, // Reverse direction
            },
            1,
            0.07
        );

        rigRotationAvatarAuxiliar("Chest", riggedPose.Spine, 0.25, 0.3);
        rigRotationAvatarAuxiliar("Spine", riggedPose.Spine, 0.45, 0.3);

        rigRotationAvatarAuxiliar("RightUpperArm", riggedPose.RightUpperArm, 1, 0.3);
        rigRotationAvatarAuxiliar("RightLowerArm", riggedPose.RightLowerArm, 1, 0.3);
        rigRotationAvatarAuxiliar("LeftUpperArm", riggedPose.LeftUpperArm, 1, 0.3);
        rigRotationAvatarAuxiliar("LeftLowerArm", riggedPose.LeftLowerArm, 1, 0.3);

        rigRotationAvatarAuxiliar("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, 0.3);
        rigRotationAvatarAuxiliar("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, 0.3);
        rigRotationAvatarAuxiliar("RightUpperLeg", riggedPose.RightUpperLeg, 1, 0.3);
        rigRotationAvatarAuxiliar("RightLowerLeg", riggedPose.RightLowerLeg, 1, 0.3);
    }

};

/* SETUP MEDIAPIPE HOLISTIC INSTANCE */
let videoElement = document.querySelector(".input_video"),
    guideCanvas = document.querySelector("canvas.guides");

const onResults = (results) => {
    // Animate model
    animateVRM(currentVrm, results);
};

const onResultsAvatarAuxiliar = (results) => {
    // Animate model
    animateVRMAvatarAuxiliar(avatarAuxiliar, results);
};

const holistic = new Holistic({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
    },
});

const holisticAvatarAuxiliar = new Holistic({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
    },
});

holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    refineFaceLandmarks: false,
});

holisticAvatarAuxiliar.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    refineFaceLandmarks: false,
});
// Pass holistic a callback function
holistic.onResults(onResults);
holisticAvatarAuxiliar.onResults(onResultsAvatarAuxiliar);

function getQueryParameter(name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
}
const id = getQueryParameter('id');

const buscarSessao = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/sessao/' + id);
        if (response.ok) {
            const data = await response.json();
            let timeline = document.getElementById('timeline');
            let html = '';
            for (let elemento of data.lista) {
                html += `<div class="timeline-item" style="display: inline-block; margin-right: 10px;">
                            <h5 style="font-size: 14px;">${elemento.exercicio.nome}</h5>
                            <p style="font-size: 12px; color: black;">${elemento.duracao}</p>
                         </div>
                         <div class="timeline-item interval" style="display: inline-block; margin-right: 10px;">
                            <h5 style="font-size: 14px;">Intervalo</h5>
                            <p style="font-size: 12px; color: black;">${elemento.intervalo}</p>
                         </div>`;
                         
                lista.push(elemento)
            }
            timeline.innerHTML = html;
        } else {
            console.error('Erro ao buscar sessão:', response.status);
        }
    } catch (error) {
        console.error('Erro ao buscar sessão:', error);
    }
};


await buscarSessao();

const videoElementAvatar = document.createElement('video');
videoElementAvatar.src = 'teste.mp4'; // Defina o caminho do seu arquivo de vídeo
videoElementAvatar.autoplay = true;
videoElementAvatar.loop = true; // Define para repetir o vídeo



const runHolistic = async (lista) => {
    await holisticAvatarAuxiliar.initialize();
    console.log(lista)
    for (let i = 0; i < lista.length; i++) {
        const partes = lista[i].exercicio.arquivo.split('/');
        const relativePath = 'http://localhost:8082/'+partes[partes.length - 1];
        console.log(relativePath)
        const urlArquivo1 = relativePath;
        let tempoRestante = lista[i].duracao;
        let duracao = lista[i].duracao
        let intervalo = lista[i].intervalo
        let velocidade = 1 / (lista[i].velocidade * 100)
        velocidade = velocidade * 5000
        console.log(intervalo,tempoRestante)
        // Função para ler o arquivo
        const lerArquivo = async (urlArquivo1) => {
            try {
                // Faz uma requisição GET para obter o conteúdo do arquivo
                const response = await fetch(urlArquivo1);

                // Verifica se a requisição foi bem sucedida
                if (!response.ok) {
                    throw new Error('Erro ao ler o arquivo');
                }

                // Converte o conteúdo do arquivo para JSON
                const conteudo = await response.json();
                cadeia2.push(conteudo)

                // Função para iterar sobre os objetos com atraso
                for (const objeto of conteudo) {
                    // Chama a função com o objeto atual
                    animateVRMAvatarAuxiliar(avatarAuxiliar, objeto);
                    

                    // Aguarda um tempo antes de continuar para a próxima iteração
                    await new Promise(resolve => setTimeout(resolve, velocidade)); // Aguarda 10 milissegundos
                }
            } catch (error) {
                console.error('Erro ao ler o arquivo:', error);
            }
        };

        // Função para ler o arquivo por 10 segundos
        const lerArquivoPor10Segundos = async (urlArquivo1) => {
            // Tempo inicial
            const startTime = Date.now();

            // Loop de repetição para ler o arquivo por 10 segundos
            while (true) { // Loop infinito
                const elapsedTime = Date.now() - startTime; // Tempo decorrido desde o início
                if (elapsedTime >= duracao * 1000) { // Se já passaram 10 segundos, interrompe o loop
                    break;
                }

                await lerArquivo(urlArquivo1); // Chama a função para ler o arquivo
            }

            // Quando o tempo acabar, exibe um alerta
            
        };

        const paraIntervalo = async () => {
            executando = false
            console.log(dadosArquivo)
            atualizarContador(intervalo, 2);
        
            await new Promise((resolve) => {
                const espera = setInterval(() => {
                    console.log("intervalo : " + intervalo);
                    intervalo--; // Decrementa o tempo restante
                    atualizarContador(intervalo, 2); // Atualiza o contador na tela
        
                    if (intervalo <= 0) { // Se o tempo acabou
                        clearInterval(espera); // Interrompe o intervalo
                        resolve(); // Resolve a promessa para continuar a execução
                    }
                }, 1000); // 1 segundo
            });

            exerciciosGuarda.push(dadosArquivo)
        }
        

        // Função para atualizar o contador na tela
        const atualizarContador = (tempoRestante,tipo) => {
            if(tipo == 1){
                document.getElementById("contador").textContent = `Tempo restante: ${tempoRestante} segundos`;
            }
            else{
                document.getElementById("contador").textContent = `Intervalo restante: ${tempoRestante} segundos`;
            }
            
        };

        // Função para executar o contador
        const executarContador = async () => {
            executando = true
            // Tempo inicial em segundos
            atualizarContador(tempoRestante,1); // Atualiza o contador na tela

            // Intervalo para decrementar o tempo restante a cada segundo
            const intervalo = setInterval(() => {
                tempoRestante--; // Decrementa o tempo restante
                atualizarContador(tempoRestante,1); // Atualiza o contador na tela

                if (tempoRestante <= 0) { // Se o tempo acabou
                    clearInterval(intervalo); // Interrompe o intervalo
                }
            }, 1000); // 1 segundo

            // Chama a função para ler o arquivo por 10 segundos
            await lerArquivoPor10Segundos(urlArquivo1);
        };

        // Inicia a execução do contador
        await executarContador();
        await paraIntervalo()
    }
    calcularCadeias()
};



// Use `Mediapipe` utils to get camera - lower resolution = higher fps
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await holistic.send({ image: videoElement });
    },
    width: 1280,
    height: 768,
});
camera.start();


const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function() {
    runHolistic(lista);
});

const calcularCadeias = () =>{
    for(let lista of exerciciosGuarda){
        for(let cadeia of lista){
            if(cadeia.poseLandmarks != undefined){
                cadeia1.push(cadeia.poseLandmarks)
            }
        }
    }
    for(let lista of cadeia2){
        for(let cadeia of lista){
            if(cadeia.poseLandmarks != undefined){
                cadeia3.push(cadeia.poseLandmarks)
            }
        }
    }
    calcularSimilaridade(cadeia3,cadeia1)

}

// Função para calcular a porcentagem de similaridade entre duas cadeias de pontos tridimensionais
function calcularSimilaridade(valor1, valor2) {

    console.log("cadeia 1: ", valor1);

    // Função para calcular a distância euclidiana entre dois pontos
    function calcularDistanciaEuclidiana(ponto1, ponto2) {
        const deltaX = ponto1.x - ponto2.x;
        const deltaY = ponto1.y - ponto2.y;
        const deltaZ = ponto1.z - ponto2.z;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    }

    // Função para repetir a cadeia1 até que tenha o mesmo tamanho da cadeia2
    function repetirCadeia1(valor1, tamanhoDesejado) {
        const cadeiaRepetida = [];
        let indice = 0;
        while (cadeiaRepetida.length < tamanhoDesejado) {
            cadeiaRepetida.push(valor1[indice]);
            indice = (indice + 1) % valor1.length;
        }
        return cadeiaRepetida;
    }

    // Repete a cadeia1 até que tenha o mesmo tamanho da cadeia2
    const cadeia1Repetida = repetirCadeia1(valor1, valor2.length);

    console.log(cadeia1Repetida);
    console.log(valor2);

    // Calcula a porcentagem de similaridade entre as duas cadeias de pontos
    let distanciaTotal = 0;
    for (let i = 0; i < valor2.length; i++) {
        const ponto1 = cadeia1Repetida[i];
        const ponto2 = valor2[i];
        for(let j = 0;j<33;j++){
            const distancia = calcularDistanciaEuclidiana(ponto1[j], ponto2[j]);
            distanciaTotal += distancia;
        }
    }
    console.log(distanciaTotal);

    const porcentagemSimilaridade = 100 - (distanciaTotal / (valor2.length * 100)) * 100;
    console.log(porcentagemSimilaridade);

    // Exibe o alerta customizado com SweetAlert2 e redireciona ao clicar em "OK"
    Swal.fire({
        title: 'Similaridade Calculada',
        text: `Porcentagem de similaridade entre as cadeias de pontos: ${porcentagemSimilaridade.toFixed(2)}%`,
        icon: 'info',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "http://localhost:3000/exibir-sessao";
        }
    });
}