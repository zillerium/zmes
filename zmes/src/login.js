function loggedIn() {
  // ...
}

function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login'
    })
  }
}

function routes() {
  return (
    <Route path="/" component={App}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="checkout" component={Checkout} onEnter={requireAuth} />
    </Route>
  );
}
