import request from 'supertest'
import { DB } from '../lib/db'
import { app } from '../app'
import { encodeCredentials } from '../auth/auth.utils'
import { orders, products, seller } from '../lib/test-data'
import { Order } from './order.interface'
import { Product } from '../product/product.interface'
import { Seller } from '../account/account.interface'

const mockOrder = {
  id: expect.any(Number),
  product_id: expect.any(String),
  product_category: expect.any(String),
  price: expect.any(Number),
  date: expect.any(String)
}

let authorization = ''

beforeAll(async () => {
  const db = await DB.getClient()

  const sellersCollection = db.collection<Seller>('sellers')
  await sellersCollection.insertOne(seller)
  authorization = encodeCredentials(seller?.sellerId, seller?.sellerZipCodePrefix)

  const ordersCollection = db.collection<Order>('orders')
  const productsCollection = db.collection<Product>('products')

  await ordersCollection.insertMany(orders)

  await productsCollection.insertMany(products)
})

describe('GET /order_items', () => {
  it('should return order items with correct data types', async () => {
    const response = await request(app)
      .get('/order_items')
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)

    expect(response.status).toBe(200)
    expect(response.body.total).toEqual(expect.any(Number))
    expect(response.body.limit).toEqual(expect.any(Number))
    expect(response.body.offset).toEqual(expect.any(Number))

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toBeInstanceOf(Array)

    const firstItem = response.body.data[0]
    expect(firstItem).toMatchObject(mockOrder)
  })

  it('should handle offset and limit correctly', async () => {
    const response = await request(app)
      .get('/order_items')
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)
      .query({ offset: 1, limit: 2 })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.data.length).toBe(2)
  })

  it('should handle sorting correctly', async () => {
    const response = await request(app)
      .get('/order_items')
      .set('Authorization', authorization)
      .expect('Content-Type', /application\/json/)
      .query({ sort: 'price' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toBeInstanceOf(Array)

    const prices = response.body.data.map((item: any) => item.price)
    expect(prices).toEqual(prices.slice().sort((a: number, b: number) => a - b))
  })

  it('should handle wrong Authorization header', async () => {
    const response = await request(app)
      .get('/order_items')
      .expect('Content-Type', /application\/json/)
      .set('Authorization', 'Basic invalid-token')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })
})

describe('DELETE /order_items/:order_id/:productId', () => {
  it('should delete an existing order item', async () => {
    const fakeOrderItem = orders[0]

    const response = await request(app)
      .delete(`/order_items/${fakeOrderItem.productId}/${fakeOrderItem.orderItemId}`)
      .expect('Content-Type', /application\/json/)
      .set('Authorization', authorization)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle deleting a non-existing order item', async () => {
    const response = await request(app)
      .delete('/order_items/non-existing-product-id/non-existing-order-id')
      .expect('Content-Type', /application\/json/)
      .set('Authorization', authorization)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
  })

  it('should handle wrong Authorization header', async () => {
    const fakeOrderItem = orders[1]

    const response = await request(app)
      .delete(`/order_items/${fakeOrderItem.productId}/${fakeOrderItem.orderItemId}`)
      .expect('Content-Type', /application\/json/)
      .set('Authorization', 'Basic invalid-token')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
  })
})
