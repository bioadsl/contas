<?php
session_start();
require_once 'Conn.php';

// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha']; // A senha fornecida pelo formulário

    // Verifique se uma nova senha foi fornecida
    if (!empty($senha)) {
        // Criptografar a nova senha
        $senha = password_hash($senha, PASSWORD_BCRYPT);
    } else {
        // Se nenhuma nova senha foi fornecida, obtenha a senha existente do banco de dados
        $conexao = new Conn();
        $mysqli = $conexao->getConexao();
        $consultaSenha = "SELECT senha FROM usuarios WHERE id = '$id'";
        $resultadoSenha = $mysqli->query($consultaSenha);

        if ($resultadoSenha && $resultadoSenha->num_rows === 1) {
            $row = $resultadoSenha->fetch_assoc();
            $senha = $row['senha'];
        } else {
            echo "Erro ao obter a senha existente.";
            exit;
        }

        $conexao->fecharConexao();
    }

    $privilegio = $_POST['privilegio'];
    $status = $_POST['status'];

    // Lidar com o envio da nova imagem de perfil
    if ($_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        $nomeArquivo = $_FILES['foto_perfil']['name'];
        $caminhoArquivo = "Assets/uploads/".$nomeArquivo; // Altere para o diretório correto
        move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $caminhoArquivo);
    } else {
        // Se nenhuma nova imagem for enviada, mantenha a imagem existente
        $conexao = new Conn();
        $mysqli = $conexao->getConexao();
        $consultaImagem = "SELECT foto_perfil FROM usuarios WHERE id = '$id'";
        $resultadoImagem = $mysqli->query($consultaImagem);

        if ($resultadoImagem && $resultadoImagem->num_rows === 1) {
            $row = $resultadoImagem->fetch_assoc();
            $caminhoArquivo = $row['foto_perfil'];
        } else {
            echo "Erro ao obter a imagem de perfil existente.";
            exit;
        }

        $conexao->fecharConexao();
    }

    $conexao = new Conn();
    $mysqli = $conexao->getConexao();

    // Atualizar o usuário no banco de dados
    $atualizarUsuario = "UPDATE usuarios SET nome = '$nome', email = '$email', senha = '$senha', privilegio = '$privilegio', status = '$status', foto_perfil = '$caminhoArquivo' WHERE id = '$id'";
    
    if ($mysqli->query($atualizarUsuario)) {
        // Atualização bem-sucedida, redirecionar para a página de consulta de usuários
        header("Location: consulta_usuario.php");
        exit();
    } else {
        echo "Erro ao atualizar o usuário.";
    }

    $conexao->fecharConexao();
}
?>
