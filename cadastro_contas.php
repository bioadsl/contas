<?php
session_start();
require_once 'Conn.php';

// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro de Contas</title>
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <?php
    require_once 'Menu.class.php';
    Menu::render();
    ?>
    <div class="container mt-5">
        <h2>Cadastro de Contas</h2>
        <form action="cadastrar_conta.php" method="post">
            <div class="form-group">
                <label for="empresa">Empresa:</label>
                <input type="text" class="form-control" id="empresa" name="empresa" required>
            </div>
            
            <div class="form-group">
                <label for="cod_barras">Código de Barras:</label>
                <input type="text" class="form-control" id="cod_barras" name="cod_barras" required>
                <button type="button" class="btn btn-secondary btn-sm" id="scanButton">Escanear Código</button>
            </div>
            
            <div class="form-group">
                <label for="vencimento">Vencimento:</label>
                <input type="date" class="form-control" id="vencimento" name="vencimento" required>
            </div>
            
            <div class="form-group">
                <label for="valor">Valor:</label>
                <input type="number" step="0.01" class="form-control" id="valor" name="valor" required>
            </div>
            
            <button type="button" class="btn btn-secondary " onclick="voltar()">Voltar</button>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
            <input type="hidden" value="1" id="usuario_id" name="usuario_id">
        </form>

        <div id="camera-container">
            <label for="camera">Fotografar Código de Barras:</label>
            <video id="camera" style="width:100%; height:auto;"></video>
        </div>
    </div>

    <!-- Adicione os links para os arquivos JavaScript do Bootstrap e QuaggaJS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.rawgit.com/serratus/quaggaJS/0.12.1/dist/quagga.min.js"></script>
    
    <script>
        $(document).ready(function() {
            var video = document.getElementById('camera');
            
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(function(stream) {
                    video.srcObject = stream;
                    video.play();
                    
                    Quagga.init({
                        inputStream: {
                            stream: stream,
                            constraints: {
                                facingMode: 'environment'
                            }
                        },
                        decoder: {
                            readers: ["code_128_reader"] // Pode adicionar outros tipos de leitores aqui
                        }
                    }, function(err) {
                        if (err) {
                            console.error("Erro ao inicializar Quagga:", err);
                            return;
                        }
                        Quagga.start();
                    });

                    // Evento para capturar o código de barras lido
                    Quagga.onDetected(function(result) {
                        var code = result.codeResult.code;
                        $("#cod_barras").val(code); // Insere o código no campo
                        Quagga.stop(); // Para a leitura após capturar um código
                        stream.getTracks()[0].stop(); // Parar a câmera
                    });
                })
                .catch(function(err) {
                    console.error("Erro ao acessar a câmera:", err);
                });
            
            // Evento para abrir a câmera ao clicar no botão
            $("#scanButton").click(function() {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                    .then(function(stream) {
                        video.srcObject = stream;
                        video.play();
                        
                        Quagga.init({
                            inputStream: {
                                stream: stream,
                                constraints: {
                                    facingMode: 'environment'
                                }
                            },
                            decoder: {
                                readers: ["code_128_reader"] // Pode adicionar outros tipos de leitores aqui
                            }
                        }, function(err) {
                            if (err) {
                                console.error("Erro ao inicializar Quagga:", err);
                                return;
                            }
                            Quagga.start();
                        });

                        // Evento para capturar o código de barras lido
                        Quagga.onDetected(function(result) {
                            var code = result.codeResult.code;
                            $("#cod_barras").val(code); // Insere o código no campo
                            Quagga.stop(); // Para a leitura após capturar um código
                            stream.getTracks()[0].stop(); // Parar a câmera
                        });
                    })
                    .catch(function(err) {
                        console.error("Erro ao acessar a câmera:", err);
                    });
            });
        });
    </script>
    
    <script>
        // Função para voltar para a página anterior
        function voltar() {
            history.back();
        }
    </script>
    </script>
</body>
</html>
