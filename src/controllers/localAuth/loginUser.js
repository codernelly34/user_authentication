// Sign In
const loginAccount = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.validBody;

  if (!email || !password) {
    throw new AppError(
      "All field are required (first and last name, emails, password)",
      400,
      "ValidationError"
    );
  }
});

export default loginAccount;
