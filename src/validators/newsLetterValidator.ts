import { body, validationResult } from 'express-validator';

export const emailValidate = () => {
  return [
    body('email')
    .exists()
    .isString()
    .isEmail()
    .withMessage("email is invalid!")
  ];
};

export const newsLetterValidate = (req, res, next)=>{
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
}