
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    const cookie = cookies()

    const token = cookie.get('next-auth.session-token')
    
    if(token && token?.name === 'next-auth.session-token' && token?.value.length ! > 0){
        console.log('called', token)
        return NextResponse.redirect(new URL('/', request.url))
    }


  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [ '/signin', '/signup']
}