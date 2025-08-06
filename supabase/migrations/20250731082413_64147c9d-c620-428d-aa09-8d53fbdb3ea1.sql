-- Fix OTP expiry security warning by setting it to 1 hour (3600 seconds)
UPDATE auth.config 
SET value = '3600'
WHERE parameter = 'otp_exp';