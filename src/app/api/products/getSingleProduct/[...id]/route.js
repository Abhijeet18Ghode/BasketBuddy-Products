import { NextResponse } from "next/server";
import mongooseConnection from "../../../../../../lib/mongoose"
import Products from "../../../../../../model/Product"


export async function GET(req,{params}) {
    const {id} = params
    console.log("ID = ",id)
    try {
        if (req.method === "GET"){
            await mongooseConnection()
            const AllProducts = await Products.findOne({
                _id : id
            })
            return NextResponse.json({AllProducts},{status:200})
        }
    } catch (error) {
        return NextResponse.json({message : error})
        
    }
    
}