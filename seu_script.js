$(document).ready(function() {
    carregarContas();

    $("#btnFiltrar").click(function() {
        carregarContas();
    });

    function carregarContas() {
        var filtroEmpresa = $("#filtroEmpresa").val();
        var filtroStatus = $("#filtroStatus").val();
        var filtroVencimento = $("#filtroVencimento").val();

        // Faça uma solicitação AJAX para o servidor para buscar os resultados da consulta
        $.ajax({
            url: "buscar_contas.php",
            method: "POST",
            data: { empresa: filtroEmpresa, status: filtroStatus, vencimento: filtroVencimento },
            success: function(data) {
                $("#tabelaContas").html(data);
            }
        });
    }
});
