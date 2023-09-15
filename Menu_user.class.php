<?php
require_once 'Conn.php';
// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.html");
    exit;
}

class Menu {
    public static function render() {
        echo '
        <head>
            <style>
                .navbar  {
                    justify-content-center
                    }
            </style>    
        </head>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Área Comum</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">

                    <li class="nav-item">
                        <a class="nav-link" href="editar_usuario.php?id='.$_SESSION['usuario_id'].'">Editar Usuario</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="recuperar_senha.php">Recuperar Senha</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="perfil_usuario.php">Perfil do Usuario</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="logout.php">Logout</a>
                    </li>
                </ul>
            </div>
        </nav>';
    }
}
?>