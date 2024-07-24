export enum HooksEnum {
  login = 'login',
  logout = 'logout',
  sign = 'sign',
  signMessage = 'sign-message'
}

export enum RouteNamesEnum {
  home = '/',
  dashboard = '/dashboard',
  unlock = '/unlock',
  disclaimer = '/disclaimer',
  send = '/send',
  logout = '/logout',
  sign = '/sign',
  signMessage = '/sign-message',
  swap = '/swap',
  faucet = '/faucet',
  listToken = '/list-token'
}

export enum HooksPageEnum {
  sign = `/hook/${HooksEnum.sign}`,
  login = `/hook/${HooksEnum.login}`,
  logout = `/hook/${HooksEnum.logout}`,
  signMessage = `/hook/${HooksEnum.signMessage}`
}
