<?php
session_start();
require_once 'Conn.php';

// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $idUsuario = $_GET['id'];

    $conexao = new Conn();
    $mysqli = $conexao->getConexao();

    // Verifique se o usuário existe antes de inativá-lo
    $verificarUsuario = "SELECT * FROM usuarios WHERE id = '$idUsuario'";
    $resultado = $mysqli->query($verificarUsuario);

    if ($resultado && $resultado->num_rows === 1) {
        // O usuário existe, então defina o status como "inativo"
        $atualizarStatus = "UPDATE usuarios SET status = 'inativo' WHERE id = '$idUsuario'";
        if ($mysqli->query($atualizarStatus)) {
            // Inativação bem-sucedida, redireciona de volta para a página de consulta de usuários
            header("Location: consulta_usuario.php");
            exit;
        } else {
            echo "Erro ao inativar o usuário.";
        }
    } else {
        echo "Usuário não encontrado.";
    }

    $conexao->fecharConexao();
}
?>
