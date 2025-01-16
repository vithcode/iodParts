import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Mock user validation (replace this with a database check in production)
  const validUser = body.email === 'test@gmail.com' && body.password === 'Vitthal@123';
  if (!validUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password',
    });
  }

  // Define JWT payload and secret key
  const payload = {
    email: body.email,
    role: 'user', // You can add more claims (e.g., role) as needed
  };
  const secretKey = 'secret'; // Replace with a secure key in production
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token valid for 1 hour

  // Return the generated token
  return { token };
});
