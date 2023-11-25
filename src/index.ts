import { config } from 'dotenv'
import { app } from './app'
config()

const PORT: number | string = process.env.PORT ?? 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
