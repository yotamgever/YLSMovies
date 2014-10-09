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

$('#register-country').autocomplete({
    source: function (request, response) {
        $.ajax({
            url: 'Country/getAllCountries',
            type: 'GET',
            dataType: 'json',
            data: request,
            success: function (data) {
                response($.map(data, function (value, key) {
                    return {
                        label: value.Name,
                        value: value.Name
                    };
                }));
            }
        });
    },
    minLength: 2
});

function register() {
    debugger;
    $.ajax({
        url: "Account/Register",
        type: "POST",
        data: {
            strFirstName: $("#register-firstname").val(),
            strLastName: $("#register-lastname").val(),
            strBirthDate: $("#register-birthdate").val(),
            strCountry: $("#register-country").val(),
            strUserName: $("#register-username").val(),
            strPassword: $("#register-password").val()
        },
        success: function (data) {
            console.log("success");
        }
    });
}