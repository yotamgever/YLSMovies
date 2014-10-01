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