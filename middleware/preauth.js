export default function ({store,redirect,req}) {
  //console.log(store.state.account);
  if (store.state.account.loginStatus)
    redirect('/');
}
