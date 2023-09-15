<?php
session_start();
require_once 'Conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    $conexao = new Conn();
    $mysqli = $conexao->getConexao();

    // Consulta para buscar o usuário com o email fornecido
    $consulta = "SELECT id, senha, privilegio, status FROM usuarios WHERE email = '$email'";
    $resultado = $mysqli->query($consulta);

    if ($resultado && $resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();

        // Verifica se a senha fornecida coincide com a senha no banco de dados
        if (password_verify($senha, $usuario['senha'])) {
            if ($usuario['status'] === 'inativo') {
                // Redireciona para a página de solicitação de reativação
                header('Location: solicitar_reativacao.php');
                exit; // Certifique-se de sair para evitar redirecionamentos subsequentes
            } else {
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['privilegio'] = $usuario['privilegio'];

                // Redireciona para a página de perfil do usuário ou área admin
                if ($usuario['privilegio'] === 'admin') {
                    header('Location: admin_area.php');
                } else {
                    header('Location: user_area.php');
                }
            }
        } else {
            echo "Senha incorreta.";
        }
    } else {
        echo "Usuário não encontrado.";
    }

    $conexao->fecharConexao();
}

?>
