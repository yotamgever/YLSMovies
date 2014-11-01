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