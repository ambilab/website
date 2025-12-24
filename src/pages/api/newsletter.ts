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
      let errorData: unknown;
      let errorText: string | undefined;
      
      try {
        errorData = await response.json();
        console.error('Buttondown API error:', errorData);
      } catch (jsonError) {
        // Fallback to text if JSON parsing fails
        try {
          errorText = await response.text();
          console.error('Buttondown API error (non-JSON):', errorText);
        } catch (textError) {
          console.error('Buttondown API error: Failed to read response body', textError);
        }
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

