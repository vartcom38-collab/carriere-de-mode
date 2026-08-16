extends Control

@onready var atelier: TextureRect = $Atelier
@onready var warm_light: ColorRect = $WarmLight
@onready var menu_hitboxes: Control = $MenuHitboxes
@onready var hover_glow: ColorRect = $MenuHitboxes/HoverGlow
@onready var black: ColorRect = $Cinematic/Black
@onready var title: Label = $Cinematic/Title
@onready var subtitle: Label = $Cinematic/Subtitle
@onready var skip: Label = $Cinematic/Skip

var cinematic_running := true
var intro_tween: Tween
var idle_time := 0.0
var dust: Array[Dictionary] = []

func _ready() -> void:
    menu_hitboxes.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    atelier.modulate.a = 0.0
    atelier.pivot_offset = Vector2(640.0, 480.0)
    atelier.scale = Vector2(1.018, 1.018)
    _make_dust()
    _connect_menu()
    await get_tree().process_frame
    _play_intro()

func _process(delta: float) -> void:
    idle_time += delta

    # L'accueil reste presque immobile : seule la lumière respire doucement.
    # Pas de zoom permanent de l'illustration entière.
    if not cinematic_running:
        warm_light.color.a = 0.018 + (sin(idle_time * 0.34) + 1.0) * 0.012

    _animate_dust(delta)

func _input(event: InputEvent) -> void:
    if not cinematic_running:
        return

    if event is InputEventMouseButton and event.pressed:
        _skip_intro()
    elif event is InputEventScreenTouch and event.pressed:
        _skip_intro()

func _play_intro() -> void:
    cinematic_running = true
    intro_tween = create_tween()
    intro_tween.set_parallel(false)

    # On entendra l'ambiance avant cette première apparition quand les sons seront branchés.
    intro_tween.tween_interval(0.55)
    intro_tween.tween_property(title, "modulate:a", 1.0, 1.05).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.78, 1.35).set_delay(0.30)
    intro_tween.tween_interval(1.05)
    intro_tween.tween_property(title, "modulate:a", 0.0, 0.70)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.0, 0.65)
    intro_tween.parallel().tween_property(skip, "modulate:a", 0.42, 0.55)
    intro_tween.tween_interval(0.12)

    # Révélation de l'atelier : très léger mouvement de caméra, uniquement pendant l'intro.
    intro_tween.tween_property(atelier, "modulate:a", 1.0, 1.55).set_trans(Tween.TRANS_SINE)
    intro_tween.parallel().tween_property(black, "color:a", 0.0, 1.75)
    intro_tween.parallel().tween_property(atelier, "scale", Vector2.ONE, 3.1).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
    intro_tween.tween_interval(0.65)
    intro_tween.tween_callback(_finish_intro)

func _skip_intro() -> void:
    if intro_tween and intro_tween.is_valid():
        intro_tween.kill()

    title.modulate.a = 0.0
    subtitle.modulate.a = 0.0
    skip.modulate.a = 0.0
    black.color.a = 0.0
    atelier.modulate.a = 1.0
    atelier.scale = Vector2.ONE
    _finish_intro()

func _finish_intro() -> void:
    cinematic_running = false
    skip.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_PASS
    var t := create_tween()
    t.tween_property(menu_hitboxes, "modulate:a", 1.0, 0.60).set_trans(Tween.TRANS_SINE)

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
    $MenuHitboxes/Options.pressed.connect(func(): _soft_feedback("Options — prochaine étape de l'accueil."))
    $MenuHitboxes/Credits.pressed.connect(func(): _soft_feedback("Carrière de Mode"))
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
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    hover_glow.visible = false

    # Le carnet ouvert est le portail vers la première scène narrative.
    atelier.pivot_offset = Vector2(650.0, 805.0)

    var t := create_tween()
    t.set_parallel(true)
    t.tween_property(menu_hitboxes, "modulate:a", 0.0, 0.40)
    t.tween_property(atelier, "scale", Vector2(1.72, 1.72), 2.55).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
    t.tween_property(warm_light, "color:a", 0.11, 2.1)
    t.set_parallel(false)
    t.tween_interval(1.25)
    t.tween_property(black, "color:a", 1.0, 0.82).set_trans(Tween.TRANS_SINE)
    t.tween_callback(func(): _soft_feedback("Le carnet s'ouvre…"))

func _quit_game() -> void:
    get_tree().quit()

func _soft_feedback(text: String) -> void:
    var label := Label.new()
    label.text = text
    label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    label.add_theme_font_size_override("font_size", 18)
    label.add_theme_color_override("font_color", Color(0.96, 0.90, 0.78))
    label.position = Vector2(320.0, 860.0)
    label.size = Vector2(640.0, 42.0)
    label.modulate.a = 0.0
    label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    add_child(label)

    var t := create_tween()
    t.tween_property(label, "modulate:a", 1.0, 0.22)
    t.tween_interval(1.35)
    t.tween_property(label, "modulate:a", 0.0, 0.30)
    t.tween_callback(label.queue_free)

func _make_dust() -> void:
    for _i in range(34):
        var particle := ColorRect.new()
        var size := randf_range(1.0, 2.4)
        particle.size = Vector2(size, size)
        particle.position = Vector2(randf_range(430.0, 1200.0), randf_range(165.0, 780.0))
        particle.color = Color(1.0, 0.94, 0.72, randf_range(0.06, 0.20))
        particle.mouse_filter = Control.MOUSE_FILTER_IGNORE
        $Dust.add_child(particle)
        dust.append({
            "node": particle,
            "speed": randf_range(2.2, 6.0),
            "phase": randf_range(0.0, TAU)
        })

func _animate_dust(delta: float) -> void:
    for data in dust:
        var particle := data["node"] as ColorRect
        particle.position.y -= float(data["speed"]) * delta
        particle.position.x += sin(idle_time * 0.42 + float(data["phase"])) * 1.5 * delta

        if particle.position.y < 130.0:
            particle.position = Vector2(randf_range(450.0, 1200.0), randf_range(700.0, 820.0))
