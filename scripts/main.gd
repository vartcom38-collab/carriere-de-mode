extends Control

@onready var art_root: Control = $ArtRoot
@onready var warm_light: ColorRect = $ArtRoot/WarmLight
@onready var dust_root: Control = $ArtRoot/Dust
@onready var menu_hitboxes: Control = $MenuHitboxes
@onready var hover_glow: ColorRect = $MenuHitboxes/HoverGlow
@onready var black: ColorRect = $Cinematic/Black
@onready var intro_logo: TextureRect = $Cinematic/IntroLogo
@onready var subtitle: Label = $Cinematic/Subtitle
@onready var skip: Label = $Cinematic/Skip

var cinematic_running := true
var allow_intro_skip := false
var intro_tween: Tween
var idle_time := 0.0
var dust: Array[Dictionary] = []

func _ready() -> void:
    menu_hitboxes.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    art_root.modulate.a = 0.0
    art_root.scale = Vector2.ONE
    intro_logo.modulate.a = 0.0
    subtitle.modulate.a = 0.0
    skip.modulate.a = 0.0

    await get_tree().process_frame
    art_root.pivot_offset = size * 0.5

    _make_dust()
    _connect_menu()
    _play_intro()

func _process(delta: float) -> void:
    idle_time += delta

    # Caméra fixe sur l'accueil : uniquement une respiration lumineuse locale.
    if not cinematic_running:
        warm_light.color.a = 0.009 + (sin(idle_time * 0.30) + 1.0) * 0.006

    _animate_dust(delta)

func _input(event: InputEvent) -> void:
    if not allow_intro_skip:
        return

    if event is InputEventMouseButton and event.pressed:
        _skip_intro()
    elif event is InputEventScreenTouch and event.pressed:
        _skip_intro()

func _play_intro() -> void:
    cinematic_running = true
    allow_intro_skip = true
    intro_tween = create_tween()
    intro_tween.set_parallel(false)

    # Le nouveau logo est la signature de l'ouverture.
    intro_tween.tween_interval(0.45)
    intro_tween.tween_property(intro_logo, "modulate:a", 1.0, 1.10).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.88, 1.25).set_delay(0.40)
    intro_tween.tween_interval(1.10)
    intro_tween.tween_property(intro_logo, "modulate:a", 0.0, 0.72)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.0, 0.62)
    intro_tween.parallel().tween_property(skip, "modulate:a", 0.42, 0.45)
    intro_tween.tween_interval(0.10)

    # Révélation de l'atelier uniquement par fondu : aucun zoom sur l'accueil.
    intro_tween.tween_property(art_root, "modulate:a", 1.0, 1.45).set_trans(Tween.TRANS_SINE)
    intro_tween.parallel().tween_property(black, "color:a", 0.0, 1.65)
    intro_tween.tween_interval(0.60)
    intro_tween.tween_callback(_finish_intro)

func _skip_intro() -> void:
    if intro_tween and intro_tween.is_valid():
        intro_tween.kill()

    intro_logo.modulate.a = 0.0
    subtitle.modulate.a = 0.0
    skip.modulate.a = 0.0
    black.color.a = 0.0
    art_root.modulate.a = 1.0
    art_root.scale = Vector2.ONE
    _finish_intro()

func _finish_intro() -> void:
    cinematic_running = false
    allow_intro_skip = false
    skip.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_PASS

    var tween := create_tween()
    tween.tween_property(menu_hitboxes, "modulate:a", 1.0, 0.58).set_trans(Tween.TRANS_SINE)

func _connect_menu() -> void:
    var names := ["NewGame", "Load", "Options", "Credits", "Quit"]

    for node_name in names:
        var button := menu_hitboxes.get_node(node_name) as Button
        button.mouse_entered.connect(func(): _show_button_feedback(button))
        button.mouse_exited.connect(_hide_button_feedback)
        button.button_down.connect(func(): _show_button_feedback(button, 0.20))
        button.button_up.connect(_hide_button_feedback)

    $MenuHitboxes/NewGame.pressed.connect(_new_game)
    $MenuHitboxes/Load.pressed.connect(func(): _soft_feedback("Aucune sauvegarde pour le moment."))
    $MenuHitboxes/Options.pressed.connect(func(): _soft_feedback("Options — bientôt disponibles."))
    $MenuHitboxes/Credits.pressed.connect(func(): _soft_feedback("HAUTE COUTURE"))
    $MenuHitboxes/Quit.pressed.connect(_quit_game)

func _show_button_feedback(button: Button, alpha := 0.13) -> void:
    hover_glow.position = button.position
    hover_glow.size = button.size
    hover_glow.color.a = alpha
    hover_glow.visible = true

func _hide_button_feedback() -> void:
    hover_glow.visible = false

func _new_game() -> void:
    if cinematic_running:
        return

    cinematic_running = true
    allow_intro_skip = false
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    hover_glow.visible = false

    # Le seul mouvement de caméra arrive après Nouvelle partie : entrée dans le carnet.
    art_root.pivot_offset = Vector2(size.x * 0.56, size.y * 0.82)

    var tween := create_tween()
    tween.set_parallel(true)
    tween.tween_property(menu_hitboxes, "modulate:a", 0.0, 0.40)
    tween.tween_property(art_root, "scale", Vector2(1.68, 1.68), 2.55).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
    tween.tween_property(warm_light, "color:a", 0.11, 2.1)
    tween.set_parallel(false)
    tween.tween_interval(1.25)
    tween.tween_property(black, "color:a", 1.0, 0.82).set_trans(Tween.TRANS_SINE)
    tween.tween_callback(func(): _soft_feedback("Le carnet s'ouvre…"))

func _quit_game() -> void:
    get_tree().quit()

func _soft_feedback(text: String) -> void:
    var label := Label.new()
    label.text = text
    label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    label.add_theme_font_size_override("font_size", 18)
    label.add_theme_color_override("font_color", Color(0.96, 0.90, 0.78))
    label.position = Vector2(size.x * 0.25, size.y * 0.895)
    label.size = Vector2(size.x * 0.50, 42.0)
    label.modulate.a = 0.0
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    add_child(label)

    var tween := create_tween()
    tween.tween_property(label, "modulate:a", 1.0, 0.22)
    tween.tween_interval(1.35)
    tween.tween_property(label, "modulate:a", 0.0, 0.30)
    tween.tween_callback(label.queue_free)

func _make_dust() -> void:
    for _i in range(38):
        var particle := ColorRect.new()
        var particle_size := randf_range(1.0, 2.4)
        particle.size = Vector2(particle_size, particle_size)
        particle.position = Vector2(
            randf_range(size.x * 0.40, size.x * 0.88),
            randf_range(size.y * 0.16, size.y * 0.82)
        )
        particle.color = Color(1.0, 0.94, 0.72, randf_range(0.045, 0.14))
        particle.mouse_filter = Control.MOUSE_FILTER_IGNORE
        dust_root.add_child(particle)
        dust.append({
            "node": particle,
            "speed": randf_range(1.8, 4.8),
            "phase": randf_range(0.0, TAU)
        })

func _animate_dust(delta: float) -> void:
    for data in dust:
        var particle := data["node"] as ColorRect
        particle.position.y -= float(data["speed"]) * delta
        particle.position.x += sin(idle_time * 0.38 + float(data["phase"])) * 1.20 * delta

        if particle.position.y < size.y * 0.12:
            particle.position = Vector2(
                randf_range(size.x * 0.42, size.x * 0.88),
                randf_range(size.y * 0.72, size.y * 0.86)
            )
