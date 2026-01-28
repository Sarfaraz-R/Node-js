import { body } from 'express-validator';

const registrationValidation = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email cannot be empty')
      .toLowerCase()
      .isEmail()
      .withMessage('Invalid email format'),

    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username cannot be Empty')
      .isLength({ min: 3 })
      .withMessage('Username must be atLeast 3 characters long'),

    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage('password must be atLeast 5 characters long'),
  ];
};
// It returns an array of middleware, where each middleware validates
// some fields coming inside req.body.
//
// If validation fails, the error messages are internally stored by
// express-validator and attached to the request object.
//
// Later, validationResult(req) is used (usually inside validateRequest middleware)
// to extract the array of validation errors.

// note : this not a middleware this is function which executes by itself manually by calling validate()
//   and attaches every error msg to req object

const loginValidation = () => {
  return [
    body('email')
      .trim()
      .optional()
      .toLowerCase()
      .isEmail()
      .withMessage('Invalid email format'),

    body('username')
      .trim()
      .optional()
      .isLength({ min: 3 })
      .withMessage('Username must be atLeast 3 characters long'),

    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage('password must be atLeast 5 characters long'),
  ];
};

export { registrationValidation, loginValidation };
