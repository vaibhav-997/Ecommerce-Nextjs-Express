import express from 'express'
import  productRouter  from './routers/product.routers.js'
import cors from 'cors'
const app = express()

const corsOptions = {
    origin:'http://localhost:3000'
}
app.use(cors(corsOptions))

app.use('/api/product',productRouter)


export { app }