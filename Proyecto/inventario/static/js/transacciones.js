$(document).ready(function () {
    // Initialize DataTable
    if ($('#tabla-transacciones').length > 0) {
        $('#tabla-transacciones').DataTable({
            "bFilter": true,
            "sDom": 'fBtlpi',
            "ordering": true,
            "language": {
                search: ' ',
                sLengthMenu: '_MENU_',
                searchPlaceholder: "Buscar...",
                info: "_START_ - _END_ de _TOTAL_ items",
                paginate: {
                    next: ' <i class="fa fa-angle-right"></i>',
                    previous: '<i class="fa fa-angle-left"></i> '
                }
            },
            initComplete: (settings, json) => {
                $('.dataTables_filter').appendTo('.search-input');
                $('.dataTables_filter label').contents().filter(function () {
                    return this.nodeType === 3;
                }).remove();
            }
        });
    }

    // Export PDF
    $(document).on('click', '.export-pdf', function () {
        console.log("Exporting to PDF...");
        // Placeholder for real export logic
    });

    // Export Excel
    $(document).on('click', '.export-excel', function () {
        console.log("Exporting to Excel...");
        // Placeholder for real export logic
    });

    // Export Print
    $(document).on('click', '.export-print', function () {
        window.print();
    });

    // Toggle Filter
    $(document).on('click', '#filter_search', function () {
        $('#filter_inputs').slideToggle("slow");
    });
});
