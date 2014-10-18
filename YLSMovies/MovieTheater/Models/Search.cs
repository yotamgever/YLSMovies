using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using MovieTheater.DAL;

namespace MovieTheater.Models
{
    public class Search
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Int32 SearchID { get; set; }
        public String UserName { get; set; }
        public DateTime Date { get; set; }
        public String SearchString { get; set; }

        /// <summary>
        /// Add Search
        /// </summary>
        /// <param name="searchToAdd"></param>
        public void addSearch(Search searchToAdd)
        {
            TheaterContext context = new TheaterContext();
            context.Searches.Add(searchToAdd);
            context.SaveChanges();
        }

        /// <summary>
        /// List of searches
        /// </summary>
        /// <returns></returns>
        public IQueryable<Search> getAllSearches()
        {
            TheaterContext context = new TheaterContext();
            var searches = from s in context.Searches
                           select s;

            return (searches);
        }

        /// <summary>
        /// Search by username
        /// </summary>
        /// <param name="strUserName"></param>
        /// <returns></returns>
        public IQueryable<Search> getSearchesOfUser(String strUserName)
        {
            TheaterContext context = new TheaterContext();
            var searches = from s in context.Searches
                           where s.UserName == strUserName
                           select s;

            return (searches);
        }

        /// <summary>
        /// Searches of today
        /// </summary>
        /// <returns>Searches that were commited today</returns>
        public IQueryable<Search> getTodaySearches()
        {
            TheaterContext context = new TheaterContext();
            var searches = from s in context.Searches
                           where s.Date.ToShortDateString().Equals(DateTime.Today.ToShortDateString())
                           select s;

            return (searches);
        }

        /// <summary>
        /// Delete a search
        /// </summary>
        /// <param name="nSearchID">Search ID</param>
        /// <returns>True if there are searches that were deleted</returns>
        public Boolean deleteSearch()
        {
            TheaterContext context = new TheaterContext();
            Search s = context.Searches.SingleOrDefault(c => c.SearchID == this.SearchID);
            if (s != null){
                context.Searches.Remove(s);
            }

            return (context.SaveChanges() > 0);
        }

        /// <summary>
        /// Update the search
        /// </summary>
        /// <returns>True if there are searches that were updated</returns>
        public Boolean updateSearch()
        {
            TheaterContext context = new TheaterContext();
            var searches = from s in context.Searches
                           where s.SearchID == this.SearchID
                           select s;

            foreach (Search sr in searches)
            {
                sr.Date = DateTime.Now;
            }

            context.SaveChanges();

            return (context.SaveChanges() > 0);
        }

        /// <summary>
        /// Get Searches by name
        /// </summary>
        /// <returns></returns>
        public IEnumerable<object> getNameSearches()
        {
            TheaterContext context = new TheaterContext();
            var regularSearches = (from regSearch in context.Searches
                                   where !regSearch.SearchString.Contains(";")
                                   group regSearch by regSearch.SearchString into newGroup
                                   select new
                                   {
                                       Name = (string)newGroup.Key,
                                       Count = (int)(from searches in newGroup select searches.SearchString).Count()
                                   }).ToList();
            var advanceSearches = (from newTable in
                                       (from regSearch in context.Searches.ToArray()
                                        where regSearch.SearchString.Contains(";")
                                        select new
                                        {
                                            Name = regSearch.SearchString.Split(';')[0].Split(':')[1]
                                        })
                                   group newTable by newTable.Name into newGroup
                                   select new
                                   {
                                       Name = (string)newGroup.Key,
                                       Count = (int)(from searches in newGroup select searches.Name).Count()
                                   }).ToList();

            var union = from searches in regularSearches.Union(advanceSearches)
                        group searches by searches.Name into newGroup
                        select new
                        {
                            Name = newGroup.Key,
                            Count = (from searches in newGroup select searches.Count).Sum()
                        };

            return union;
        }

        public IQueryable<object> filterSearches(String strSearchString, DateTime dtFrom, DateTime dtTo, String strCountry)
        {
            TheaterContext context = new TheaterContext();
            Country cTemp = new Country().getCountryByName(strCountry);
            var results = from searches in context.Searches
                          join users in context.Users
                          on searches.UserName equals users.UserName
                          where (strSearchString.Equals("") || searches.SearchString.ToUpper().Contains(strSearchString.ToUpper())) &&
                          (DateTime.Equals(DateTime.MinValue, dtFrom) || searches.Date >= dtFrom) &&
                          (DateTime.Equals(DateTime.MinValue, dtTo) || searches.Date <= dtTo)
                          select new
                          {
                              searches.SearchID,
                              searches.SearchString,
                              searches.Date,
                              users.Country
                          };
            if (cTemp != null)
            {
                results = results.Where(r => r.Country.CountryID == cTemp.CountryID);
            }

            return results;
        }

        // Shirit
        public IQueryable<AllUsers> getAllUsers()
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();

            var searches = from userMovies in context.UserMovies
                           join users in context.Users on userMovies.UserID equals users.UserName
                           group userMovies by new { users.UserName, users.FirstName, users.LastName, users.Admin } into pGroup
                           select new AllUsers()
                           {
                               userName = pGroup.Key.UserName,
                               firstName = pGroup.Key.FirstName,
                               lastName = pGroup.Key.LastName,
                               admin = pGroup.Key.Admin,
                               moviesNum = pGroup.Count()
                           };

            return (searches);
        }
    }

    // Shirit
    public class AllUsers
    {
        public String userName { get; set; }
        public Int32 moviesNum { get; set; }
        public String firstName { get; set; }
        public String lastName { get; set; }
        public Boolean admin { get; set; }
    }
}