using MovieTheater.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MovieTheater.Controllers
{
    public class CountryController : Controller
    {
        //
        // GET: /Country/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getAllCountriesa()
        {
            return (Json(new Country().getCountries(), JsonRequestBehavior.AllowGet));
        }

        public JsonResult getAllCountries()
        {
            var result = new Country().getCountries().ToList().Where(c => c.Name.ToUpper().Contains(Request.Params.GetValues("term")[0].ToUpper()));
            return (Json(result, JsonRequestBehavior.AllowGet));
        }
    }
}
