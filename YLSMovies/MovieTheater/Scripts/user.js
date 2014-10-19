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
            alert("Registration Success!");
            setTimeout(function () { location.reload(); }, 1000);
        }
    });
}

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
$("a[href='#admin-user']")
    .on('click', function (event) {
        showUsers();
    });

function showUsers() {
    $.ajax({
        url: "Account/userManagement",
        type: "GET",
        data: {
            "strUserName": $("#UserName").val(),
            "strFirstName": $("#FirstName").val(),
            "strLastName": $("#LastName").val()
        },
        success: function (data) {

            // Shirit 101014
            if ($.fn.DataTable.isDataTable($('#admin-Panel-users'))) {
                var oTable = $('#admin-Panel-users').dataTable();
            }
            else {
                var oTable = $('#admin-Panel-users').dataTable({
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

// Shirit
function removeMovieFromSystem(id) {
    $.ajax({
        url: "Movie/removeMovieByID",
        type: "GET",
        data: { "mID": id },
        success: function (data) {
            if (data) {
                $("#messageMovie").html($("#messageMovie").html() + "The movie was successfully deleted." + "<br>");
                $("#my-movies span[id='" + id + "']").remove();
                showMovies();
            }
        }
    });
}

// Shirit
$("a[href='#admin-movies']")
    .on('click', function (event) {
        showMovies();
    });

function showMovies() {
    $.ajax({
        url: "Movie/getMovies",
        type: "GET",
        data: {},
        success: function (data) {

            // Shirit 101014
            if ($.fn.DataTable.isDataTable($('#admin-Panel-movies'))) {
                var oTable = $('#admin-Panel-movies').dataTable();
            }
            else {
                var oTable = $('#admin-Panel-movies').dataTable({
                    "autoWidth": false,
                    "columnDefs": [{
                        "targets": [5]
                    }]
                });
            }
            oTable.fnClearTable();

            var json = [];
            for (i = 0; i < data.length; i++) {
                json.push([data[i].Name, data[i].Year, data[i].Director, data[i].Stars, data[i].Votes,
                          "<a onClick=\"removeMovieFromSystem('" + data[i].IMDBID + "')\">Remove Movie<\/a>"]);
            }

            oTable.fnAddData((json));
        }
    });
}

// Shirit
function removeSearchFromSystem(search) {
    $.ajax({
        url: "Search/removeSearch",
        type: "GET",
        data: { "nSearech": search },
        success: function (data) {
            if (data) {
                $("#messageSearch").html($("#messageSearch").html() + "The search was successfully deleted." + "<br>");
                showSearches();
            }
        }
    });
}

// Shirit
$("a[href='#admin-searches']")
    .on('click', function (event) {
        showSearches();
    });

function showSearches() {
    $.ajax({
        url: "Search/getAllSearches",
        type: "GET",
        success: function (data) {
            $("#message").html($("#message").html() + "Shirittttttttttttttttttttttttttt." + "<br>");
            regExp = new RegExp(/\((.*?)\)/);

            if ($.fn.DataTable.isDataTable($('#admin-Panel-searches'))) {
                var oTable = $('#admin-Panel-searches').dataTable();
            }
            else {
                var oTable = $('#admin-Panel-searches').dataTable({
                    "autoWidth": false,
                    "columnDefs": [{
                        "targets": [3]
                    }]
                });
            }
            oTable.fnClearTable();

            var json = [];
            for (i = 0; i < data.length; i++) {
                json.push([(new Date(data[i].Date.match(regExp)[1] * 1)).toDateString(),
                    data[i].SearchString,
                    "<a onClick=\"removeSearchFromSystem('" + data[i].SearchID + "')\">Remove Search<\/a>",
                    "<a onClick=\"searchMovie('" + data[i].SearchString + "')\">Search Again</a>"
                ]);
            }

            oTable.fnAddData((json));
        }
    });
}