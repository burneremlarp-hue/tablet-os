import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('user_workspace')
      .select('*')
      .eq('id', 'my_workspace')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || {});
  }

  if (req.method === 'POST') {
    const { installed_apps, open_tabs, wallpaper } = req.body;

    const { data, error } = await supabase
      .from('user_workspace')
      .upsert({
        id: 'my_workspace',
        installed_apps,
        open_tabs,
        wallpaper,
        updated_at: new Date().toISOString()
      });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  }
}
