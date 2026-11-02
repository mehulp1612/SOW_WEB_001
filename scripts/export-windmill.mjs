import { readFileSync, writeFileSync } from 'node:fs';
const content = readFileSync(new URL('../windmill/contact_intake.ts', import.meta.url), 'utf8');
const fields = ['request_id', 'name', 'email', 'message', 'website'];
const flow = {
  summary: 'contact_intake',
  description: 'WEB-001: authenticated synchronous intake; confirms durable, duplicate-safe storage.',
  value: {
    modules: [{ id: 'store', summary: 'Store inquiry and confirm request ID', value: {
      type: 'rawscript', language: 'bun', content,
      input_transforms: {
        db: { type: 'javascript', expr: 'resource("f/web001/supabase")' },
        ...Object.fromEntries(fields.map(field => [field, { type: 'javascript', expr: `flow_input.${field}` }])),
      },
    } }],
  },
  schema: {
    type: 'object', additionalProperties: false, required: fields,
    properties: Object.fromEntries(fields.map(field => [field, { type: 'string', ...(field === 'website' ? { default: '', enum: [''] } : {}) }])),
  },
};
const output = new URL('../windmill/contact_intake.flow.json', import.meta.url);
const serialized = `${JSON.stringify(flow, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== serialized) throw new Error('Flow definition is stale. Run npm run windmill:export.');
} else writeFileSync(output, serialized);
