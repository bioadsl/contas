<?php

class Conn {
    private $host = "localhost"; // Endereço do servidor do banco de dados
    private $usuario = "root"; // Seu usuário do banco de dados
    private $senha = ""; // Sua senha do banco de dados
    private $banco = "controle_contas"; // Nome do banco de dados
    private $conexao;

    public function __construct() {
        $this->conexao = new mysqli($this->host, $this->usuario, $this->senha, $this->banco);
        $this->conexao->set_charset("utf8");

        if ($this->conexao->connect_error) {
            die("Erro na conexão: " . $this->conexao->connect_error);
        }
    }

    public function getConexao() {
        return $this->conexao;
    }

    public function fecharConexao() {
        $this->conexao->close();
    }
}


// require_once 'Conn.php';

// $conexao = new Conn();
// $mysqli = $conexao->getConexao();

// // Aqui você pode usar a variável $mysqli para executar consultas SQL e outras operações no banco de dados.

// $conexao->fecharConexao(); // Não se esqueça de fechar a conexão quando terminar de usá-la.





?>