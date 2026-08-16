shader_type canvas_item;

uniform float drift : hint_range(0.0, 0.006, 0.0001) = 0.0015;
uniform float speed : hint_range(0.0, 2.0, 0.01) = 0.58;

void fragment() {
    vec2 uv = UV;
    float card = smoothstep(0.72, 0.77, uv.x) * (1.0 - smoothstep(0.96, 0.99, uv.x)) * smoothstep(0.73, 0.79, uv.y) * (1.0 - smoothstep(0.97, 0.99, uv.y));
    float mask = clamp(card, 0.0, 1.0);
    vec2 offset = vec2(sin(TIME * speed), cos(TIME * speed * 0.82)) * drift * mask;
    vec4 col = texture(TEXTURE, uv + offset);
    col.a *= mask;
    COLOR = col;
}
