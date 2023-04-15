import { body, validationResult } from 'express-validator';
import {provinces, license, type} from "../utils/values";

export const studioValidate = () => {
  return [
    body('name')
    .exists()
    .withMessage("نام نمی تواند خالی باشد")
    .isString()
    .isLength({min:3,max:25})
    .withMessage("نام استودیو میتواند حداقل ۳ و حداکثر ۲۵ کاراکتر باشد")
    .bail(),
    body("email")
    .exists()
    .withMessage('ایمیل نمی تواند خالی باشد')
    .isEmail()
    .withMessage('لطفا یک ایمیل معتبر وارد کنید')
    .isString()
    .bail(),
    body('studioId')
    .exists()
    .withMessage('شناسه استودیو نمی تواند خالی باشد')
    .isLength({min:3,max:20})
    .withMessage('شناسه استودیو باید حداقل ۳ و حداکثر ۲۰ کاراکتر باشد')
    .isString()
    .bail(),
    body('phoneNumber')
    .exists()
    .withMessage('شماره تلفن همراه نمی تواند خالی باشد')
    .matches(/^09\d{9}$/)
    .withMessage('لطفا یک شماره همراه معتبر وارد کنید')
    .isNumeric()
    .bail(),
    body('address')
    .exists()
    .withMessage('آدرس نمی تواند خالی باشد')
    .isString()
    .isLength({min:10,max:300})
    .withMessage('طول آدرس بیشتر یا کمتر از حدمجاز است')
    .bail(),
    body('province')
    .exists()
    .withMessage('نام استان نمی تواند خالی باشد')
    .isIn(provinces)
    .withMessage('نام شهر نامعتبر است')
    .bail(),
    body('type')
    .exists()
    .isString()
    .isIn(type)
    .bail(),
    body('license')
    .exists()
    .isString()
    .isIn(license)
    .bail(),
    body('description')
    .exists()
    .withMessage('توضیحات نمی تواند خالی باشد')
    .isString()
    .isLength({min:10,max:300})
    .withMessage('متن توضیحات بیشتر یا کمتر از حد مجاز است')
    .bail(),
    body('passWord')
    .exists()
    .withMessage('رمز عبوز نمی تواند خالی باشد')
    .isStrongPassword({minLength:5,minUppercase:1,minSymbols:1})
    .withMessage('رمز عبور حداقل باید شامل یک حرف بزرگ یک نماد و پنج کاراکتر باشد')
    .bail(),
    body('telegramId')
    .exists()
    .withMessage('شناسه تلگرام نمی تواند خالی باشد')
    .matches(/^\d{9,10}$/)
    .withMessage('یک شناسه تلگرام معتبر وارد کنید')
    .bail(),
    body('pricePerHour')
    .exists()
    .withMessage('مبلغ بر اساس ساعت نمی تواند خالی باشد')
    .isInt()
    .withMessage('مبلغ بر اساس ساعت را بصورت عدد و تومان وارد کنید برای مثال : 100000 صدهزار تومان هر ساعت')
    .bail()
  ];
};

export const signupValidate = () => {
  return [
    body('email')
    .exists()
    .withMessage('ایمیل نمی تواند خالی باشد')
    .isString()
    .isEmail()
    .withMessage('لطفا یک ایمیل معتبر وارد کنید')
    .bail(),
    body('passWord')
    .exists()
    .withMessage('رمز عبور نمی تواند خالی باشد')
    .isString()
    .bail()
  ];
};
export const updateValidate = () => {
  return [
    body('name')
    .exists()
    .withMessage("نام نمی تواند خالی باشد")
    .isString()
    .isLength({min:3,max:25})
    .withMessage("نام استودیو میتواند حداقل ۳ و حداکثر ۲۵ کاراکتر باشد")
    .bail(),
    body("email")
    .exists()
    .withMessage('ایمیل نمی تواند خالی باشد')
    .isEmail()
    .withMessage('لطفا یک ایمیل معتبر وارد کنید')
    .isString()
    .bail(),
    body('studioId')
    .exists()
    .withMessage('شناسه استودیو نمی تواند خالی باشد')
    .isLength({min:3,max:20})
    .withMessage('شناسه استودیو باید حداقل ۳ و حداکثر ۲۰ کاراکتر باشد')
    .isString()
    .bail(),
    body('phoneNumber')
    .exists()
    .withMessage('شماره تلفن همراه نمی تواند خالی باشد')
    .matches(/^09\d{9}$/)
    .withMessage('لطفا یک شماره همراه معتبر وارد کنید')
    .isNumeric()
    .bail(),
    body('address')
    .exists()
    .withMessage('آدرس نمی تواند خالی باشد')
    .isString()
    .isLength({min:10,max:300})
    .withMessage('طول آدرس بیشتر یا کمتر از حدمجاز است')
    .bail(),
    body('province')
    .exists()
    .withMessage('نام استان نمی تواند خالی باشد')
    .isIn(provinces)
    .withMessage('نام شهر نامعتبر است')
    .bail(),
    body('type')
    .exists()
    .isString()
    .isIn(type)
    .bail(),
    body('license')
    .exists()
    .isString()
    .isIn(license)
    .bail(),
    body('description')
    .exists()
    .withMessage('توضیحات نمی تواند خالی باشد')
    .isString()
    .isLength({min:10,max:300})
    .withMessage('متن توضیحات بیشتر یا کمتر از حد مجاز است')
    .bail(),
    body('telegramId')
    .exists()
    .withMessage('شناسه تلگرام نمی تواند خالی باشد')
    .matches(/^\d{9,10}$/)
    .withMessage('یک شناسه تلگرام معتبر وارد کنید')
    .bail(),
    body('pricePerHour')
    .exists()
    .withMessage('مبلغ بر اساس ساعت نمی تواند خالی باشد')
    .isInt()
    .withMessage('مبلغ بر اساس ساعت را بصورت عدد و تومان وارد کنید برای مثال : 100000 صدهزار تومان هر ساعت')
    .bail()
  ];
};

export const studioValidateErr = (req, res, next)=>{
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