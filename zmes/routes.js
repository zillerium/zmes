<Route path=”/” component={App}>
  <Route path=”cart” component={Cart}/>
  <Route path=”login” component={Login}/>

  <Route component={EnsureLoggedInContainer}>
    <Route path=”checkout” component={Checkout}/>
    <Route path=”account” component={Account}/>
  </Route>
</Route>
