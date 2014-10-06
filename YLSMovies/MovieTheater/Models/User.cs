using RestSharp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MovieTheater.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public String UserName { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public virtual Country Country { get; set; }
        public Boolean Admin { get; set; }

        // Shirit
        public Boolean isAdmin(String strUserName)
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            var answer = from users in context.Users
                         where users.UserName == strUserName &&
                               users.Admin == true
                         select true;

            return (answer.Count() == 1);
        }

        // Shirit
        public Boolean addAdmin(String strUserName)
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            Boolean answer = false;
            //TheaterContext context = new TheaterContext();
            User specificUser = context.Users.SingleOrDefault(u => u.UserName == strUserName);

            if (specificUser != null)
            {
                specificUser.Admin = true;
                context.SaveChanges();
                answer = true;
            }

            return (answer);
        }

        // Shirit
        public Boolean addUser()
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            try
            {
                // Check if the movie is already on the user's list
                /*if (!isTheMovieOnMyList(movieToAdd.IMDBID, strUserName))
                {*/

                // Add the movie to the user
                context.Users.Add(this);
                context.SaveChanges();
                //}

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }

    public class Country
    {
        [Key]
        public Int32 CountryID { get; set; }
        public String Name { get; set; }
        public Double Latitude { get; set; }
        public Double Longitude { get; set; }

        public IQueryable<Country> getCountries()
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            var countriesList = from countries in context.Countries
                                select countries;
            return (countriesList);
        }
    }
}