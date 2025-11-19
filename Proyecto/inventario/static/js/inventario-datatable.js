;(function($){
    $(function(){
        var $table = $('.datanew');
        if ($table.length === 0) return;

        var table;

        // Evitar re-inicializar la misma tabla (previene "Cannot reinitialise DataTable")
        if ($.fn.DataTable.isDataTable($table[0])) {
            table = $table.DataTable();
        } else {
            table = $table.DataTable({
                language: {
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "Mostrando 0 a 0 de 0 registros",
                paginate: { previous: "Anterior", next: "Siguiente" },
                zeroRecords: "No se encontraron registros",
                },
                pageLength: 10,
                responsive: true,
                columnDefs: [
                    { orderable: false, targets: [0, -1] }
                ]
            });
        }

        // Añadir input de búsqueda en la sección .search-input si no existe
     //   var $searchWrap = $('.search-input');
    //    if ($searchWrap.length) {
     //       if ($searchWrap.find('#table-search').length === 0) {
          //      var $inp = $('<input id="table-search" class="form-control" placeholder="Buscar en la tabla...">');
           //     $searchWrap.prepend($inp);
           //     $inp.on('input', function(){ table.search(this.value).draw(); });
      //      } else {
            //    $('#table-search').on('input', function(){ table.search(this.value).draw(); });
      //      }
      //  }

        // Selección de filas (simulación de checkbox si no hay checkboxes por fila)
        var $selectAll = $('#select-all');
        if ($selectAll.length) {
            $selectAll.on('change', function(){
                var checked = this.checked;
                $table.find('tbody tr').each(function(){
                    $(this).toggleClass('selected', checked);
                });
            });

            $table.on('click', 'tbody tr', function(){
                $(this).toggleClass('selected');
                var all = $table.find('tbody tr').length === $table.find('tbody tr.selected').length;
                $selectAll.prop('checked', all);
            });
        }

        // Exportar CSV (se descarga lo filtrado/visible)
        function exportTableToCSV(filename) {
            var rows = [];
            var headers = [];
            $table.find('thead th').each(function(){ headers.push($(this).text().trim()); });
            rows.push(headers.join(','));

            var data = table.rows({ search: 'applied' }).nodes();
            $(data).each(function(){
                var cols = [];
                $(this).find('td').each(function(){
                    var text = $(this).text().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                    // Escape quotes
                    if (text.indexOf(',') !== -1 || text.indexOf('"') !== -1) {
                        text = '"' + text.replace(/"/g, '""') + '"';
                    }
                    cols.push(text);
                });
                rows.push(cols.join(','));
            });

            var csv = rows.join('\n');
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement('a');
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }

        // Exportar a Excel (usa un archivo .xls con HTML para compatibilidad rápida con Excel)
        function exportTableToExcel(filename) {
            var cloned = $table.clone();
            // Remover inputs/checkboxes del clone y mantener texto
            cloned.find('input').each(function(){ $(this).replaceWith($(this).is(':checkbox') ? ($(this).is(':checked') ? '✓' : '') : $(this).val()); });
            var html = '<html><head><meta charset="utf-8"></head><body>' + cloned.prop('outerHTML') + '</body></html>';
            var blob = new Blob([html], { type: 'application/vnd.ms-excel' });
            var link = document.createElement('a');
            var url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
        }

        // Imprimir tabla (solo lo filtrado)
        // Si mode === 'pdf' abre el diálogo de impresión con un título indicando export PDF
        function printTable(mode) {
            var title = mode === 'pdf' ? 'Inventario - Exportar a PDF' : 'Inventario - Imprimir';
            var newWin = window.open('', '', 'width=900,height=600');
            var html = '<html><head><title>' + title + '</title>' +
                '<style>body{font-family:Arial,Helvetica,sans-serif;margin:20px;}h3{margin-bottom:10px;}table{border-collapse:collapse;width:100%;}td,th{border:1px solid #ccc;padding:6px;text-align:left;}@media print{ a, .no-print{display:none;} }</style>' +
                '</head><body>';
            html += '<h3>' + title + '</h3>';
            html += $table.clone().prop('outerHTML');
            html += '</body></html>';
            newWin.document.open();
            newWin.document.write(html);
            newWin.document.close();
            newWin.focus();
            setTimeout(function(){ newWin.print(); newWin.close(); }, 500);
        }

        // Enlazar iconos de export (usa atributos title en el template)
        // Primero: PDF -> abre diálogo de impresión listo para "Guardar como PDF"
        $('.wordset a[title="pdf"]').on('click', function(e){ e.preventDefault(); printTable('pdf'); });
        // Segundo: Excel -> descarga archivo compatible con Excel
        $('.wordset a[title="excel"]').on('click', function(e){ e.preventDefault(); exportTableToExcel('inventario.xls'); });
        // Tercero: Imprimir -> abrir diálogo de impresión normal
        $('.wordset a[title="print"]').on('click', function(e){ e.preventDefault(); printTable('print'); });

    });
})(jQuery);
