function searchMovie(movieToSearch) {
    movieToSearch = movieToSearch || $("#search-movie-input").val();
    $.ajax({
        url: "Movie/searchMoviesByTitle",
        data: { "strTitle": movieToSearch },
        type: "GET",
        success: function (data) {
            blabla = JSON.parse(data);

            $("#movie-focused").hide();
            $("#movie-search-results").show();
            
            if ($.fn.DataTable.isDataTable($('#movie-search-results'))) {
                var oTable = $('#movie-search-results').dataTable();
            }
            else {
                var oTable = $('#movie-search-results').dataTable({
                    "autoWidth": false,
                    "columnDefs": [{
                        "targets": [0],
                        "visible": false
                    }, {
                        "targets": [1, 2],
                        "width": "50%"
                    }]
                });
            }
            oTable.fnClearTable();

            // Check if there are movies
            if (!blabla.Error) {
                blabla = blabla.Search;
                var json = [];
                for (i = 0; i < blabla.length; i++) {
                    if (blabla[i].Type == 'movie') {
                        json.push([blabla[i].imdbID, blabla[i].Title, blabla[i].Year]);
                    }
                }
                oTable.fnAddData((json));

                $('#movie-search-results tbody')
                    .on('click', 'tr', function (event) {
                        getMovieByID(oTable.fnGetData(this)[0]);
                    });
            }
            
            $("#search-string").text(movieToSearch);
            $("a[href='#search-results']").parent().removeClass("hidden");
            $("a[href='#search-results']").click();
        }
    });
}

function getUserSearches() {
    $.ajax({
        url: "Search/getSearchedByUser",
        type: "GET",
        data: { "strUserName": "liorbentov" },
        success: function (data) {
            regExp = new RegExp(/\((.*?)\)/);

            if ($.fn.DataTable.isDataTable($('#my-searches'))) {
                var oTable = $('#my-searches').dataTable();
            }
            else {
                var oTable = $('#my-searches').dataTable({
                    "autoWidth": false,
                    "columnDefs": [{
                        "targets": [2],
                        "mRender": function (data, type, full) {
                            return "<a onClick=\"searchMovie('" +
                                data + "')\">Search Again</a>";
                        }
                    }]
                });
            }
            oTable.fnClearTable();

            var json = [];
            for (i = 0; i < data.length; i++) {
                json.push([(new Date(data[i].Date.match(regExp)[1] * 1)).toDateString(),
                    data[i].SearchString, data[i].SearchString]);
            }

            oTable.fnAddData((json));

        }
    });
}

function getAllSearches() {
    $.ajax({
        url: "Search/getAllSearches",
        type: "GET",
        success: function (data) {
            regExp = new RegExp(/\((.*?)\)/);
            
            if ($.fn.DataTable.isDataTable($('#all-searches'))) {
                var oTable = $('#all-searches').dataTable();
            }
            else {
                var oTable = $('#all-searches').dataTable({
                    "autoWidth": false,
                    "columnDefs": [{
                        "targets": [2],
                        "mRender": function (data, type, full) {
                            return "<a onClick=\"searchMovie('" +
                                data + "')\">Search Again</a>";
                        }
                    }]
                });
            }
            oTable.fnClearTable();

            var json = [];
            for (i = 0; i < data.length; i++) {
                json.push([(new Date(data[i].Date.match(regExp)[1] * 1)).toDateString(),
                    data[i].SearchString, data[i].SearchString]);
            }

            oTable.fnAddData((json));
        }
    });
}

$("a[href='#searches']")
    .on('click', function (event) {
        getUserSearches();
        getAllSearches();
    });