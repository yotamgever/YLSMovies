function login() {
    $.ajax({
        url: "Account/Login",
        type: "POST",
        data: {
            '__RequestVerificationToken': $("input[name='__RequestVerificationToken']").val(),
            strUserName: $("#login-username").val(),
            strPassword: $("#login-password").val(),
            bRememberMe: ($("#login-remember:checked").length == 1 ? true : false)
        },
        success: function (data) {
            if (data == "") {
                location.reload();
                $("a[href='#movies-my-movies']").click();
            }
            else {
                $("#login-message")
                    .text(data)
                    .show();

            }
        }
    });
}

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