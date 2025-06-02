import Joi from "joi";

const requestBodySchema = Joi.object({
  firstName: Joi.string().min(3).pattern(/^\S+$/).optional().messages({
    "string.min": "First name must be at least 3 characters.",
    "string.empty": "First name is required.",
    "string.pattern.base": "First name must not contain spaces.",
  }),

  lastName: Joi.string().min(3).pattern(/^\S+$/).optional().messages({
    "string.min": "Last name must be at least 3 characters.",
    "string.empty": "Last name is required.",
    "string.pattern.base": "Last name must not contain spaces.",
  }),

  email: Joi.string().email().optional().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid email address.",
  }),

  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
      "password strength"
    )
    .optional()
    .messages({
      "string.empty": "Password is required.",
      "string.pattern.name":
        "Password must be at least 8 characters long, with at least one uppercase letter, one number, and one special character.",
    }),
});

const verifyRequestBody = (req, res, next) => {
  // const { firstName, lastName, email, password } = req.body;

  const { error, value } = requestBodySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});

    return res.status(400).json({ errors });
  }

  req.validBody = value;
  next();
};

export default verifyRequestBody;
