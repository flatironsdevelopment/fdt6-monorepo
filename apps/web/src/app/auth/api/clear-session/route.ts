import { NextResponse } from 'next/server'
import { removeAllCookies } from '../../utils/server-utils'

export async function GET() {
  removeAllCookies()
  return NextResponse.json({ result: 'successfull cleaned the session' })
}
