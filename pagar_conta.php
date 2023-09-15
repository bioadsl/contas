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
    <title>Pagar Conta</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h2>Pagar Conta</h2>
        <?php
        // Verifique se o ID do registro foi passado na URL
        if (isset($_GET['id'])) {
            $id = $_GET['id'];

            // Faça uma consulta para obter o código de barras com base no ID
            require_once 'Conn.php';
            $conexao = new Conn();
            $mysqli = $conexao->getConexao();
            $consulta = "SELECT cod_barras FROM contas WHERE id = $id";
            $resultado = $mysqli->query($consulta);

            if ($resultado && $resultado->num_rows > 0) {
                $conta = $resultado->fetch_assoc();
                $codigoBarras = $conta['cod_barras'];
            } else {
                echo "Registro não encontrado.";
                exit; // Saia do script se o registro não for encontrado
            }
        } else {
            echo "ID do registro não especificado.";
            exit; // Saia do script se o ID do registro não for especificado
        }
        ?>

        <form action="processar_pagamento.php" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <label for="codigoBarras">Código de Barras:</label>
                <!-- Exibir o código de barras obtido do banco de dados -->
                <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" value="<?php echo $codigoBarras; ?>" readonly>
            </div>
            <div class="form-group">
                <label for="dataPagamento">Data de Pagamento:</label>
                <input type="date" class="form-control" id="dataPagamento" name="dataPagamento" required>
            </div>

            <div class="form-group">
                <label for="comprovante">Comprovante de Pagamento:</label>
                <input type="file" class="form-control-file" id="comprovante" name="comprovante" accept=".jfif, .pdf, .jpg, .png" required>
            </div>
            <a href="javascript:history.go(-1);" class="btn btn-secondary">Voltar</a>
            <button type="submit" class="btn btn-primary">Pagar</button>
        </form>
    </div>

    <!-- Adicione os links para os arquivos JavaScript do Bootstrap, se necessário -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    
    <script>
        // Função para voltar para a página anterior
        function voltar() {
            history.back();
        }
    </script>
</body>
</html>
