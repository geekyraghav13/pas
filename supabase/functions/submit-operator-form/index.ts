import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';
import { Resend } from "npm:resend@2.0.0";

// --- Configuration ---
const supabaseUrl = 'https://fqillsrszasalfhunilr.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const NOTIFICATION_EMAILS = ["contactus@kalagato.co", "aman@kalagato.co"];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// --- Rate Limiting ---
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const key = `rate_limit_${clientIP}`;

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
    rateLimitStore.set(key, { firstRequest: now, count: 1 });
    return false;
  }

  if (existingData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existingData.count++;
  return false;
}

// --- Validation ---
function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

interface OperatorFormData {
  name: string;
  email: string;
  phone?: string;
  linkedin_profile?: string;
  acquisition_budget?: string;
  git_profile?: string;
  interest_description?: string;
}

function validateOperatorForm(data: any): {
  isValid: boolean;
  errors: string[];
  sanitizedData?: OperatorFormData;
} {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.length > 100) {
    errors.push('Name is required and must be 100 characters or less.');
  }

  if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
    errors.push('A valid email is required.');
  } else if (data.email.length > 255) {
    errors.push('Email must be 255 characters or less.');
  }

  if (data.phone && (typeof data.phone !== 'string' || data.phone.length > 50)) {
    errors.push('Phone number must be 50 characters or less.');
  }
  if (data.linkedin_profile && (typeof data.linkedin_profile !== 'string' || data.linkedin_profile.length > 255)) {
    errors.push('LinkedIn profile URL is too long.');
  }
  if (data.acquisition_budget && (typeof data.acquisition_budget !== 'string' || data.acquisition_budget.length > 100)) {
    errors.push('Acquisition budget must be 100 characters or less.');
  }
  if (data.git_profile && (typeof data.git_profile !== 'string' || data.git_profile.length > 255)) {
    errors.push('Git profile URL must be 255 characters or less.');
  }
  if (data.interest_description && (typeof data.interest_description !== 'string' || data.interest_description.length > 5000)) {
    errors.push('Description must be 5000 characters or less.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const sanitizedData: OperatorFormData = {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    linkedin_profile: data.linkedin_profile ? sanitizeInput(data.linkedin_profile) : undefined,
    acquisition_budget: data.acquisition_budget ? sanitizeInput(data.acquisition_budget) : undefined,
    git_profile: data.git_profile ? sanitizeInput(data.git_profile) : undefined,
    interest_description: data.interest_description ? sanitizeInput(data.interest_description) : undefined
  };

  return { isValid: true, errors: [], sanitizedData };
}

// --- Main Handler ---
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const requestData = await req.json();
    const validation = validateOperatorForm(requestData);

    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors);
      return new Response(JSON.stringify({ error: 'Validation failed', details: validation.errors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { error } = await supabase
      .from('operator_submissions')
      .insert([validation.sanitizedData!]);

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit form. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      await resend.emails.send({
        from: "Operator Signup <onboarding@resend.dev>",
        to: NOTIFICATION_EMAILS,
        subject: "New Operator Sign Up Submission",
        html: `
          <h2>New Operator Sign Up</h2>
          <p><strong>Name:</strong> ${validation.sanitizedData!.name}</p>
          <p><strong>Email:</strong> ${validation.sanitizedData!.email}</p>
          ${validation.sanitizedData!.phone ? `<p><strong>Phone:</strong> ${validation.sanitizedData!.phone}</p>` : ''}
          ${validation.sanitizedData!.linkedin_profile ? `<p><strong>LinkedIn:</strong> ${validation.sanitizedData!.linkedin_profile}</p>` : ''}
          ${validation.sanitizedData!.acquisition_budget ? `<p><strong>Budget:</strong> ${validation.sanitizedData!.acquisition_budget}</p>` : ''}
          ${validation.sanitizedData!.git_profile ? `<p><strong>Git Profile:</strong> ${validation.sanitizedData!.git_profile}</p>` : ''}
          ${validation.sanitizedData!.interest_description ? `<p><strong>Interest:</strong> ${validation.sanitizedData!.interest_description}</p>` : ''}
          <p><strong>Submitted from IP:</strong> ${clientIP}</p>
        `
      });

      console.log('Notification emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send notification emails:', emailError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Form submitted successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({
      error: 'An unexpected error occurred. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
