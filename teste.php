<!DOCTYPE html>
<html>
<head>
    <title>Tabela de Alertas de Vencimento</title>
    <meta charset="UTF-8">
    <!-- Adicione os links para os arquivos CSS do Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        /* Estilos para centralizar o conteúdo na célula da tabela */
        .text-center-vertically {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h2>Tabela de Alertas de Vencimento</h2>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Data de Vencimento</th>
                    <th>Alerta</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Conta de Eletricidade</td>
                    <td>2023-09-10</td>
                    <td class="text-center-vertically">
                        <div class="alert alert-success" role="alert">
                            <div class="circle-green"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Aluguel</td>
                    <td>2023-09-15</td>
                    <td class="text-center-vertically">
                        <div class="alert alert-warning" role="alert">
                            <div class="circle-yellow"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Internet</td>
                    <td>2023-09-17</td>
                    <td class="text-center-vertically">
                        <div class="alert alert-danger" role="alert">
                            <div class="circle-red"></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Adicione os links para os arquivos JavaScript do Bootstrap, se necessário -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
