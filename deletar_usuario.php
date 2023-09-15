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

    // Excluir o usuário com o ID fornecido
    $excluirUsuario = "DELETE FROM usuarios WHERE id = '$idUsuario'";
    if ($mysqli->query($excluirUsuario)) {
        // Exclusão bem-sucedida, redireciona de volta para a página de consulta de usuários
        header("Location: consulta_usuario.php");
        exit;
    } else {
        echo "Erro ao excluir o usuário.";
    }

    $conexao->fecharConexao();
}
?>
