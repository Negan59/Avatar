import * as Kalidokit from "../dist";
//Import Helper Functions from Kalidokit
const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;
const fixedYPosition = 0
let dadosArquivo = []
let recordedChunks = []
let arquivo = true
const renderer = new THREE.WebGLRenderer({ alpha: true });
const stream = renderer.domElement.captureStream(30); // Captura o stream do canvas a 30 FPS
const mediaRecorder = new MediaRecorder(stream);
let salvando = false
let startTime = 0
let endTime = 0


/* THREEJS WORLD SETUP */
let currentVrm;


// renderer

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// camera
const orbitCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
orbitCamera.position.set(0.0, 1.3, 6);
orbitCamera.lookAt(new THREE.Vector3(0, 0, 0));



// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8B4513); // Marrom como cor de fundo

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
    "avatarGuia.vrm",

    (gltf) => {
        THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

        THREE.VRM.from(gltf).then((vrm) => {
            vrm.scene.position.set(0, fixedYPosition, 0);
            vrm.scene.scale.set(0.7, 0.7, 0.7);
            scene.add(vrm.scene);
            currentVrm = vrm;
            currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
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



const salvarDadosEmArquivo = (dados, nomeArquivo) => {
    const dadosJSON = JSON.stringify(dados);
    const blob = new Blob([dadosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Cria um link temporário para o arquivo e faz o download
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();

    // Libera a URL do objeto Blob
    URL.revokeObjectURL(url);
};


/* SETUP MEDIAPIPE HOLISTIC INSTANCE */
let videoElement = document.querySelector(".input_video"),
    guideCanvas = document.querySelector("canvas.guides");


// Variables for T-pose detection and video recording
let isTPoseDetected = false;
let recordingStarted = false;
let recordingData = [];
let timerInterval;
let countdown = 3;
let file

// Function to detect T-pose
const isArmsDownPose = (poseLandmarks) => {
    if (!poseLandmarks) return false;

    const leftWrist = poseLandmarks[15];
    const rightWrist = poseLandmarks[16];
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftElbow = poseLandmarks[13];
    const rightElbow = poseLandmarks[14];

    // Check if wrists are roughly at the same vertical position as elbows and close to the torso
    const isLeftArmDown = Math.abs(leftWrist.y - leftElbow.y) < 0.1 && Math.abs(leftWrist.x - leftShoulder.x) < 0.1;
    const isRightArmDown = Math.abs(rightWrist.y - rightElbow.y) < 0.1 && Math.abs(rightWrist.x - rightShoulder.x) < 0.1;

    

    return isLeftArmDown && isRightArmDown;
};




// Função para iniciar o countdown e exibir o cronômetro
const startCountdown = () => {
    countdown = 3;
    timerInterval = setInterval(() => {
        document.getElementById('cronometro').textContent = countdown; // Exibe o valor atual do countdown
        if (countdown <= 0) {
            clearInterval(timerInterval); // Para o intervalo quando o countdown chega a 0
            startRecording(); // Inicia a gravação
        }
        countdown--; // Decrementa o countdown a cada segundo
    }, 1000);
};

// Função para parar o countdown e limpar o cronômetro
const resetCountdown = () => {
    clearInterval(timerInterval); // Para o intervalo
    document.getElementById('cronometro').style.display = 'none'; // Esconde o cronômetro
    document.getElementById('cronometro').textContent = '3'; // Reinicia o valor do cronômetro
};

function startRecording() {
    if (recordingStarted) return;

    recordedChunks = [];



    mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = async function () {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        
        // Criar um arquivo WebVTT com a duração do vídeo
        const duration = 60; // Duração do vídeo em segundos
        const vttContent = `WEBVTT\n\n1\n00:00:00.000 --> ${duration}:00:00.000\nVideo duration`;
        const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
    
        // Combinar o vídeo WebM com o arquivo WebVTT
        const combinedBlob = new Blob([blob, vttBlob], { type: 'video/webm' });
    
        const url = URL.createObjectURL(combinedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording_with_duration.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        videoURL = url;
    };
    

    mediaRecorder.start();
    console.log('Recording started');
    recordingStarted = true;
}

function stopRecording() {
    if (!recordingStarted) return;

    mediaRecorder.stop();
    resetCountdown()
    console.log('Recording stopped');
    recordingStarted = false;
}

// Função para lidar com os resultados do Mediapipe Holistic
const onResults = async(results) => {
    drawResults(results);
    await animateVRM(currentVrm, results);

    // Verifica se o usuário está na posição correta (T-Pose)
    if (!recordingStarted && arquivo) {
        if (isArmsDownPose(results.poseLandmarks) && arquivo) {
            if (!isTPoseDetected) {
                isTPoseDetected = true;
                document.getElementById('cronometro').style.display = 'block'; // Exibe o cronômetro
                startCountdown(); // Inicia o countdown antes de começar a gravação
            }
        }
    } else {
        recordingData.push(results);
        if (recordingData.length >= 150) {
            stopRecording(); // Para a gravação após um determinado número de quadros
        }
    }
};

// Draw landmarks and connect them
const drawResults = (results) => {
    guideCanvas.width = videoElement.videoWidth;
    guideCanvas.height = videoElement.videoHeight;

    const canvasCtx = guideCanvas.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);

    // Use `Mediapipe` drawing functions
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
    });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
    });
    if (results.faceLandmarks && results.faceLandmarks.length === 478) {
        //draw pupils
        drawLandmarks(canvasCtx, [results.faceLandmarks[468], results.faceLandmarks[468 + 5]], {
            color: "#FFE603",
            lineWidth: 2,
        });
    }
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: "#FF0000",
        lineWidth: 5,
    });
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: "#00FF00",
        lineWidth: 2,
    });
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
    });
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
    });
    canvasCtx.restore();
};

