export enum HooksEnum {
  login = 'login',
  logout = 'logout',
  sign = 'sign',
  signMessage = 'sign-message'
}

export enum RouteNamesEnum {
  home = '/',
  unlock = '/unlock',
  logout = '/logout',
  dashboard = '/dashboard',
  disclaimer = '/disclaimer',
  send = '/send',
  sign = '/sign',
  signMessage = '/sign-message',
  swap = '/swap',
  faucet = '/faucet',
  listToken = '/list-token',
  createPool = '/list-token/create',
  swapNew = '/swap-new', 

}


export enum HooksPageEnum {
  sign = `/hook/${HooksEnum.sign}`,
  login = `/hook/${HooksEnum.login}`,
  logout = `/hook/${HooksEnum.logout}`,
  signMessage = `/hook/${HooksEnum.signMessage}`
}
