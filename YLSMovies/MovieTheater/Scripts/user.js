// Shirit
function addAdmin(userName) {
    $.ajax({
        url: "Account/addAdmin",
        type: "GET",
        data: { "strUserName": userName },
        success: function (data) {
        }
    });
}
// Shirit
function getAdminPanel() {
    // $("#sv-log").html($("#sv-log").html() + "shirit 1" + "<br>");
    $.ajax({
        url: "Home/getAdminPanel",
        type: "GET",
        data: {},
        success: function (data) {
            regExp = new RegExp(/\((.*?)\)/);

            if ($.fn.DataTable.isDataTable($('#admin-Panel'))) {
                var oTable = $('#admin-Panel').dataTable();
            }
            else {
                var oTable = $('#admin-Panel').dataTable({
                    "autoWidth": false,
                    "columnDefs": [{
                        "targets": [5]
                    }]
                });
            }
            oTable.fnClearTable();

            var json = [];
            for (i = 0; i < data.length; i++) {
                json.push([data[i].userName,
                    data[i].firstName, data[i].lastName, data[i].admin,
                    data[i].moviesNum,
                          "<a onClick=\"addAdmin('" + data[i].userName + "')\">Defining administrator<\/a>"]);
            }

            oTable.fnAddData((json));
        }
    });
}
// Shirit
$("a[href='#admin']")
    .on('click', function (event) {
        getAdminPanel();
    });