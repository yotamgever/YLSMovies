using MovieTheater.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MovieTheater.Controllers
{
    public class SearchController : Controller
    {
        public JsonResult getAllSearches()
        {
            Search s = new Search();
            return (Json(s.getAllSearches(), JsonRequestBehavior.AllowGet));
        }

        // Shirit
        public JsonResult getSearchedByUser()
        {
            Search s = new Search();
            return (Json(s.getSearchesOfUser(User.Identity.Name), JsonRequestBehavior.AllowGet));
        }

        public JsonResult getSearchesByName()
        {
            return Json(new Search().getNameSearches(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult filterSearches(String strSearchString, String dtFrom, String dtTo, String strCountry)
        {
            return Json(new Search().filterSearches(strSearchString, 
                (dtFrom.Equals("") ? DateTime.MinValue : Convert.ToDateTime(dtFrom)), 
                (dtTo.Equals("") ? DateTime.MinValue : Convert.ToDateTime(dtTo)),
                strCountry), JsonRequestBehavior.AllowGet);
        }


        [HttpDelete]
        public JsonResult deleteSearch(Int32 SearchID)
        {
            Boolean result = false;
            IEnumerable<Search> searches = new Search().getAllSearches();

            // if current user is admin, and if the search is in the DB
            if (!User.Identity.Name.Equals("") && MovieTheater.Models.User.isAdmin(User.Identity.Name) &&
                searches.FirstOrDefault(s=> s.SearchID == SearchID) != null)
            {
                result = new Search { SearchID = SearchID }.deleteSearch();
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
