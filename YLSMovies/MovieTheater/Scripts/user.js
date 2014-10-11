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

// Shirit
function updateAdmin(userName, isManager) {
    $.ajax({
        url: "Account/updateAdmin",
        type: "GET",
        data: {
            "strUserName": userName,
            "isManager": isManager
        },
        success: function (data) {
            if (data) {
                showUsers();
            }
        }
    });
}

// Shirit
function removeUser(userName) {
    $.ajax({
        url: "Account/removeUser",
        type: "GET",
        data: { "strUserName": userName },
        success: function (data) {
            if (data) {
                showUsers();
                $("#message").html($("#message").html() + userName + " was successfully deleted." + "<br>");
            }
        }
    });
}

// Shirit
$("a[href='#admin']")
    .on('click', function (event) {
        showUsers();
    });

function showUsers() {
    $.ajax({
        url: "Account/adminPanel",
        type: "GET",
        data: {
            "strUserName": $("#UserName").val(),
            "strFirstName": $("#FirstName").val(),
            "strLastName": $("#LastName").val()
        },
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

            var adminText;

            var json = [];
            for (i = 0; i < data.length; i++) {
                if (data[i].admin) {
                    adminText = "Demote to user";
                }
                else {
                    adminText = "Promote to administrator";
                }
                json.push([data[i].userName, data[i].firstName, data[i].lastName, data[i].admin,
                          "<a onClick=\"updateAdmin('" + data[i].userName + "', '" +
                                                        (!data[i].admin) + "')\">" + adminText + "<\/a>",
                          "<a onClick=\"removeUser('" + data[i].userName + "')\">Remove User<\/a>"]);
            }

            oTable.fnAddData((json));
        }
    });
}

// Shirit
function getRegister() {

    $.ajax({
        url: "Account/Register",
        type: "GET",
        data: {},
        success: function (data) {
        }
    });
}

// Shirit
$("a[href='#register']")
    .on('click', function (event) {
        getRegister();
    });
