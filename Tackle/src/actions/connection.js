export const UPDATE_USERS = 'UPDATE_USERS'
export const PLAY_VIA_INTERNET = 'PLAY_VIA_INTERNET'
export const USER_PRESSED = 'USER_PRESSED'

export function onUpdateUsers(users) {
  return {
    type: UPDATE_USERS,
    users
  }
}

export function onPlayViaInternet() {
  return {
    type: PLAY_VIA_INTERNET
  }
}

export function onUserPressed(user) {
  return {
    type: USER_PRESSED,
    user
  }
}