-- Add database constraints for contact form security
ALTER TABLE contact_submissions 
ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
ADD CONSTRAINT check_email_length CHECK (char_length(email) <= 255),
ADD CONSTRAINT check_phone_length CHECK (char_length(phone) <= 50),
ADD CONSTRAINT check_message_length CHECK (char_length(message) <= 2000),
ADD CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Make required fields non-nullable for better data integrity
ALTER TABLE contact_submissions 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN email SET NOT NULL;