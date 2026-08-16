shader_type canvas_item;

uniform float sway : hint_range(0.0, 0.01, 0.0001) = 0.0040;
uniform float speed : hint_range(0.0, 2.0, 0.01) = 0.58;

void fragment() {
    vec2 uv = UV;
    float left = smoothstep(0.39, 0.43, uv.x) * (1.0 - smoothstep(0.54, 0.59, uv.x)) * smoothstep(0.48, 0.58, uv.y) * (1.0 - smoothstep(0.87, 0.94, uv.y));
    float right = smoothstep(0.59, 0.64, uv.x) * (1.0 - smoothstep(0.77, 0.83, uv.x)) * smoothstep(0.48, 0.58, uv.y) * (1.0 - smoothstep(0.88, 0.95, uv.y));
    float mask = clamp(left + right, 0.0, 1.0);
    float top_weight = 1.0 - smoothstep(0.76, 0.94, uv.y);
    float x_shift = sin(TIME * speed + uv.y * 11.0) * sway * mask * top_weight;
    float y_shift = cos(TIME * speed * 0.72 + uv.x * 10.0) * sway * 0.25 * mask * top_weight;
    vec4 col = texture(TEXTURE, uv + vec2(x_shift, y_shift));
    col.a *= mask;
    COLOR = col;
}
