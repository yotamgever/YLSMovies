using RestSharp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using MovieTheater.DAL;

namespace MovieTheater.Models
{
    [Table("Movies")]
    public class Movie
    {
        #region Data Members

        [Key]
        public String IMDBID { get; set; }
        public String Name { get; set; }
        public Int32 Year { get; set; }
        public String Director { get; set; }
        public Double Stars { get; set; }
        public Int32 Votes { get; set; }

        #endregion 

        /// <summary>
        /// Add movie
        /// </summary>
        /// <param name="movieToAdd"></param>
        /// <returns></returns>
        public Boolean addNewMovie()
        {
            TheaterContext context = new TheaterContext();
            try
            {
                context.Movies.Add(this);
                context.SaveChanges();

                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="movieToUpdate"></param>
        /// <returns></returns>
        public Boolean updateStars(String strMovieToUpdate, Int32 nStars)
        {
            Boolean answer = false;
            TheaterContext context = new TheaterContext();
            Movie specificMovie = context.Movies.SingleOrDefault(m => m.IMDBID == strMovieToUpdate);

            if (specificMovie != null)
            {
                specificMovie.Stars = (specificMovie.Stars * specificMovie.Votes++ + nStars) / specificMovie.Votes;
                context.SaveChanges();
                answer = true;
            }

            return (answer);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="movieToDelete"></param>
        /// <returns></returns>
        public static Boolean deleteMovie(Movie movieToDelete)
        {
            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Movie> getAllMovies()
        {
            TheaterContext context = new TheaterContext();
            return (context.Movies.ToList<Movie>());
        }

        /// <summary>
        /// Search movies by user
        /// </summary>
        /// <param name="strUserName"></param>
        /// <returns></returns>
        public IQueryable<Movie> getMyMovies(String strUserName)
        {
            TheaterContext context = new TheaterContext();
            var myMovies =
                from userMovies in context.UserMovies
                join movies in context.Movies
                on userMovies.MovieID equals movies.IMDBID
                where userMovies.UserID == strUserName
                select movies;

            return myMovies;
        }

        public object searchMovieByTitle(String strMovieTitle)
        {
            var client = new RestClient("http://www.omdbapi.com");

            var request = new RestRequest("?s={title}&r=json", Method.GET);

            request.AddUrlSegment("title", strMovieTitle); // replaces matching token in request.Resource

            // easily add HTTP Headers
            request.AddHeader("header", "value");

            // execute the request
            RestResponse response = (RestResponse)client.Execute(request);
            var content = response.Content;

            return (content);
        }

        public object getMovieByID(String strIMDBID)
        {
            var client = new RestClient("http://www.omdbapi.com");

            var request = new RestRequest("?i={ID}&r=json", Method.GET);

            request.AddUrlSegment("ID", strIMDBID); // replaces matching token in request.Resource

            // easily add HTTP Headers
            request.AddHeader("header", "value");

            // execute the request
            RestResponse response = (RestResponse)client.Execute(request);
            var content = response.Content;

            return (content);
        }
    }


    public class UserMovie
    {
        [Key]
        [Column(Order = 1)] 
        public virtual String MovieID { get; set; }
        [Key]
        [Column(Order = 2)] 
        public virtual String UserID { get; set; }

        public static Boolean isTheMovieOnMyList(String strMovieID, String strUserName)
        {
            TheaterContext context = new TheaterContext();
            var answer = from userMovies in context.UserMovies
                         where userMovies.UserID == strUserName &&
                               userMovies.MovieID == strMovieID
                         select true;
            return (answer.Count() == 1);
        }

        public UserMovie getUserMovie(String strMovieID, String strUserName)
        {
            TheaterContext context = new TheaterContext();
            var answer = from userMovies in context.UserMovies
                         where userMovies.UserID == strUserName &&
                               userMovies.MovieID == strMovieID
                         select userMovies;
            return ((answer.Count() == 1 ? answer.First<UserMovie>() : null));
        }

        public static bool addNewMovieToUser(Movie movieToAdd, String strUserName)
        {
            TheaterContext context = new TheaterContext();
            try
            {
                bool b = false;

                // Check if the movie exist
                if (!context.Movies.Any(other => other.IMDBID == movieToAdd.IMDBID))
                {
                    b = movieToAdd.addNewMovie();
                }

                // Check if the movie is already on the user's list
                if (!isTheMovieOnMyList(movieToAdd.IMDBID, strUserName))
                {
                    
                    // Add the movie to the user
                    context.UserMovies.Add(new UserMovie { UserID = strUserName, MovieID = movieToAdd.IMDBID });
                    context.SaveChanges();
                }

                return (b && true);
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public Boolean deleteUserMovie(String movieToRemove, String strUserName)
        {
            Boolean answer = false;
            TheaterContext context = new TheaterContext();
            UserMovie um = context.UserMovies.SingleOrDefault(s => s.MovieID == movieToRemove && s.UserID == strUserName);
            if (um != null)
            {
                context.UserMovies.Remove(um);
                answer = context.SaveChanges() > 0;
            }

            return (answer);
        }

        public static bool deleteMovieFromUserList(String movieToRemove, String strUserName)
        {
            bool answer = false;

            if (isTheMovieOnMyList(movieToRemove, strUserName))
            {
                try
                {
                    TheaterContext context = new TheaterContext();
                    context.UserMovies.Remove(new UserMovie { MovieID = movieToRemove, UserID = strUserName });
                    context.SaveChanges();
                    answer = true;
                }
                catch (Exception e)
                {
                    answer = false;
                }
            }

            return answer;
        }
    }
}