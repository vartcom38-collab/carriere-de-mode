shader_type canvas_item;

uniform float flutter : hint_range(0.0, 0.01, 0.0001) = 0.0024;
uniform float speed : hint_range(0.0, 3.0, 0.01) = 1.05;

void fragment() {
    vec2 uv = UV;
    float page = smoothstep(0.49, 0.54, uv.x) * (1.0 - smoothstep(0.72, 0.77, uv.x)) * smoothstep(0.65, 0.72, uv.y) * (1.0 - smoothstep(0.91, 0.97, uv.y));
    float free_edge = smoothstep(0.60, 0.75, uv.x);
    float top_weight = 1.0 - smoothstep(0.84, 0.96, uv.y);
    float mask = clamp(page, 0.0, 1.0);
    float x_shift = sin(TIME * speed + uv.y * 19.0) * flutter * mask * free_edge * top_weight;
    float y_shift = sin(TIME * speed * 1.35 + uv.x * 13.0) * flutter * 0.65 * mask * top_weight;
    vec4 col = texture(TEXTURE, uv + vec2(x_shift, y_shift));
    col.a *= mask;
    COLOR = col;
}
