<?php
require_once 'Conn.php';

class CadastroUsuario {
    private $conn;

    public function __construct() {
        $this->conn = new Conn();
    }

    public function cadastrarUsuario($nome, $email, $senha) {
        // Verifique se a conexão com o banco de dados está disponível
        if ($this->conn->getConexao()) {
            // Verifique se o email já está em uso
            if ($this->verificarEmailExistente($email)) {
                return "Este email já está em uso. Por favor, escolha outro.";
            }

            // Criptografa a senha
            $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

            // Defina o status como ativo por padrão
            $status = 'ativo';

            $mysqli = $this->conn->getConexao();

            // Insere o novo usuário no banco de dados
            $insercao = "INSERT INTO usuarios (nome, email, senha, privilegio, status) VALUES (?, ?, ?, ?, ?)";
            $stmt = $mysqli->prepare($insercao);

            if ($stmt) {
                // Bind dos parâmetros
                $stmt->bind_param("sssss", $nome, $email, $senhaHash, $status, $status);

                if ($stmt->execute()) {
                    $stmt->close();
                    $this->conn->fecharConexao();
                    header("Location: login.html"); // Redireciona para login.html após o cadastro
                    exit;
                } else {
                    return "Erro ao cadastrar usuário: " . $stmt->error;
                }
            } else {
                return "Erro na preparação da consulta: " . $mysqli->error;
            }
        } else {
            return "Erro na conexão com o banco de dados.";
        }
    }

    private function verificarEmailExistente($email) {
        $mysqli = $this->conn->getConexao();
        $consulta = "SELECT id FROM usuarios WHERE email = ?";
        $stmt = $mysqli->prepare($consulta);
        
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();
            $numLinhas = $stmt->num_rows;
            $stmt->close();
            return $numLinhas > 0;
        } else {
            return false;
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha']; // A senha não precisa ser criptografada aqui
    $cadastroUsuario = new CadastroUsuario();
    $resultado = $cadastroUsuario->cadastrarUsuario($nome, $email, $senha);
    
    if (is_string($resultado)) {
        echo $resultado; // Exibir mensagem de erro, se houver
    }
}
?>
