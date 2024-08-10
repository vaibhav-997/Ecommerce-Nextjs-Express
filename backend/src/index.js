import { app } from "./app.js";
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env',

})


app.listen(process.env.PORT || 3000, function(){
    console.log(`listening on http://localhost:${process.env.PORT}`)
})