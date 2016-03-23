export const GO_TO_LOGIN = 'GO_TO_LOGIN'
export const GO_TO_HOME = 'GO_TO_HOME'

export function goToLogin() {
  return {
    type: GO_TO_LOGIN
  }
}

export function goToHome(name, token) {
  return {
    type: GO_TO_HOME,
    name,
    token
  }
}