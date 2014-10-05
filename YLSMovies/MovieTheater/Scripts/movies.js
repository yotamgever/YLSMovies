/*$.ajax({
    url: "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json",
    type: "get",
    success: function (data) {
        var feed = data.feed;
        var entries = feed.entry || [];
        var html = ['<div id="home-page" class="container-fluid">'];
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var title = entry.title.$t;
            var id = entry.id.$t.substring(entry.id.$t.lastIndexOf(":") + 1)
            html.push('<div class="col-md-4"><embed width="280" height="200" src="http://www.youtube.com/v/' + id + '"><p>' + title + '</p></div>');
        }
        html.push("</div>");
        $("#home-page").html(html);
    }
})*/

/*
This function displays the details of the specific movie
 it opens a new modal to do so.
*/
function getMovieByID(ID) {
    $.ajax({
        url: "Movie/getMovieByID",
        data: { "strID": ID },
        type: "GET",
        success: function (data) {
            selectedMovie = JSON.parse(data)
            $(".modal-title").text(selectedMovie.Title);
            $(".small-details span[id='title']").text(selectedMovie.Title);
            $(".small-details span[id='year']").text(selectedMovie.Year);
            $(".small-details p[id='genre']").text(selectedMovie.Genre);
            $(".small-details p[id='director']").text(selectedMovie.Director);
            $(".poster-image").attr("src", selectedMovie.Poster);
            $(".plot").text(selectedMovie.Plot);

            // reset the rating
            $("input:checked").attr('checked', false);

            // reset the footer buttons
            $(".modal-footer div[id='buttons']")
                .empty()
                .append(
                "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>");

            $.ajax({
                url: "Movie/isTheMovieOnMyList",
                data: {
                    "strMovieID": ID,
                    "strUserName": "liorbentov"
                },
                type: "GET",
                success: function (data) {
                    if (data == 'True') {
                        $(".modal-footer div[id='buttons']").append(
                            "<button type='button' class='btn btn-danger' onclick='removeMovie()'>Remove Movie From my List</button>");
                        $(".rating-wrap").show();
                        $.ajax({
                            url: "Movie/getMovieStars",
                            type: "GET",
                            data: {
                                "strMovieID": ID
                            },
                            success: function (data) {
                                if (data != "-1") {
                                    $("input[type='radio'][value='" + Number.parseInt(data) + "']").attr(
                                        'checked', true);
                                }
                            }
                        });
                    }
                    else {
                        $(".modal-footer div[id='buttons']").append(
                            "<button type='button' class='btn btn-primary' onclick='addMovie()'>Add Movie To List</button>");
                        $(".rating-wrap").hide();
                    }
                },
                error: function (data) {
                    console.log("error");
                }
            });

            $("#myModal").modal('show');
        }
    });
}

function addMovie() {
    $.ajax({
        url: "Movie/addNewMovieToUser",
        type: "POST",
        data: {
            "strIMDBID": selectedMovie.imdbID,
            "strName": selectedMovie.Title,
            "strDirector": selectedMovie.Director,
            "nYear": selectedMovie.Year * 1,
            "strUserName": "liorbentov"
        },
        success: function (answer) {
            if (answer == "True") {
                $("#my-movies").append("<span class='col-md-2 savedMovie' id='" + selectedMovie.imdbID +
                    "' onclick='getMovieByID(\"" + selectedMovie.imdbID
                + "\")'>" + selectedMovie.Title +
                "<button type='button' class='close' onclick='removeMovie(\"" + selectedMovie.imdbID +
                "\");'><span aria-hidden='true'>&times;</span></button></span>");
                debugger;
                $("#myModal").modal('toggle');
                $("a[href='#movies-my-movies']").click();
            }
        }
    });
}


