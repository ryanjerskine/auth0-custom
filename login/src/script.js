window.addEventListener('load', function() {
  var usernameField = document.getElementById('username');
  var passwordField = document.getElementById('password');
  var nameField = document.getElementById('name');
  var form = document.getElementById('login-form');
  var signupForm = document.getElementById('signup-form');
  var signupLink = document.getElementById('signup-link');
  var loginLink = document.getElementById('login-link');

  /******************/
  /*  Auth0 config  */
  /******************/
  var config;
  var webAuth;
  var databaseConnection = 'Username-Password-Authentication';
  if (true) { // If you want to debug this page locally, set this to false
    config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));
    var params = Object.assign({
      /* additional configuration needed for use of custom domains
      overrides: {
        __tenant: config.auth0Tenant,
        __token_issuer: 'YOUR_CUSTOM_DOMAIN'
      }, */
      domain: config.auth0Domain,
      clientID: config.clientID,
      redirectUri: config.callbackURL,
      responseType: 'code'
    }, config.internalOptions);
    webAuth = new auth0.WebAuth(params);
  }
  
  /*************************/
  /*  Form error handling  */
  /*************************/
  function displayError(err) {
    console.log(err);
    var errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = err.description;
    errorMessage.style.display = 'block';
  }

  /******************************/
  /*  Login/Signup form events  */
  /******************************/
  function login(e) {
    if (e.preventDefault) e.preventDefault();
    var username = usernameField.value;
    var password = passwordField.value;
    webAuth.login({
      realm: databaseConnection,
      username: username,
      password: password
    }, function(err) {
      if (err) displayError(err);
    });
    return false;
  }
  function signup() {
    var email = usernameField.value;
    var password = passwordField.value;
    webAuth.redirect.signupAndLogin({
      connection: databaseConnection,
      email: email,
      password: password
    }, function(err) {
      if (err) displayError(err);
    });
  }
  form.attachEvent ? form.attachEvent('submit', login) : form.addEventListener('submit', login);
  signupForm.attachEvent ? signupForm.attachEvent('submit', signup) : signupForm.addEventListener('submit', signup);

  /*************************/
  /*  Third-party sign in  */
  /*************************/
  function loginWithGoogle() {
    webAuth.authorize({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) displayError(err);
    });
  }
  // TODO: Create social login button (google, facebook, etc) and add event listeners
  // document.getElementById('btn-google').addEventListener('click', loginWithGoogle);
  
  /*************************************************/
  /*  Toggle show/hide for login and signup forms  */
  /*************************************************/
  function showLogin() {
    window.setTimeout(function() { usernameField.focus() }, 300);
    signupForm.classList.add('hidden');
    form.classList.remove('hidden');
  }
  function showSignup() {
    window.setTimeout(function() { nameField.focus() }, 300);
    form.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
  showLogin();
  signupLink.addEventListener('click', showSignup);
  loginLink.addEventListener('click', showLogin);

  /*********************/
  /*  Floating labels  */
  /*********************/
  function loginKeypress(e) {
    if (e.target.value && e.target.value.length && e.target.parentElement) {
      e.target.parentElement.classList.add('has-value');
    }
    else if (e.target.parentElement) {
      e.target.parentElement.classList.remove('has-value');
    }
  }
  usernameField.addEventListener('keyup', loginKeypress);
  usernameField.addEventListener('blur', loginKeypress);
  passwordField.addEventListener('keyup', loginKeypress);
  passwordField.addEventListener('blur', loginKeypress);
  nameField.addEventListener('keyup', loginKeypress);
  nameField.addEventListener('blur', loginKeypress);
});
