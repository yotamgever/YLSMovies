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
                    "strMovieID": ID
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
            "nYear": selectedMovie.Year * 1
        },
        success: function (answer) {
            if (answer == "True") {
                $("#my-movies").append("<span class='col-md-2 savedMovie' id='" + selectedMovie.imdbID +
                    "' onclick='getMovieByID(\"" + selectedMovie.imdbID
                + "\")'>" + selectedMovie.Title +
                "<button type='button' class='close' onclick='removeMovie(\"" + selectedMovie.imdbID +
                "\");'><span aria-hidden='true'>&times;</span></button></span>");
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
            "strMovieID": movieToRemove
        },
        success: function (answer) {
            if (answer == true) {
                $("#my-movies span[id='" + movieToRemove + "']").remove();
                alert("Movie has been removed from your list");
                $("#myModal").modal('toggle');
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
        data: { },
        success: function (data) {

            if (data.length == 0) {
                $("#my-movies").append("<h3>You have no movies on your list</h3>");
            }
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

            var moviesJson = [];
            var moviesRateJson = [];

            for (i = 0; i < data.length; i++) {
                moviesJson.push([data[i].Name, data[i].Year, data[i].Director, data[i].Stars, data[i].IMDBID]);
                moviesRateJson.push({ "text": data[i].Name, "size": data[i].Stars })
            }

            oTable.fnAddData((moviesJson));
            showTopRatedMoviesGraph(moviesRateJson);
        }
    });

}

function showTopRatedMoviesGraph(MoviesRateJson) {
    $("#top-rated-graph").empty();

    var fill = d3.scale.category20();

    d3.layout.cloud().size([1000, 1000])
        .words(MoviesRateJson)
        .padding(5)
        .rotate(function (d) { return ~~(Math.random() * 5) * 30 - 60; })
        .font("Impact")
        .fontSize(function (d) { return (d.size + 1) * 20; })
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select("#top-rated-graph").append("svg")
            .attr("width", 1000)
            .attr("height", 1000)
          .append("g")
            .attr("transform", "translate(500,500)")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function (d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
}

$(document).ready(function () {

    $("#login-message").hide();

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
                    alert("Thank you for rating!");
                }
            });
        });

    showMyMovies();
});
