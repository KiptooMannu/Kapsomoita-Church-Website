import { apiGet, apiPatch, apiPost } from '@/lib/api/client'
import type {
  AuthResponse,
  ChangePasswordPayload,
  CurrentUser,
  LoginPayload,
  MessageResponse,
  UpdateProfilePayload,
} from '@/lib/api/types'

/** Thin, typed wrappers over the `/auth` endpoints. */
export const authApi = {
  login(payload: LoginPayload): Promise<AuthResponse> {
    return apiPost<AuthResponse>('/auth/login', payload)
  },

  /**
   * Ends the session server-side.
   *
   * `allDevices` revokes every refresh token for the account, which is the right
   * action after a suspected compromise.
   */
  logout(refreshToken: string | null, allDevices = false): Promise<MessageResponse> {
    return apiPost<MessageResponse>('/auth/logout', { refreshToken, allDevices })
  },

  /** The signed-in account, read fresh so role changes appear without re-login. */
  me(): Promise<CurrentUser> {
    return apiGet<CurrentUser>('/auth/me')
  },

  updateProfile(payload: UpdateProfilePayload): Promise<CurrentUser> {
    return apiPatch<CurrentUser>('/auth/me', payload)
  },

  /** Succeeds only with the correct current password; revokes other sessions. */
  changePassword(payload: ChangePasswordPayload): Promise<MessageResponse> {
    return apiPost<MessageResponse>('/auth/change-password', payload)
  },
}
