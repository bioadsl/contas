<?php
require_once "Conn.php"; // Inclua a classe de conexão

// Conecte-se ao banco de dados
$conn = new Conn();
$mysqli = $conn->getConexao();

// ID do usuário
$userId = 1;

// Número de resultados por página
$resultadosPorPagina = 10; // Você pode ajustar este valor conforme necessário

// Página atual (padrão é a página 1)
$pagina = isset($_GET['page']) ? $_GET['page'] : 1;

// Calcule o offset com base na página atual
$offset = ($pagina - 1) * $resultadosPorPagina;

// Construa a consulta SQL com base nos filtros e na paginação
$empresa = $_POST['empresa'];
$status = $_POST['status'];
$vencimento = $_POST['vencimento'];

$sql = "SELECT * FROM contas WHERE user_id = ?";

if ($empresa != '') {
    $sql .= " AND empresa LIKE '%$empresa%'";
}

if ($status != 'todos') {
    $sql .= " AND status = '$status'";
}

if ($vencimento != '') {
    $sql .= " AND vencimento = '$vencimento'";
}

// Conte o número total de registros (para a paginação)
$totalRegistros = $mysqli->query($sql)->num_rows;

$sql .= " LIMIT ? OFFSET ?";

// Preparar e executar a declaração com os parâmetros
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("", $userId, $empresa, $status, $vencimento, $resultadosPorPagina, $offset);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['empresa'] . "</td>";
        echo "<td>" . $row['cod_barras'] . "</td>";
        echo "<td>" . $row['vencimento'] . "</td>";
        echo "<td>" . $row['valor'] . "</td>";
        echo "<td>" . $row['status'] . "</td>";
        echo "<td><a href='editar_conta.php?id=" . $row['id'] . "'>Editar</a></td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='6'>Nenhum resultado encontrado.</td></tr>";
}

$stmt->close();

// Calcula o número de páginas
$numPaginas = ceil($totalRegistros / $resultadosPorPagina);

// Exibe a navegação da página
echo "<div class='pagination'>";
for ($i = 1; $i <= $numPaginas; $i++) {
    echo "<a href='buscar_contas.php?page=$i'>$i</a>";
}
echo "</div>";

$mysqli->close();
?>
