
$("a[href='#searches-my-searches']")
    .on('click', function (event) {
        getUserSearches();
    });

$("a[href='#searches-all-searches']")
    .on('click', function (event) {
        getAllSearches();
    });

$("a[href='#searches-graph']")
    .on('click', function (event) {
        commonSearchesGraph()
    });

$("a[href='#searches-filter-searches']")
    .on('click', function (event) {
        $("#searches-filter-results").hide();
        $("#searches-filter-searches form")[0].reset();
        $("#searches-filter-searches form").show();
    });

$(function () {
    $('#filter-country').autocomplete({
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
