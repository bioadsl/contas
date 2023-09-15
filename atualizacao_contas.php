<?php
require_once 'Conn.php';

class AtualizacaoContas {
    private $conn;

    public function __construct() {
        $this->conn = new Conn();
    }

    public function atualizarContas() {
        // Parte 1: Script PHP para Atualização e Feedback
        if (isset($_POST['atualizar'])) {
            // Verifique se a conexão com o banco de dados está disponível
            if ($this->conn->getConexao()) {
                // Simulação de atualização (substitua pelo seu código real)
                $totalRegistros = 100; // Substitua pelo número total de registros a serem atualizados

                // Parte 2: Criação do gráfico donut
                echo '<div style="text-align: center;">';
                echo '<canvas id="progressChart" width="200" height="200"></canvas>';
                echo '</div>';

                // Inicialize os dados do gráfico
                echo '<script>
                    var ctx = document.getElementById("progressChart").getContext("2d");
                    var progressData = {
                        datasets: [{
                            data: [0, ' . $totalRegistros . '],
                            backgroundColor: ["#36A2EB", "#FFCE56"]
                        }],
                        labels: ["Atualizados", "Restantes"]
                    };

                    var progressChart = new Chart(ctx, {
                        type: "doughnut",
                        data: progressData,
                        options: {
                            responsive: true, // Torna o gráfico responsivo
                            maintainAspectRatio: false // Permite definir o tamanho do gráfico manualmente
                        }
                    });
                </script>';

                // Parte 3: Feedback de Progresso
                echo '<p>Atualização concluída!</p>';
            } else {
                echo "Erro na conexão com o banco de dados.";
            }
        }
    }
}
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualização de Contas</title>
    <!-- Adicione o link para o Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Adicione o CSS personalizado -->
    <style>
        /* Estilo para fixar o menu no topo */
        #menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #fff; /* Cor de fundo do menu */
            color: #fff; /* Cor do texto do menu */
            margin-left: 16px;
        }

        /* Estilo para dar espaço entre o menu fixo e o conteúdo */
        #conteudo {
            margin-top: 60px; /* Ajuste essa margem conforme necessário */
            padding: 20px;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>

</head>
<body>


<div id="conteudo" class="text-center">
    <h1>Atualização de Contas</h1>

    <?php
    // Instancie a classe de atualização de contas
    $atualizacaoContas = new AtualizacaoContas();

    // Chame o método para atualizar as contas
    $atualizacaoContas->atualizarContas();
    ?>

    <form method="POST">
        <button type="button" class="btn btn-secondary " onclick="voltar()">Voltar</button>
        <button type="submit" name="atualizar" class="btn btn-primary">Atualizar Contas</button>
    </form>
</div>

<!-- Adicione o link para o Bootstrap JS e jQuery (opcional) no final do corpo -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
<script>
	// Função para voltar para a página anterior
	function voltar() {
		history.back();
	}
</script>
</body>
</html>
