import { prisma } from "../utils/prismaClient.js"

const addProduct = async (req, res) => {
   try {
     const {name, size, price, description, category} = req.body
 
     if(!name || !size || !price || !description || !category){
         return res.json({message:"Please provide all the fields"})
     }
 
     let productImage ;
     if(req.file){
         productImage = req.file.path
     }
 
     const newProduct  = await prisma.product.create({
         data:{
             name, size, price:Number(price), description, image:productImage, category
         }
     })
 
 
 
 
     return res.json({message:"Product added successfully", payload : newProduct})
   } catch (error) {
    return res.json({message:"error adding product", error: error})
   }
}

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await prisma.product.findMany({})
        return res.json({message:"Fetched Products successfully", payload: allProducts})
    } catch (error) {
        return res.json({message:"error getting product", error: error})

    }
}


const getProductById = async (req, res) => {
    try {
        const {id} = req.params 
      
       const product = await prisma.product.findFirst({
        where:{
            id:id
        }
       })
       return res.json({message:"Product found", payload : product})
    } catch (error) {
        return res.json({message:"error getting product", error: error})

    }
}


const updateProduct = async (req, res) => {
   try {
     const {name, size, price, description} = req.body
     const params = req.params
 
     if(!params?.id){
         return res.json({message:"Invalid id"})
     }
 
     if(!name || !size || !price || !description){
         return res.json({message:"Please provide all the fields"})
     }
 
     let productImage ;
     if(req.file){
         productImage = req.file.path
     }
 
     const updatedProduct = await prisma.product.update({
         where:{
             id:params?.id
         },
         data:{
             name,
             description,
             price,
             size,
             image:productImage
         },
     })
     
     return res.json({message:"Product updated successfully", payload : updatedProduct})
    } catch (error) {
       return res.json({message:"Error updating product", error})
    
   }
}


const deleteProduct = async (req, res) => {
  try {
      const params = req.params
  
      if(!params?.id){
          return res.json({message:"Invalid id"})
      }
  
      await prisma.product.delete({
          where:{
              id:params?.id
          }
      })
  
      return res.json({message:'Product deleted successfuly'})
    } catch (error) {
      return res.json({message:'error deleting product', error})
      
    }
}


const productForCategory =async (req, res) => {
    try {
        const categories = await prisma.product.findMany({
            // select: {
            //   category: true,
            // },
            distinct: ['category'],
          });
          
        //   const firstProductPerCategory = await Promise.all(
        //     categories.map(category => 
        //       prisma.product.findFirst({
        //         where: { category: category.category },
        //         orderBy: { id: 'asc' },
        //       }).then(product => ({
                
        //         product
        //       }))
        //     )
        //   );
          
        if (req && req.query.category) {
            const products = await prisma.product.findMany({
                where:{
                    category:req?.query?.category
                }
            })
            return res.json({message:'success getting products based on category', payload:products})
        }

        return res.json({message:'Success getting category based first product', payload:categories})
    } catch (error) {
        return res.json({message:'error getting category based product', error})
        
    }
}

const searchProductBasedOnText = async (req, res) => {
    try {
      

        if(req.query && req.query.price || req.query.size){
            const products = await prisma.product.findMany({
                where:{
                    AND:[
                        {price:{
                            lte: Number(req.query?.price)
                        
                        }},
                        {size:req.query.size}
                    ]
                }
            })
            return res.json({message:'success searching product based on price', payload:products})
        } else if(req.query && req.query.search){
            const products =  await prisma.product.findMany({
                where:{
                    OR:[
                        {
                            name:{
                                contains: req.query?.search,
                                mode:"insensitive"
                            }},
                            {
                                description:{
                                    contains: req.query?.search,
                                    mode:'insensitive'
                                }}
                            ]
                        }
                    })
            return res.json({message:'success searching product', payload:products})
        
        } 
return res.json({message:"Empty query",})
    } catch (error) {
        return res.json({message:'error searching product', error})
        
    }
    
}


const searchBasedOnPrice = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where:{
                price:{
                    lte: req.query?.price
                }
            }
        })
        return res.json({message:'success searching product based on price', payload:products})
    } catch (error) {
        return res.json({message:'error searching product based on price', error})
        
    }

}

export {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts,
    productForCategory,
    searchProductBasedOnText
}