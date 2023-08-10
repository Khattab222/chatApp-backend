
let stackVar;
const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch(err => {

            stackVar = err.stack
            return next(new Error(err.message, { cause: 500 }))
        })
    }
}

const globalError = (err,req,res,next) =>{
    if (err) {
        return res.status(err['cause'] || 500).json({message:'fail response', Error:err.message,stack:stackVar})
    }
}

export {asyncHandler,globalError}