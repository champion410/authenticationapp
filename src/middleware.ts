import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
// Logic part
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail';
  const token = request.cookies.get('token')?.value || '';

  if(isPublicPath && token){
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if(!isPublicPath  && !token){
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}
 
// Matching part, on what route we want to match and run our middleware
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile',
    '/login',
    '/signup',
    '/verifyemail'
  ]
}