function removeMovie(movieToRemove) {
    movieToRemove = movieToRemove || selectedMovie.imdbID;
    $.ajax({
        url: "Movie/removeMovieFromUserList",
        type: "POST",
        data: {
            "strMovieID": movieToRemove,
            "strUserName": "liorbentov"
        },
        success: function (answer) {
            if (answer == true) {
                $("#my-movies span[id='" + movieToRemove + "']").remove();
            }
        }
    });
}

function backToSearchResults() {
    $("#movie-focused").hide();
    $("#movie-search-results").show();
}

function showMyMovies() {
    $.ajax({
        url: "Movie/getMyMovies",
        type: "GET",
        data: { "strUserName": "liorbentov" },
        success: function (data) {

            for (i = 0; i < data.length; i++) {
                $("#my-movies").append("<span class='col-md-2 savedMovie' id='" + data[i].IMDBID +
                    "' onclick='getMovieByID(\"" + data[i].IMDBID
                    + "\")'>" + data[i].Name +
                    "<button type='button' class='close' onclick='removeMovie(\"" + data[i].IMDBID +
                    "\");'><span aria-hidden='true'>&times;</span></button></span>");
            }

            $("#my-movies button").click(function (event) {
                event.stopPropagation();
            });
        }
    });
}

function showTopRatedMovies() {
    $.ajax({
        url: "Movie/getTopRatedMovies",
        type: "GET",
        success: function (data) {
            console.log(data);
            if ($.fn.DataTable.isDataTable($('#top-rated'))) {
                var oTable = $('#top-rated').dataTable();
            }
            else {
                var oTable = $('#top-rated').dataTable({
                    "autoWidth": false,
                    "ordering": false,
                    "columnDefs": [{
                        "targets": [4],
                        "mRender": function (data, type, full) {
                            return "<a onClick=\"getMovieByID('" +
                                data + "')\">See Details</a>";
                        }
                    }]
                });
            }
            oTable.fnClearTable();

            var json = [];
            for (i = 0; i < data.length; i++) {
                json.push([data[i].Name, data[i].Year, data[i].Director, data[i].Stars, data[i].IMDBID]);
            }

            oTable.fnAddData((json));
        }
    });

}

function Shtuty() {
    $.ajax({
        url: "Movie/getMostWatchesMovies",
        type: "GET",
        success: function (data) {
            blablabla = data;
        }
    });
}

$(document).ready(function () {
    // When the user clicks on any option other than Search-Results, the tab disappears
    $("a[role='tab']").each(function () {
        if ($(this).text() != 'Search Results')
            $(this).on("click", function () {
                $("a[href='#search-results']").parent().addClass("hidden");
            });
    });

    $("a[href='#movies-top-rated']").on('click', function () {
        showTopRatedMovies();
    });

    // Handle the stars rating
    $("input[type='radio']").on(
        'change', function () {
            $.ajax({
                url: "Movie/updateStars",
                type: "PUT",
                data: {
                    strMovieID: selectedMovie.imdbID,
                    nStars: $(this)[0].value
                },
                success: function (data) {
                    console.log(data);
                }
            });
        });

    showMyMovies();
});

var width = 960,
    height = 500;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select("body")
    .attr("width", width)
    .attr("height", height);

$.ajax({
    url: "Movie/getTopRatedMovies",
    type: "GET",
    success: function (data) {
        x.domain(data.map(function (d) { return d.Name; }));
        y.domain([0, d3.max(data, function (d) { return d.Stars; })]);

        var bar = chart.selectAll("g")
            .data(data)
          .enter().append("g")
            .attr("transform", function (d) { return "translate(" + x(d.Name) + ",0)"; });

        bar.append("rect")
            .attr("y", function (d) { return y(d.Stars); })
            .attr("height", function (d) { return height - y(d.Stars); })
            .attr("width", x.rangeBand());

        bar.append("text")
            .attr("x", x.rangeBand() / 2)
            .attr("y", function (d) { return y(d.Stars) + 3; })
            .attr("dy", ".75em")
            .text(function (d) { return d.Stars; });
    }
});

function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}

