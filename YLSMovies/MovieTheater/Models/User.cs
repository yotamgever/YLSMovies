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
        [ForeignKey("Country")]
        public Int32 CountryID { get; set; }

        /// <summary>
        /// This method checks if the user is admin
        /// </summary>
        /// <param name="strUserName">Username</param>
        /// <returns>True if user is admin</returns>
        public static Boolean isAdmin(String strUserName)
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            var answer = from users in context.Users
                         where users.UserName == strUserName &&
                               users.Admin == true
                         select true;

            return (answer.Count() == 1);
        }

        /// <summary>
        /// This method promotes/denotes the user to admin / simple user
        /// </summary>
        /// <param name="strUserName">Username</param>
        /// <param name="isManager">True - promote, False - denote</param>
        /// <returns>True if the action succeeded</returns>
        public Boolean updateAdmin(String strUserName, Boolean isManager)
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            Boolean answer = false;
            //TheaterContext context = new TheaterContext();
            User specificUser = context.Users.SingleOrDefault(u => u.UserName == strUserName);

            if (specificUser != null)
            {
                specificUser.Admin = isManager;
                context.SaveChanges();
                answer = true;
            }

            return (answer);
        }

        /// <summary>
        /// This method adds new user
        /// </summary>
        /// <returns>True if the addition succeeded</returns>
        public Boolean addUser()
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();

            try
            {
                context.Users.Add(this);
                context.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// This method deletes the user
        /// </summary>
        /// <param name="strUserName">Username</param>
        /// <returns>True if action succeeded</returns>
        public Boolean deleteUser(String strUserName)
        {
            Boolean answer = false;
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();

            // Get user's movie
            var currUserMovies = from userMovies in context.UserMovies
                                 where userMovies.UserID == strUserName
                                 select userMovies;

            // Remove the user's movies
            foreach (var currMovie in currUserMovies)
            {
                context.UserMovies.Remove(currMovie);
            }

            User u = context.Users.SingleOrDefault(s => s.UserName == strUserName);
            if (u != null)
            {
                context.Users.Remove(u);
            }

            answer = context.SaveChanges() > 0;


            return (answer);
        }

        /// <summary>
        /// This method get users by parameters
        /// </summary>
        /// <param name="strUserName">Username</param>
        /// <param name="strFirstName">Firstname</param>
        /// <param name="strLastName">Lastname</param>
        /// <returns>List of users that fit the given parameters</returns>
        public IQueryable<object> searchUser(String strUserName, String strFirstName, String strLastName)
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();

            var search = from users in context.Users
                         where ((strUserName.Equals("") || users.UserName.ToUpper().Contains(strUserName.ToUpper())) &&
                                (strFirstName.Equals("") || users.FirstName.ToUpper().Contains(strFirstName.ToUpper())) &&
                                (strLastName.Equals("") || users.LastName.ToUpper().Contains(strLastName.ToUpper())))
                         select new 
                         {
                             userName = users.UserName,
                             firstName = users.FirstName,
                             lastName = users.LastName,
                             admin = users.Admin,
                         };

            return (search);
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

        public static Country getCountryByName(String strCountryName)
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            var code = from countries in context.Countries
                       where countries.Name.Equals(strCountryName)
                       select countries;

            return (code.FirstOrDefault());
        }

        public static Country getCountryByID(Int32 nCountryID)
        {
            return ((new DAL.TheaterContext()).Countries.Find(nCountryID));
        }
    }
}