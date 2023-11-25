import { NextFunction, Request, Response } from 'express'
import { DB } from '../lib/db'
import HttpException from '../error/http-exception'
import { SortDirection } from 'mongodb'
import { Order } from './order.interface'
import { AuthPayload } from '../auth/auth.interface'
import { Product } from '../product/product.interface'

export const getOrderItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 20, offset = 0, sort } = req.query
    const { sellerId } = req.currentUser as AuthPayload

    const db = await DB.getClient()
    const orderItemsCollection = db.collection<Order>('orders')
    const productsCollection = db.collection<Product>('products')

    const sortOptions: Record<string, SortDirection> = {}
    if (sort === 'price') {
      sortOptions.price = 1
    } else {
      sortOptions.shippingLimitDate = 1
    }

    const orderItems = await orderItemsCollection
      .find({ sellerId })
      .sort(sortOptions)
      .skip(parseInt(offset as string, 10))
      .limit(parseInt(limit as string, 10))
      .toArray()

    const productIds = orderItems.map((orderItem) => orderItem.productId)

    const products = await productsCollection
      .find({ productId: { $in: productIds } })
      .toArray()

    const formattedOrderItems = orderItems.map((orderItem: Order) => {
      const associatedProduct = products.find((product: Product) => product.productId === orderItem.productId)

      return {
        id: orderItem.orderItemId,
        product_id: orderItem.productId,
        product_category: associatedProduct?.productCategoryName ?? 'Unknown',
        price: orderItem.price,
        date: orderItem.shippingLimitDate
      }
    })

    const total = await orderItemsCollection.countDocuments({ sellerId })

    res.json({
      data: formattedOrderItems,
      total,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    })
  } catch (error) {
    next(error)
  }
}

export const deleteOrderItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, orderId } = req.params
    const { sellerId } = req.currentUser as AuthPayload
    const db = await DB.getClient()
    const collection = db.collection<Order>('orders')

    const result = await collection.deleteOne({
      orderItemId: parseInt(orderId, 10),
      productId,
      sellerId
    })

    if (result.deletedCount === 0) {
      return next(new HttpException(404, 'Order item not found'))
    }

    res.json({ message: 'Order item deleted successfully' })
  } catch (error) {
    next(error)
  }
}
