const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,10}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const verifyRequestBody = (req, res, next) => {
  const { name, email, username, password, usernameOrEmail } = req.body;
  console.log(name, email, username, password, usernameOrEmail);

  if (name) {
    const nameParts = name.trim().split(" ");
    if (nameParts.length < 2 || nameParts.some((part) => part.length < 3)) {
      return res.status(400).json({
        message: "Name must include both first and last names, each at least 3 characters.",
      });
    }
  }

  if (email) {
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
  }

  if (password) {
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ characters, with uppercase, lowercase, number, and special character.",
      });
    }
  }

  if (username) {
    if (!usernamePattern.test(username)) {
      return res.status(400).json({
        message: "Username must be 3-10 characters, only letters, numbers, and underscores.",
      });
    }
  }

  if (usernameOrEmail) {
    if (!usernamePattern.test(usernameOrEmail) && !emailPattern.test(usernameOrEmail)) {
      return res.status(400).json({
        message: "Enter a valid username or email address.",
      });
    }
  }

  next();
};

export default verifyRequestBody;
