shader_type canvas_item;

uniform float strength : hint_range(0.0, 0.01, 0.0001) = 0.0054;
uniform float speed : hint_range(0.0, 2.0, 0.01) = 0.48;

void fragment() {
    vec2 uv = UV;
    float upper = 1.0 - smoothstep(0.52, 0.78, uv.y);
    float left = smoothstep(0.34, 0.38, uv.x) * (1.0 - smoothstep(0.49, 0.54, uv.x)) * upper;
    float right = smoothstep(0.72, 0.76, uv.x) * (1.0 - smoothstep(0.89, 0.93, uv.x)) * upper;
    float mask = clamp(left + right, 0.0, 1.0);
    float wave = sin(uv.y * 18.0 + TIME * speed) * 0.62 + sin(uv.y * 8.0 - TIME * speed * 0.63) * 0.38;
    vec2 sample_uv = uv + vec2(wave * strength * mask, 0.0);
    vec4 col = texture(TEXTURE, sample_uv);
    col.a *= mask;
    COLOR = col;
}