const holistic = new Holistic({
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


// Pass holistic a callback function
await holistic.onResults(onResults);


let videoURL
const videoElementAvatar = document.createElement('video');
videoElementAvatar.src = 'teste.mp4'; // Defina o caminho do seu arquivo de vídeo
videoElementAvatar.autoplay = true;
videoElementAvatar.loop = false; // Define para repetir o vídeo
let start = 0
let end = 100



const runHolistic = async (videoFile, startPercentage = 0, endPercentage = 0) => {
    await holistic.initialize();
    videoElementAvatar.play()
    let tempoRestante = 10; // Tempo inicial em segundos


    // Função para processar quadros do vídeo e enviar para o modelo
    const processVideo = async () => {

        if (videoElementAvatar.paused || videoElementAvatar.ended) return;
        await holistic.send({ image: videoElementAvatar });
        requestAnimationFrame(processVideo);
    };

    // Função para decrementar o tempo restante a cada segundo
    const decrementarTempo = () => {
        if (tempoRestante > 0) {
            tempoRestante--;
        } else {

        }
    };

    // Configura um temporizador para decrementar o tempo restante a cada segundo
    await processVideo();
    let intervalo = setInterval(decrementarTempo, 1000);

    // Cria um elemento de vídeo temporário para calcular a duração
    const tempVideo = document.createElement('video');
    tempVideo.src = videoURL;

    // Espera que os metadados do vídeo sejam carregados para calcular a duração
    tempVideo.addEventListener('loadedmetadata', () => {
        tempVideo.oncanplaythrough = () => {
            const duration = tempVideo.duration;
            console.log("Duração do vídeo:", duration);
        
            // Faça o que precisa ser feito com a duração do vídeo aqui
        };
        start = tempVideo.duration * (startPercentage / 100);
        console.log(tempVideo)
        end = tempVideo.duration - (tempVideo.duration * (endPercentage / 100));

        // Define o tempo inicial e final do vídeo para cortar
        videoElementAvatar.currentTime = start;

        // Evento para parar o vídeo no tempo final definido
        videoElementAvatar.onended = () => {
            videoElementAvatar.currentTime = end;
            videoElementAvatar.pause();
        };
    });


};


// Modifique a função handleFileSelect para passar o arquivo de vídeo para runHolistic
const handleFileSelect = () => {
    dadosArquivo = []
    salvando = true
    if (file && file.type === 'video/mp4' || videoURL != "") {
        startTime = parseFloat(document.getElementById('sliderStart').value);
        endTime = parseFloat(document.getElementById('sliderEnd').value);
        runHolistic(file, startTime, endTime);
    } else {
        alert('Por favor, selecione um arquivo de vídeo MP4.');
    }
};


function carregaArq(event) {
    file = event.target.files[0];
    videoURL = URL.createObjectURL(file);
    videoElementAvatar.src = videoURL;
    console.log(videoURL)
}

// Adiciona um ouvinte de eventos para o evento change do campo de entrada de arquivo
document.getElementById('customFile').addEventListener('change', carregaArq);


// Event listener para o botão de play
document.getElementById('btnPlay').addEventListener('click', handleFileSelect);



// Use `Mediapipe` utils to get camera - lower resolution = higher fps
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await holistic.send({ image: videoElement });
    },
    width: 480,
    height: 320,
});

