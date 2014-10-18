using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MovieTheater.Models;

namespace MovieTheater.Controllers
{
    public class HomeController : Controller
    {
        // Shirit
        User u = new User();

        public ActionResult Index()
        {
            // Shirit - temp!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            ViewBag.isAdmin = MovieTheater.Models.User.isAdmin(User.Identity.Name);

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult MovieGeneral()
        {
            return View();
        }

        // Shirit
        public JsonResult getAdminPanel()
        {
            Search s = new Search();
            return (Json(s.getAllUsers(), JsonRequestBehavior.AllowGet));
        }
    }
}
