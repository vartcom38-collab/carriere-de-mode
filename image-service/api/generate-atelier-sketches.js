const sleep = ms => new Promise(r => setTimeout(r, ms));
const cleanBase64 = s => String(s || '').replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
const names = a => (Array.isArray(a) ? a : []).map(x => typeof x === 'string' ? x : x?.name).filter(Boolean);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    if (!process.env.MAGNIFIC_API_KEY) return res.status(503).json({ error: 'MAGNIFIC_API_KEY_missing' });

    const body = req.body || {};
    const board = body.board || {};
    const client = body.client || {};
    const designer = body.designer || {};
    const components = Array.isArray(board.components) ? board.components : [];
    if (!components.length) return res.status(400).json({ error: 'board_requires_element' });

    const capture = cleanBase64(body.moodboardImage || '');
    const generatedPrompt = String(body.generatedPrompt || board.generatedPrompt || '').trim();
    const componentNames = components.map(x => x?.name).filter(Boolean);
    const categories = [...new Set(components.map(x => x?.category).filter(Boolean))];
    const promptTokens = [
      ...(Array.isArray(board.componentPromptTokens) ? board.componentPromptTokens : []),
      ...components.map(x => x?.promptToken)
    ].map(String).map(x => x.trim()).filter(Boolean);

    const refs = board.references || {};
    const materialNames = [...new Set([
      ...names(refs.materials),
      ...components.filter(x => x?.moodKind === 'material' || x?.category === 'material').map(x => x?.name).filter(Boolean)
    ])];
    const colorNames = [...new Set([
      ...names(refs.colors),
      ...components.filter(x => x?.moodKind === 'color' || x?.category === 'color').map(x => x?.name).filter(Boolean)
    ])];
    const patternNames = [...new Set([
      ...names(refs.patterns),
      ...components.filter(x => x?.moodKind === 'pattern' || x?.category === 'pattern').map(x => x?.name).filter(Boolean)
    ])];
    const noteTexts = [
      ...(Array.isArray(board.notes) ? board.notes : []).map(x => typeof x === 'string' ? x : x?.noteText || x?.text).filter(Boolean),
      ...components.map(x => x?.noteText).filter(Boolean)
    ];

    const layout = components.map((x, i) => ({
      instanceId: x?.instanceId || `element-${i + 1}`,
      catalogId: x?.catalogId || '',
      variantId: x?.variantId || x?.referenceId || '',
      name: x?.name || `element ${i + 1}`,
      category: x?.category || x?.moodKind || '',
      moodKind: x?.moodKind || '',
      tags: Array.isArray(x?.tags) ? x.tags : [],
      x: Number(x?.x || 0), y: Number(x?.y || 0),
      width: Number(x?.width || 0), height: Number(x?.height || 0),
      scale: Number(x?.scale || 1),
      rotation: Number(x?.rotation ?? x?.rotate ?? 0),
      zIndex: Number(x?.zIndex ?? i + 5),
      order: Number(x?.order ?? i)
    }));

    const boardW = Math.max(1, Number(board?.capture?.width || Math.max(...layout.map(x => x.x + x.width), 1)));
    const boardH = Math.max(1, Number(board?.capture?.height || Math.max(...layout.map(x => x.y + x.height), 1)));
    const centerX = boardW / 2, centerY = boardH / 2;
    const maxArea = Math.max(1, ...layout.map(x => x.width * x.height * x.scale * x.scale));

    const layoutText = layout.slice().sort((a, b) => a.zIndex - b.zIndex).map(x => {
      const cx = x.x + x.width / 2, cy = x.y + x.height / 2;
      const area = x.width * x.height * x.scale * x.scale;
      const size = area >= maxArea * .72 ? 'large / dominant' : area <= maxArea * .24 ? 'small / supporting' : 'medium';
      const horizontal = cx < centerX * .72 ? 'left' : cx > centerX * 1.28 ? 'right' : 'center';
      const vertical = cy < centerY * .72 ? 'upper' : cy > centerY * 1.28 ? 'lower' : 'middle';
      return `${x.name} [${x.category || 'reference'}; variant ${x.variantId || 'default'}] is ${size}, placed ${vertical}-${horizontal}, rotation ${Math.round(x.rotation)}°, layer ${x.zIndex}, tags ${x.tags.join(', ') || 'none'}`;
    }).join(' | ');

    const proximity = [];
    for (let i = 0; i < layout.length; i++) for (let j = i + 1; j < layout.length; j++) {
      const a = layout[i], b = layout[j];
      const ax = a.x + a.width / 2, ay = a.y + a.height / 2;
      const bx = b.x + b.width / 2, by = b.y + b.height / 2;
      const d = Math.hypot(ax - bx, ay - by);
      const threshold = Math.max(120, (a.width + b.width + a.height + b.height) / 5);
      if (d < threshold) proximity.push(`${a.name} is visually grouped with ${b.name}`);
      const overlap = !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
      if (overlap) proximity.push(`${a.name} overlaps ${b.name}; layer order ${a.zIndex}<${b.zIndex}`);
    }
    noteTexts.forEach(text => {
      if (String(text).trim()) proximity.push(`Designer note on moodboard: ${String(text).trim().slice(0, 180)}`);
    });

    const clientText = [
      client.name && `Client: ${client.name}`,
      client.garment && `Requested garment: ${client.garment}`,
      client.occasion && `Occasion: ${client.occasion}`,
      client.style && `Desired style: ${client.style}`,
      Array.isArray(client.paletteLiked) && client.paletteLiked.length && `Preferred palette: ${client.paletteLiked.join(', ')}`,
      Array.isArray(client.paletteAvoid) && client.paletteAvoid.length && `Avoid colors: ${client.paletteAvoid.join(', ')}`,
      Array.isArray(client.materialsPreferred) && client.materialsPreferred.length && `Preferred materials: ${client.materialsPreferred.join(', ')}`,
      client.notes && `Client notes: ${client.notes}`,
      client.budget && `Budget: ${client.budget}`
    ].filter(Boolean).join('. ');

    const boardText = [
      componentNames.length && `Selected references: ${componentNames.join(', ')}`,
      categories.length && `Selected families: ${categories.join(', ')}`,
      materialNames.length && `Selected materials: ${materialNames.join(', ')}`,
      colorNames.length && `Selected colors: ${colorNames.join(', ')}`,
      patternNames.length && `Selected patterns: ${patternNames.join(', ')}`,
      !patternNames.length && 'No pattern selected: do not invent a dominant pattern',
      layoutText && `Visual composition: ${layoutText}`,
      proximity.length && `Spatial relationships and notes: ${proximity.join(' | ')}`,
      promptTokens.length && `Technical vocabulary: ${[...new Set(promptTokens)].join(' | ')}`,
      designer.level && `Designer technical level: ${designer.level}`
    ].filter(Boolean).join('. ');

    const styleLock = `Create a professional French fashion-designer croquis: one full-body fashion figure wearing ONE coherent finished outfit, hand-drawn graphite and ink with restrained marker/watercolor indications, elongated proportions, visible construction logic and textile behavior, warm off-white sketchbook paper, no photography, no 3D render, no labels, no collage, no UI. The moodboard is a DIRECTIONAL REFERENCE, not an image to reproduce literally. Read its hierarchy, grouping, scale, proximity, overlap and notes together with the structured data. Respect all explicitly selected materials, colors and patterns. Use only the selected garment vocabulary as dominant design ingredients. Never introduce an unselected dominant garment feature, material, color or pattern. The result must remain physically plausible.`;

    const variants = [
      { id: 'A', name: 'Interprétation fidèle', direction: 'Stay very faithful to the selected references, material/color choices, spatial hierarchy and client constraints. Resolve them into the clearest wearable proposal.' },
      { id: 'B', name: 'Interprétation mode', direction: 'Use the exact same selected references, materials, colors and hierarchy, but reinterpret proportion and relationships with a stronger contemporary fashion-editorial point of view.' },
      { id: 'C', name: 'Interprétation couture', direction: 'Use the exact same selected references, materials, colors and hierarchy, but push drape, construction and refinement toward couture without inventing a new dominant ingredient.' }
    ];

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-magnific-api-key': process.env.MAGNIFIC_API_KEY
    };

    async function classic(prompt, seed) {
      const r = await fetch('https://api.magnific.com/v1/ai/text-to-image', {
        method: 'POST', headers,
        body: JSON.stringify({
          prompt,
          negative_prompt: 'photorealistic photo, 3d render, mannequin photo, runway photo, multiple outfits, multiple people, collage, text, watermark, logo, UI, moodboard, distorted anatomy, extra limbs, unrelated dominant garment feature, unselected dominant color, unselected dominant pattern',
          guidance_scale: 2,
          seed,
          num_images: 1,
          styling: { effects: { framing: 'portrait' } },
          filter_nsfw: true
        })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(`magnific_text_${r.status}:${JSON.stringify(j).slice(0, 300)}`);
      const item = Array.isArray(j?.data) ? j.data[0] : null;
      const b64 = item?.base64 || null;
      const url = item?.url || item?.generated?.[0] || null;
      if (!b64 && !url) throw new Error('magnific_text_image_missing');
      return url || `data:image/png;base64,${b64}`;
    }

    async function referenced(prompt) {
      const r = await fetch('https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview', {
        method: 'POST', headers,
        body: JSON.stringify({ prompt, reference_images: [capture] })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(`magnific_reference_${r.status}:${JSON.stringify(j).slice(0, 300)}`);
      let d = j?.data || {};
      let generated = Array.isArray(d.generated) ? d.generated : [];
      if (generated[0]) return generated[0];
      const task = d.task_id;
      if (!task) throw new Error('magnific_reference_task_missing');
      for (let i = 0; i < 24; i++) {
        await sleep(1000);
        const q = await fetch(`https://api.magnific.com/v1/ai/gemini-2-5-flash-image-preview/${task}`, {
          headers: { 'Accept': 'application/json', 'x-magnific-api-key': process.env.MAGNIFIC_API_KEY }
        });
        const k = await q.json().catch(() => ({}));
        if (!q.ok) throw new Error(`magnific_reference_status_${q.status}`);
        d = k?.data || {};
        generated = Array.isArray(d.generated) ? d.generated : [];
        if (generated[0]) return generated[0];
        if (['FAILED', 'ERROR', 'CANCELLED'].includes(String(d.status || '').toUpperCase())) throw new Error('magnific_reference_failed');
      }
      throw new Error('magnific_reference_timeout');
    }

    async function generateOne(v, index) {
      const userDirection = generatedPrompt ? `\n\nATELIER GENERATED DIRECTION (authoritative):\n${generatedPrompt}` : '';
      const prompt = `${styleLock}${userDirection}\n\nCLIENT BRIEF: ${clientText || 'Personal creation.'}\n\nSTRUCTURED MOODBOARD: ${boardText}.\n\nVARIATION ${v.id}: ${v.direction}\nCreate exactly one complete fashion croquis proposal.`;
      const baseSeed = Number.isFinite(Number(body.seed)) ? Number(body.seed) : Date.now() % 1000000;
      const seed = Math.max(0, Math.min(1000000, (baseSeed + index * 7919) % 1000001));

      let url = null;
      let mode = 'text';
      let referenceError = null;
      if (capture) {
        try {
          url = await referenced(prompt);
          mode = 'reference-image';
        } catch (err) {
          referenceError = String(err?.message || err);
          console.warn(`[Atelier] reference generation ${v.id} failed, fallback to text:`, referenceError);
        }
      }
      if (!url) url = await classic(prompt, seed);
      return { id: v.id, name: v.name, direction: v.direction, url, provider: 'magnific', mode, referenceError, prompt };
    }

    const results = [];
    for (let i = 0; i < variants.length; i++) {
      results.push(await generateOne(variants[i], i));
    }

    if (results.length !== 3) return res.status(500).json({ error: 'atelier_requires_three_proposals' });
    return res.status(200).json({
      ok: true,
      provider: 'magnific',
      count: 3,
      proposals: results,
      meta: {
        components: componentNames,
        layout,
        relationships: proximity,
        materials: materialNames,
        colors: colorNames,
        patterns: patternNames,
        notes: noteTexts,
        moodboardReferenceUsed: results.some(x => x.mode === 'reference-image'),
        referenceFallbacks: results.filter(x => x.referenceError).map(x => ({ id: x.id, error: x.referenceError })),
        captureError: board?.capture?.error || null,
        generatedPromptUsed: !!generatedPrompt
      }
    });
  } catch (err) {
    console.error('[Atelier sketch generation failed]', err);
    return res.status(500).json({ error: 'atelier_sketch_generation_failed', detail: String(err?.message || err) });
  }
}
