<?php
class Logout {
    public static function realizarLogout() {
        // Inicie a sessão (se já não estiver iniciada)
        session_start();

        // Destrua todas as variáveis de sessão
        $_SESSION = array();

        // Destrua a sessão
        session_destroy();

        // Redirecione o usuário para a página de login ou outra página desejada após o logout
        header("Location: login.html");
        exit();
    }
}

// Para realizar o logout, chame o método realizarLogout
Logout::realizarLogout();
?>
