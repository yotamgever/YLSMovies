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
        public bool addNewMovieToUser(String strIMDBID, String strName, String strDirector, Int32 nYear, String strUserName)
        {
            Movie movieToAdd = new Movie { IMDBID = strIMDBID, Name = strName, Director = strDirector, Year = nYear };
            return UserMovie.addNewMovieToUser(movieToAdd, strUserName);
        }

        public JsonResult searchMoviesByTitle(String strTitle)
        {
            Search s = new Search();
            IQueryable<Search> searches = s.getSearchesOfUser("liorbentov");
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
                s.addSearch(new Search { UserName = "liorbentov", SearchString = strTitle, Date = DateTime.Now });
            }

            return Json(m.searchMovieByTitle(strTitle), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getMovieByID(String strID)
        {
            return Json(m.getMovieByID(strID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getMyMovies(String strUserName)
        {
            return Json(m.getMyMovies(strUserName).ToList(), JsonRequestBehavior.AllowGet);
        }

        public Boolean isTheMovieOnMyList(String strMovieID, String strUserName)
        {
            return (m.getMyMovies(strUserName).Where<Movie>(c => c.IMDBID == strMovieID).Count() > 0);
        }

        [HttpPut]
        public Boolean updateStars(String strMovieID, Int32 nStars)
        {
            return (m.updateStars(strMovieID, nStars));
        }

        public JsonResult removeMovieFromUserList(String strMovieID, String strUserName)
        {
            return Json(new UserMovie().deleteUserMovie(strMovieID, strUserName), JsonRequestBehavior.AllowGet);
        }

        public Double getMovieStars(String strMovieID)
        {
            Movie wantedMovie = m.getAllMovies().SingleOrDefault(c => c.IMDBID == strMovieID);
            return (wantedMovie != null ? wantedMovie.Stars : -1);
        }
    }
}
