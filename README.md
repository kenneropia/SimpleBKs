 
### Running Project

To run the project, you would use the following command:
`npm run start`

To build the project, you would use the following command:
`npm run build`


To test the project, you would use the following command:
`npm run test`


To lint the project with StandardJS, you would use the following command:
`npm run lint`



### Note🙏🏾


I made a change to one of the routes, specifically `DELETE: /order_items/:orderId`. I apologize for any inconvenience in advance. The modification was necessary due to multiple order items in the `olist_order_items_dataset.csv` dataset sharing the same value in the order_id column. I adjusted the route to `/:productId/:orderId/` to query the database with a compound ID `(productId, orderId)`. This prevents the deletion of multiple order items that share the same orderId. Once again, I apologize for any inconvenience caused.

### Import Data

```
  mongoimport.exe --uri "{DB_URL}" --db simpleBKs --collection {COLLECTION_NAME} --type csv --headerline --file {CSV_FILE_PATH}
  
```

### Docs
[Link text Here](https://documenter.getpostman.com/view/14123497/2s9YeD9DCh#2b2fee80-4369-49c3-a4e9-1da312c86bb1)