// Ocultar campo de arquivo ao clicar em "Capturar com a Câmera"
btnCapturar.addEventListener('click', function () {
    // Exibe o elemento de vídeo ao clicar em "Capturar com a Câmera"
    document.querySelector('.input_video').removeAttribute('hidden');
    customFileInput.style.display = 'none'; // Esconde o campo de arquivo, se estiver visível
    arquivo = true
    camera.start()
});

// Exibir campo de arquivo ao clicar em "Utilizar Arquivo"
btnArquivo.addEventListener('click', function () {
    customFileInput.style.display = 'block';
    arquivo = false
    camera.stop();
    document.querySelector('.input_video').setAttribute('hidden', 'true');
});

const salvar = async () => {
    // Verificar se os campos estão preenchidos
    const grauExercicio = document.getElementById('grauExercicio').value;
    const tipoExercicio = document.getElementById('tipoExercicio').value;
    const nomeExercicio = document.getElementById('nomeExercicio').value;

    if (!grauExercicio || !tipoExercicio || !nomeExercicio) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Exibir gif de carregamento
    document.getElementById('loadingGif').style.display = 'block';

    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação de operação assíncrona

    // Reiniciar o processamento dos resultados
    //salvando = true;
    //await runHolistic(file,startTime,endTime); // Supondo que você tenha uma variável global lastResults para armazenar os resultados mais recentes

     // Converter o objeto para JSON
     const jsonDados = JSON.stringify(dadosArquivo);

     // Criar um Blob com o conteúdo JSON
     const blob = new Blob([jsonDados], { type: 'application/json' });
 
     // Criar um objeto FormData
     const formData = new FormData();
     formData.append('arquivo', blob, 'dados.json'); // 'arquivo' é o nome do campo que o backend espera
     let json = {grau: grauExercicio, nome: nomeExercicio, tipo: tipoExercicio}; // Convertendo para JSON
     const exercicioBlob = new Blob([JSON.stringify(json)], { type: 'application/json' });
     console.log(exercicioBlob)
     formData.append('exercicio',exercicioBlob)
     // Fazer uma solicitação POST para o backend
     try {
         const response = await fetch('http://localhost:8080/api/exercicio', {
             method: 'POST',
             body: formData
         });
 
         if (response.ok) {
             alert('Dados salvos com sucesso!');
         } else {
             throw new Error('Erro ao salvar os dados.');
         }
     } catch (error) {
         console.error('Erro:', error);
         alert('Erro ao salvar os dados. Por favor, tente novamente.');
     }
};



document.getElementById('btnSalvar').addEventListener('click', salvar);
