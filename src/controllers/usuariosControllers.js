
const handleResponse = (res, status, message, data = nuul) => {
  res.status(status).json({
    status,
    message,
    data,
  })
}

export const createUsuarios = async (req, res, next) => {

  

}