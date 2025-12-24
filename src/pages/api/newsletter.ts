import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Email is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid email format',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const buttondownApiKey = import.meta.env.BUTTONDOWN_API_KEY;

    if (!buttondownApiKey) {
      console.error('BUTTONDOWN_API_KEY is not set');
      return new Response(
        JSON.stringify({
          error: 'Newsletter service is not configured',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Subscribe to Buttondown
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${buttondownApiKey}`,
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!response.ok) {
      // Log only the status code to avoid exposing sensitive information
      console.error(`Buttondown API error: Status ${response.status}`);
      
      // Optionally extract a safe error message if available
      try {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText) as { message?: string; error?: string };
          // Only log sanitized error identifiers, not the full response
          if (errorData.message || errorData.error) {
            console.error(`Buttondown API error message: ${errorData.message || errorData.error}`);
          }
        } catch {
          // JSON parsing failed, don't log raw text to avoid exposing sensitive data
        }
      } catch {
        // Failed to read response body, status code already logged above
      }

      return new Response(
        JSON.stringify({
          error: 'Failed to subscribe. Please try again later.',
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed!',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);

    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

