import store from '@/store'

export function hasPermission (perms) {
  let permissions = store.state.user.permission;
  return permissions.indexOf(perms) > -1;
}
