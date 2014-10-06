function searchMovieByTitle(movieTitle) {
    $.ajax({
        url: "Movie/searchMoviesByTitle",
        data: { "strTitle": movieTitle },
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

            $("#search-string").text(movieTitle);
            $("a[href='#search-results']").parent().removeClass("hidden");
            $("a[href='#search-results']").click();
        }
    });
}

function advanceSearchMovie(params) {
    if (!params) {
        params = {};
        params.strName = $("#movie-name").val() || "";
        params.nYear = $("#movie-year").val() || 0;
        params.strUserName = "liorbentov";
    }

    $.ajax({
        url: "Movie/searchMovie",
        data: params,
        type: "GET",
        success: function (data) {
            data = JSON.parse(data);

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
            if (!data.Error) {
                data = data.Search;
                var json = [];
                for (i = 0; i < data.length; i++) {
                    if (data.Type == "movie") {
                        json.push([data[i].imdbID, data[i].Title, data[i].Year]);
                    }
                }
                oTable.fnAddData((json));

                $('#movie-search-results tbody')
                    .on('click', 'tr', function (event) {
                        getMovieByID(oTable.fnGetData(this)[0]);
                    });
            }

            $("#search-string").text("");
            $("a[href='#search-results']").parent().removeClass("hidden");
            $("a[href='#search-results']").click();
        }
    });
}

function searchMovie(movieToSearch) {
    movieToSearch = movieToSearch || $("#search-movie-input").val();

    // Get appart the searchParameters
    var params = {};

    // Initialize the params
    params.strName = "";
    params.strDirector = "";
    params.nYear = 0;
    params.nStars = 0;
    params.strUserName = "liorbentov";

    // if the search is just by name, there are no delimitares
    if (movieToSearch.split(";").length == 1) {
        searchMovieByTitle(movieToSearch);
    }
    else {
        res = movieToSearch.split(";");
        params.strName = res[0].split(":")[1] || "";
        params.nYear = res[1].split(":")[1] || 0;

        advanceSearchMovie(params);
    }
}

function getUserSearches() {
    $.ajax({
        url: "Search/getSearchedByUser",
        type: "GET",
        //data: { "strUserName": "liorbentov" },
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

function getCommonSearches() {
    $.ajax({
        url: "Search/getSearchesByName",
        type: "GET",
        success: function (data) {

            if ($.fn.DataTable.isDataTable($('#common-searches'))) {
                var oTable = $('#common-searches').dataTable();
            }
            else {
                var oTable = $('#common-searches').dataTable({
                    "autoWidth": false,
                    "order": [1, "desc"]
                });
            }
            oTable.fnClearTable();

            var json = [];
            for (i = 0; i < data.length; i++) {
                json.push([data[i].Name, data[i].Count]);
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


$("a[href='#searches-common-searches']")
    .on('click', function (event) {
        getAllSearches();
    });

$("a[href='#searches-common-searches']")
    .on('click', function (event) {
        //getCommonSearches();
        commonSearchesGraph()
    });

function commonSearchesGraph() {
    $("#searches-common-searches div").empty();

    var diameter = 360,
        format = d3.format(",d"),
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#searches-common-searches div").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    $.ajax({
        url: "Search/getSearchesByName",
        type: "GET",
        success: function (data) {
            var classes = [];
            for (i = 0; i < data.length; i++) {
                classes.push({ packageName: data[i].Name, className: data[i].Name, value: data[i].Count });
            }

            var node = svg.selectAll(".node")
                .data(bubble.nodes({ children: classes })
                .filter(function (d) { return !d.children; }))
              .enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

            node.append("title")
                .text(function (d) { return d.className + ": " + format(d.value); });

            node.append("circle")
                .attr("r", function (d) { return d.r; })
                .style("fill", function (d) { return color(d.packageName); });

            node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .text(function (d) { return d.className.substring(0, d.r / 3); });
        }
    });

    d3.select(self.frameElement).style("height", diameter + "px");

}

$(document).ready(function () {
    commonSearchesGraph();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm } today = yyyy + '-' + mm + '-' + dd;

    $('#filter-to').attr('max', today);

    $('#filter-to').on('change', function () { $('#filter-from').attr('max', $(this).val()) });
    $('#filter-from').on('change', function () { $('#filter-to').attr('min', $(this).val()) });
});

function filterSearches() {
        params = {};
        params.strSearchString = $("#filter-search-string").val() || "";
        params.dtFrom = $("#filter-from").val() || "";
        params.dtTo = $("#filter-to").val() || "";
        params.strCountry = $("#filter-country").val() || "";


    $.ajax({
        url: "Search/filterSearches",
        data: params,
        type: "GET",
        success: function (data) {
            data = JSON.parse(data);

            /*$("#movie-focused").hide();
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
            if (!data.Error) {
                data = data.Search;
                var json = [];
                for (i = 0; i < data.length; i++) {
                    if (data.Type == "movie") {
                        json.push([data[i].imdbID, data[i].Title, data[i].Year]);
                    }
                }
                oTable.fnAddData((json));

                $('#movie-search-results tbody')
                    .on('click', 'tr', function (event) {
                        getMovieByID(oTable.fnGetData(this)[0]);
                    });
            }

            $("#search-string").text("");
            $("a[href='#search-results']").parent().removeClass("hidden");
            $("a[href='#search-results']").click();
            */
        }
    });
}

// Lior