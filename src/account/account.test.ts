import request from 'supertest'
import { DB } from '../lib/db'
import { app } from '../app'
import { encodeCredentials } from '../auth/auth.utils'
import { seller } from '../lib/test-data'
import { Seller } from './account.interface'

const mockUser = {
  city: expect.any(String),
  state: expect.any(String)
}

let authorization = ''

beforeAll(async () => {
  const db = await DB.getClient()

  const sellersCollection = db.collection<Seller>('sellers')
  await sellersCollection.insertOne(seller)
  authorization = encodeCredentials(seller?.sellerId, seller?.sellerZipCodePrefix)
})

describe('PUT /update_account_location', () => {
  it('should update account location with valid input', async () => {
    const response = await request(app)
      .patch('/account')
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)
      .send({ city: 'new-city', state: 'new-state' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toMatchObject({ city: 'new-city', state: 'new-state' })
  })

  it('should handle updating with missing fields', async () => {
    const response = await request(app)
      .patch('/account')
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)
      .send({})

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toMatchObject(mockUser)
  })

  it('should handle updating with invalid input', async () => {
    const response = await request(app)
      .patch('/account')
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)
      .send({ city: 123, state: ['invalid'] })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle wrong Authorization header', async () => {
    const response = await request(app)
      .patch('/account')
      .send({ city: 'new-city', state: 'new-state' })
      .expect('Content-Type', /application\/json/)
      .set('Authorization', 'Basic invalid-token')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })
})
