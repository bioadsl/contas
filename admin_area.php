<?php
session_start();
require_once 'Conn.php';

// Verificar se o usuário está logado, caso contrário, redirecionar para a página de login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}

// Função para buscar os eventos do banco de dados
function buscarEventosDoBanco() {
    $eventos = array(); // Inicializa um array vazio para os eventos

    // Conecte-se ao banco de dados
    $conexao = new Conn();
    $mysqli = $conexao->getConexao();

    // Consulta SQL para buscar os eventos (contas)
    $consulta = "SELECT id, empresa, vencimento, status FROM contas";
    $resultado = $mysqli->query($consulta);

    if ($resultado && $resultado->num_rows > 0) {
        while ($conta = $resultado->fetch_assoc()) {
            // Formate os dados para o formato do FullCalendar
            $evento = array(
                'title' => $conta['empresa'],
                'start' => $conta['vencimento'],
                'color' => definirCorComBaseNoStatus($conta['status'], $conta['vencimento']),
            );

            // Adicione o evento ao array de eventos
            $eventos[] = $evento;
        }
    }

    // Feche a conexão com o banco de dados
    $conexao->fecharConexao();

    return $eventos;
}

// Função para definir a cor com base no status
function definirCorComBaseNoStatus($status, $vencimento) {
    $hoje = new DateTime(); // Data de hoje
    $vencimento = new DateTime($vencimento); // Data de vencimento da conta
    $diferenca = $hoje->diff($vencimento); // Calcula a diferença entre hoje e a data de vencimento

    // Lógica para mapear o status e a diferença de dias para uma cor
    if ($status === 'aberta') {
        if ($diferenca->days === 0) {
            return 'red'; // Vencimento até 0 dias (hoje)
        } elseif ($diferenca->days === 1) {
            return 'orange'; // Vencimento em 1 dia
        } elseif ($diferenca->days <= 2) {
            return 'gold'; // Vencimento em até 2 dias
        } elseif ($diferenca->days <= 3) {
            return 'yellow'; // Vencimento em até 3 dias
        } else {
            return 'white'; // Vencimento em até 4 dias ou mais
        }
    } elseif ($status === 'paga') {
        return 'green'; // Contas pagas
    } elseif ($status === 'vencida') {
        return 'gray'; // Contas vencidas
    }

    // Se nenhum dos casos acima corresponder, retorne uma cor padrão
    return 'blue';
}

// Chame a função para buscar os eventos
$eventos = buscarEventosDoBanco();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Calendário de Contas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Adicione os links para os arquivos CSS do Bootstrap e FullCalendar -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link href='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.css' rel='stylesheet' />
</head>
<body>

    <?php
    require_once 'Menu.class.php';
    Menu::render();
    ?>

    <div class="container-fluid mt-5">
        <!-- Conteúdo da página do calendário -->
        <h2>Calendário de Contas</h2>

        <!-- Adicione um elemento onde você deseja exibir o calendário -->
        <div class="col-lx-6" style="margin-bottom: 50px;" id='calendar'></div>
    </div>

    <!-- Adicione os links para os arquivos JavaScript do Bootstrap, jQuery e FullCalendar -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.js'></script>
    
    <script>
        
    // Configurar o calendário
    $(document).ready(function() {
        $('#calendar').fullCalendar({
            // Configurações do calendário
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month'
                // right: 'month,agendaWeek,agendaDay'
            },
            // Eventos (contas) a serem exibidos no calendário (passados da variável PHP)
            events: <?php echo json_encode($eventos); ?>,
            eventRender: function(event, element) {
                // Verificar se a cor do evento é amarela
                if (event.color === 'yellow' || event.color === 'gold') {
                    // Definir a cor do texto como preto
                    element.css('color', 'black');
                }
            }
        });
    });
    </script>

</body>
</html>
