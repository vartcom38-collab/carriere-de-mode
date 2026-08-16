shader_type canvas_item;

// Mouvement extrêmement léger et localisé dans les rideaux.
// L'image entière reste fixe : on ne simule pas un zoom de caméra.
uniform float curtain_strength : hint_range(0.0, 0.004, 0.0001) = 0.0014;
uniform float curtain_speed : hint_range(0.0, 1.0, 0.01) = 0.34;

void fragment() {
    vec2 uv = UV;
    float t = TIME * curtain_speed;

    float upper = 1.0 - smoothstep(0.50, 0.72, uv.y);

    float left_curtain = smoothstep(0.31, 0.35, uv.x)
        * (1.0 - smoothstep(0.46, 0.51, uv.x))
        * upper;

    float right_curtain = smoothstep(0.68, 0.73, uv.x)
        * (1.0 - smoothstep(0.84, 0.89, uv.x))
        * upper;

    float curtain_mask = clamp(left_curtain + right_curtain, 0.0, 1.0);
    float wave = sin(uv.y * 18.0 + t) * 0.62 + sin(uv.y * 8.0 - t * 0.73) * 0.38;

    uv.x += curtain_mask * wave * curtain_strength;
    COLOR = texture(TEXTURE, uv);
}
