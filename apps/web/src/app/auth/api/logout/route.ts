import { redirect } from 'next/navigation'
import { removeAllCookies } from '../../utils/server-utils'

export async function GET(request: Request) {
  removeAllCookies()
  return redirect('/auth/login')
}
