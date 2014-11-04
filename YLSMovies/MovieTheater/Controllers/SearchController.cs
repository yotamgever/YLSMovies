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

        public Boolean removeSearch(Int32 nSearech)
        {
            return (new Search().deleteSearch(nSearech));
        }
    }
}
