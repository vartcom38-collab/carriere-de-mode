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
var birds: Array[Dictionary] = []

func _ready() -> void:
    menu_hitboxes.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    atelier.modulate.a = 0.0

    # RÈGLE DE L'ACCUEIL : la caméra reste fixe.
    # Aucun zoom ou mouvement permanent de l'image entière.
    atelier.pivot_offset = Vector2(640.0, 480.0)
    atelier.scale = Vector2.ONE

    _make_dust()
    _make_birds()
    _connect_menu()
    await get_tree().process_frame
    _play_intro()

func _process(delta: float) -> void:
    idle_time += delta

    # Une respiration lumineuse très faible. Le mouvement principal vient
    # des éléments localisés : rideaux (shader), poussières et oiseaux.
    if not cinematic_running:
        warm_light.color.a = 0.008 + (sin(idle_time * 0.30) + 1.0) * 0.006

    _animate_dust(delta)
    _animate_birds(delta)

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

    intro_tween.tween_interval(0.55)
    intro_tween.tween_property(title, "modulate:a", 1.0, 1.05).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.78, 1.35).set_delay(0.30)
    intro_tween.tween_interval(1.05)
    intro_tween.tween_property(title, "modulate:a", 0.0, 0.70)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.0, 0.65)
    intro_tween.parallel().tween_property(skip, "modulate:a", 0.42, 0.55)
    intro_tween.tween_interval(0.12)

    # Révélation de l'atelier par fondu uniquement : PAS de zoom.
    intro_tween.tween_property(atelier, "modulate:a", 1.0, 1.55).set_trans(Tween.TRANS_SINE)
    intro_tween.parallel().tween_property(black, "color:a", 0.0, 1.75)
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

    # Ici seulement, après avoir choisi Nouvelle partie, la caméra se dirige
    # vers le carnet : ce mouvement appartient à la transition de jeu.
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
        particle.position = Vector2(randf_range(430.0, 1120.0), randf_range(165.0, 780.0))
        particle.color = Color(1.0, 0.94, 0.72, randf_range(0.05, 0.16))
        particle.mouse_filter = Control.MOUSE_FILTER_IGNORE
        $Dust.add_child(particle)
        dust.append({
            "node": particle,
            "speed": randf_range(2.0, 5.2),
            "phase": randf_range(0.0, TAU)
        })

func _animate_dust(delta: float) -> void:
    for data in dust:
        var particle := data["node"] as ColorRect
        particle.position.y -= float(data["speed"]) * delta
        particle.position.x += sin(idle_time * 0.38 + float(data["phase"])) * 1.35 * delta

        if particle.position.y < 130.0:
            particle.position = Vector2(randf_range(450.0, 1120.0), randf_range(700.0, 820.0))

func _make_birds() -> void:
    for i in range(3):
        var bird := Line2D.new()
        bird.width = randf_range(1.1, 1.7)
        bird.default_color = Color(0.20, 0.14, 0.10, randf_range(0.28, 0.48))
        bird.points = PackedVector2Array([
            Vector2(-5.0, 1.0),
            Vector2(0.0, -2.0),
            Vector2(5.0, 1.0)
        ])
        bird.position = Vector2(440.0 + i * 90.0, 170.0 + i * 42.0)
        var bird_scale := randf_range(0.65, 1.0)
        bird.scale = Vector2(bird_scale, bird_scale)
        $Dust.add_child(bird)
        birds.append({
            "node": bird,
            "speed": randf_range(7.0, 12.0),
            "base_y": bird.position.y,
            "phase": randf_range(0.0, TAU)
        })

func _animate_birds(delta: float) -> void:
    for data in birds:
        var bird := data["node"] as Line2D
        bird.position.x += float(data["speed"]) * delta
        bird.position.y = float(data["base_y"]) + sin(idle_time * 0.55 + float(data["phase"])) * 4.0

        var flap := sin(idle_time * 3.0 + float(data["phase"])) * 1.4
        bird.points = PackedVector2Array([
            Vector2(-5.0, 1.0 + flap),
            Vector2(0.0, -2.0),
            Vector2(5.0, 1.0 + flap)
        ])

        if bird.position.x > 965.0:
            bird.position.x = randf_range(405.0, 455.0)
            data["base_y"] = randf_range(150.0, 320.0)
