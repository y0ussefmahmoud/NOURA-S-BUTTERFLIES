import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string }
    
    if (email === 'test@example.com' && password === 'Password123') {
      return HttpResponse.json({
        user: { id: '1', email, name: 'Test User' },
        token: 'mock-jwt-token-' + Date.now()
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const userData = await request.json() as any
    
    return HttpResponse.json({
      user: { id: '2', ...userData },
      token: 'mock-jwt-token-' + Date.now()
    })
  }),

  // Cart endpoints
  http.get('/api/cart', () => {
    return HttpResponse.json({
      items: [],
      total: 0
    })
  }),

  // Products endpoints
  http.get('/api/products', () => {
    return HttpResponse.json({
      products: [
        { id: '1', name: 'Product 1', price: 50 },
        { id: '2', name: 'Product 2', price: 75 }
      ]
    })
  }),
]
