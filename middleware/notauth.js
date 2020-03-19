export default function ({store,redirect}) {
  if (store.state.account.loginStatus)
    redirect('/');
}
