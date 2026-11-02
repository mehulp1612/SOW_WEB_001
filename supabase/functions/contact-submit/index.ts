import { createHandler } from './handler.ts';

Deno.serve(createHandler({
  allowedOrigin: Deno.env.get('ALLOWED_ORIGIN') ?? '',
  windmillUrl: Deno.env.get('WINDMILL_FLOW_URL') ?? '',
  windmillToken: Deno.env.get('WINDMILL_TOKEN') ?? '',
}));
