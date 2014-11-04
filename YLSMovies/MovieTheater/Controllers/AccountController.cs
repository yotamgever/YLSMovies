using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;
using MovieTheater.Filters;
using MovieTheater.Models;

namespace MovieTheater.Controllers
{
    /// <summary>
    /// Handles the users in the Movie Theatre
    /// </summary>
    [Authorize]
    [InitializeSimpleMembership]
    public class AccountController : Controller
    {
        User u = new User();

        /// <summary>
        /// This method handles the user login according to parameters
        /// </summary>
        /// <param name="strUserName">String. The user name</param>
        /// <param name="strPassword">String. The user password</param>
        /// <param name="bRememberMe">Boolean. Whether to remember for future logins or not</param>
        /// <returns>Empty if succeeded, Message otherwise</returns>
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public String Login(String strUserName, String strPassword, Boolean bRememberMe)
        {
            if (ModelState.IsValid && WebSecurity.Login(strUserName, strPassword, persistCookie: bRememberMe))
            {
                return String.Empty;
            }

            // If we got this far, something failed, redisplay form
            return "The user name or password provided is incorrect.";
        }

        /// <summary>
        /// This method handles the user logoff
        /// </summary>
        /// <returns>bool. True if succeeded, flase otherwise</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public bool LogOff()
        {
            WebSecurity.Logout();
            return true;
        }

        /// <summary>
        /// This method handles the user registration according to parameters
        /// </summary>
        /// <param name="strFirstName">String. The user first name</param>
        /// <param name="strLastName">String. The user last name</param>
        /// <param name="strBirthDate">String. The user birth date</param>
        /// <param name="strCountry">String. The user country</param>
        /// <param name="strUserName">String. The user system-name</param>
        /// <param name="strPassword">String. The user system-password</param>
        /// <returns>Boolean. True if succeeded, flase otherwise</returns>
        [HttpPost]
        [AllowAnonymous]
        //[ValidateAntiForgeryToken]
        public Boolean Register(String strFirstName, String strLastName, String strBirthDate, String strCountry, 
            String strUserName, String strPassword)
        {
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                try
                {
                    WebSecurity.CreateUserAndAccount(strUserName, strPassword);
                
                    u.UserName = strUserName;
                    u.FirstName = strFirstName;
                    u.LastName = strLastName;

                    // Only admins can promote users to be admin
                    u.Admin = false;
                    u.BirthDate = Convert.ToDateTime(strBirthDate);
                    u.CountryID = Country.getCountryByName(strCountry).CountryID;
                    u.addUser();
                    WebSecurity.Login(strUserName, strPassword);
                    return true;
                }
                catch (MembershipCreateUserException e)
                {
                    ModelState.AddModelError("", ErrorCodeToString(e.StatusCode));
                }
            }

            return false;
        }

        //
        // POST: /Account/Disassociate

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Disassociate(string provider, string providerUserId)
        {
            string ownerAccount = OAuthWebSecurity.GetUserName(provider, providerUserId);
            ManageMessageId? message = null;

            // Only disassociate the account if the currently logged in user is the owner
            if (ownerAccount == User.Identity.Name)
            {
                // Use a transaction to prevent the user from deleting their last login credential
                using (var scope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
                {
                    bool hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name));
                    if (hasLocalAccount || OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name).Count > 1)
                    {
                        OAuthWebSecurity.DeleteAccount(provider, providerUserId);
                        scope.Complete();
                        message = ManageMessageId.RemoveLoginSuccess;
                    }
                }
            }

            return RedirectToAction("Manage", new { Message = message });
        }

        public Boolean updateAdmin(String strUserName, Boolean isManager)
        {
            return (u.updateAdmin(strUserName, isManager));
        }

        public Boolean removeUser(String strUserName)
        {
            bool answer = false;

            if (Membership.DeleteUser(strUserName))
            {
                //answer = m.delete
                answer = u.deleteUser(strUserName);
            }

            return (answer);
        }

        public JsonResult userManagement(String strUserName, String strFirstName, String strLastName)
        {
            return (Json(u.searchUser(strUserName, strFirstName, strLastName), JsonRequestBehavior.AllowGet));
        }

        #region Helpers
        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        public enum ManageMessageId
        {
            ChangePasswordSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
        }

        internal class ExternalLoginResult : ActionResult
        {
            public ExternalLoginResult(string provider, string returnUrl)
            {
                Provider = provider;
                ReturnUrl = returnUrl;
            }

            public string Provider { get; private set; }
            public string ReturnUrl { get; private set; }

            public override void ExecuteResult(ControllerContext context)
            {
                OAuthWebSecurity.RequestAuthentication(Provider, ReturnUrl);
            }
        }

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "User name already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A user name for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }
        #endregion
    }
}
