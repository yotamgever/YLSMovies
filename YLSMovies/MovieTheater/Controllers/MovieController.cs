using MovieTheater.Models;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace MovieTheater.Controllers
{
    public class MovieController : Controller
    {
        public Movie m = new Movie();
        public UserMovie um = new UserMovie();

        //
        // GET: /Movie/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MovieGeneral()
        {
            return View();
        }

        //
        [HttpPost]
        public bool addNewMovieToUser(String strIMDBID, String strName, String strDirector, Int32 nYear)
        {
            Movie movieToAdd = new Movie { IMDBID = strIMDBID, Name = strName, Director = strDirector, Year = nYear };
            return UserMovie.addNewMovieToUser(movieToAdd, User.Identity.Name);
        }

        public JsonResult searchMoviesByTitle(String strTitle)
        {
            // Only if the user is logged-in, the search will be saved
            if (User.Identity.IsAuthenticated)
            {
                Search s = new Search();
                IQueryable<Search> searches = s.getSearchesOfUser(User.Identity.Name);
                IQueryable<Search> specific = searches.Where(c => c.SearchString == strTitle);

                if (specific.Count() > 0)
                {
                    foreach (Search curr in specific)
                    {
                        curr.updateSearch();
                    }
                }
                else
                {
                    s.addSearch(new Search { UserName = User.Identity.Name, SearchString = strTitle, Date = DateTime.Now });
                }

            }
            return Json(m.searchMovie(strTitle), JsonRequestBehavior.AllowGet);
        }

        public JsonResult searchMovie(String strName, Int32 nYear)
        {
            String strSearchString = "Name:" + strName + ";Year:" + nYear;
            
            // if user is logged in
            if (User.Identity.IsAuthenticated)
            {
                Search s = new Search();
                IQueryable<Search> searches = s.getSearchesOfUser(User.Identity.Name);
                IQueryable<Search> specific = searches.Where(c => c.SearchString == strSearchString);

                if (specific.Count() > 0)
                {
                    foreach (Search curr in specific)
                    {
                        curr.updateSearch();
                    }
                }
                else
                {
                    s.addSearch(new Search { UserName = User.Identity.Name, SearchString = strSearchString, Date = DateTime.Now });
                }
            }

            return Json(m.searchMovie(strName, nYear), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getMovieByID(String strID)
        {
            return Json(m.getMovieByID(strID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getMyMovies()
        {
            return Json(m.getMyMovies(User.Identity.Name).ToList(), JsonRequestBehavior.AllowGet);
        }

        public Boolean isTheMovieOnMyList(String strMovieID)
        {
            return (m.getMyMovies(User.Identity.Name).Where<Movie>(c => c.IMDBID == strMovieID).Count() > 0);
        }

        [HttpPut]
        public Boolean updateStars(String strMovieID, Int32 nStars)
        {
            return (m.updateStars(strMovieID, nStars));
        }

        public JsonResult removeMovieFromUserList(String strMovieID)
        {
            return Json(new UserMovie().deleteUserMovie(strMovieID, User.Identity.Name), JsonRequestBehavior.AllowGet);
        }

        public Double getMovieStars(String strMovieID)
        {
            Movie wantedMovie = m.getAllMovies().SingleOrDefault(c => c.IMDBID == strMovieID);
            return (wantedMovie != null ? wantedMovie.Stars : -1);
        }

        public JsonResult getTopRatedMovies()
        {
            IEnumerable<Movie> movies = new Movie().getAllMovies();
            return Json(movies.OrderByDescending(s => s.Stars), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getMostWatchesMovies()
        {
            return Json(new UserMovie().getMostWatchedMovies(), JsonRequestBehavior.AllowGet);
        }
    }
}
