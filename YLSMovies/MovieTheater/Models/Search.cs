using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

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
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            context.Searches.Add(searchToAdd);
            context.SaveChanges();
        }

        /// <summary>
        /// List of searches
        /// </summary>
        /// <returns></returns>
        public IQueryable<Search> getAllSearches()
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
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
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
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
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
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
        public Boolean deleteSearch(Int32 nSearchID)
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
            Search s = context.Searches.SingleOrDefault(c => c.SearchID == nSearchID);
            context.Searches.Remove(s);

            return (context.SaveChanges() > 0);
        }

        /// <summary>
        /// Update the search
        /// </summary>
        /// <returns>True if there are searches that were updated</returns>
        public Boolean updateSearch()
        {
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
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
            MovieTheater.DAL.TheaterContext context = new DAL.TheaterContext();
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
    }
}