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

        public JsonResult getSearchedByUser(String strUserName)
        {
            Search s = new Search();
            return (Json(s.getSearchesOfUser(strUserName), JsonRequestBehavior.AllowGet));
        }

        public JsonResult getSearchesByName()
        {
            return Json(new Search().getNameSearches(), JsonRequestBehavior.AllowGet);
        }
    }
}
