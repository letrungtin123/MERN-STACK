export const wrapRequestHandler =(func)=>{
    return async (req,res,next) => {
        //xu ly bat dong bo trong express
        try{
            await fucn (req,res,next);//goi ham xu ly request

        } catch (error){
            return res.status(500).json({
                message: error.message,
                success: false,
            })
        }
    }
}