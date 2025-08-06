import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = 'https://fqillsrszasalfhunilr.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting storage - in production, use Redis or similar
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per hour per IP

// Input validation schemas
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  // Remove any potential HTML/script tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim();
}

function validateContactForm(data: any): { isValid: boolean; errors: string[]; sanitizedData?: ContactFormData } {
  const errors: string[] = [];
  
  // Validate required fields
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (data.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!validateEmail(data.email)) {
    errors.push('Please provide a valid email address');
  } else if (data.email.length > 255) {
    errors.push('Email must be 255 characters or less');
  }
  
  // Validate optional fields
  if (data.phone && (typeof data.phone !== 'string' || data.phone.length > 50)) {
    errors.push('Phone number must be 50 characters or less');
  }
  
  if (data.message && (typeof data.message !== 'string' || data.message.length > 2000)) {
    errors.push('Message must be 2000 characters or less');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // Sanitize inputs
  const sanitizedData: ContactFormData = {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    message: data.message ? sanitizeInput(data.message) : undefined,
  };
  
  return { isValid: true, errors: [], sanitizedData };
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const key = `rate_limit_${clientIP}`;
  
  // Clean up old entries
  for (const [k, data] of rateLimitStore.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(k);
    }
  }
  
  const existingData = rateLimitStore.get(key);
  
  if (!existingData) {
    rateLimitStore.set(key, { firstRequest: now, count: 1 });
    return false;
  }
  
  if (now - existingData.firstRequest > RATE_LIMIT_WINDOW) {
    // Reset the window
    rateLimitStore.set(key, { firstRequest: now, count: 1 });
    return false;
  }
  
  if (existingData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  existingData.count++;
  return false;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // Check rate limiting
    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ 
        error: 'Too many requests. Please try again later.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate request body
    const requestData = await req.json();
    const validation = validateContactForm(requestData);
    
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors);
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: validation.errors 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Insert validated and sanitized data
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([validation.sanitizedData]);

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to submit contact form. Please try again.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Contact form submitted successfully from IP: ${clientIP}`);
    
    // Send notification emails
    try {
      await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>",
        to: ["contactus@kalagato.co", "aman@kalagato.co"],
        subject: "New Contact Form Submission",
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validation.sanitizedData!.name}</p>
          <p><strong>Email:</strong> ${validation.sanitizedData!.email}</p>
          ${validation.sanitizedData!.phone ? `<p><strong>Phone:</strong> ${validation.sanitizedData!.phone}</p>` : ''}
          ${validation.sanitizedData!.message ? `<p><strong>Message:</strong> ${validation.sanitizedData!.message}</p>` : ''}
          <p><strong>Submitted from IP:</strong> ${clientIP}</p>
        `,
      });
      console.log('Notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send notification emails:', emailError);
      // Don't fail the request if email sending fails
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});