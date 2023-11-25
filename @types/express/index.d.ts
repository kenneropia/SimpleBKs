import { AuthPayload } from '../../src/auth/auth.interface'

declare global {
  namespace Express {
    interface Request {
      currentUser: AuthPayload | null
    }
  }
}
