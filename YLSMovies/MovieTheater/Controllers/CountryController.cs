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

        public JsonResult getAllCountries()
        {
            return (Json(new Country().getCountries(), JsonRequestBehavior.AllowGet));
        }
    }
}
