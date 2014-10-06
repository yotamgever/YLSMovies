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
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            // Shirit - temp!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //ViewBag.isAdmin = u.isAdmin(User.Identity.Name);
            ViewBag.isAdmin = u.isAdmin("liorbentov");

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
