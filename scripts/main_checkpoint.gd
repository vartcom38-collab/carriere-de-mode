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
var clouds: Array[Dictionary] = []
var window_layer: Control
var light_beam: Polygon2D
var page_glint: Polygon2D

func _ready() -> void:
    atelier.texture = load("res://assets/menu_atelier.webp") as Texture2D
    atelier.modulate.a = 0.0
    atelier.pivot_offset = Vector2(800, 450)
    atelier.scale = Vector2.ONE
    menu_hitboxes.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    warm_light.color = Color(1.0, 0.84, 0.56, 0.0)
    _build_living_layers()
    _make_dust()
    _connect_menu()
    await get_tree().process_frame
    _play_intro()

func _process(delta: float) -> void:
    idle_time += delta
    if not cinematic_running:
        warm_light.color.a = 0.010 + (sin(idle_time * 0.34) + 1.0) * 0.010
        if light_beam:
            light_beam.modulate.a = 0.14 + (sin(idle_time * 0.24) + 1.0) * 0.035
        if page_glint:
            page_glint.position.y = sin(idle_time * 0.62) * 1.4
            page_glint.rotation = sin(idle_time * 0.48) * 0.004
    _animate_window(delta)
    _animate_dust(delta)

func _input(event: InputEvent) -> void:
    if cinematic_running and event is InputEventMouseButton and event.pressed:
        _skip_intro()

func _play_intro() -> void:
    cinematic_running = true
    intro_tween = create_tween()
    intro_tween.tween_interval(0.45)
    intro_tween.tween_property(title, "modulate:a", 0.92, 1.0).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.62, 1.35).set_delay(0.25)
    intro_tween.tween_interval(1.0)
    intro_tween.tween_property(title, "modulate:a", 0.0, 0.65)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.0, 0.65)
    intro_tween.parallel().tween_property(skip, "modulate:a", 0.34, 0.5)
    intro_tween.tween_interval(0.1)
    intro_tween.tween_property(atelier, "modulate:a", 1.0, 1.35).set_trans(Tween.TRANS_SINE)
    intro_tween.parallel().tween_property(black, "color:a", 0.0, 1.55)
    intro_tween.parallel().tween_property(window_layer, "modulate:a", 1.0, 1.75)
    intro_tween.tween_interval(0.55)
    intro_tween.tween_callback(_finish_intro)

func _skip_intro() -> void:
    if intro_tween and intro_tween.is_valid():
        intro_tween.kill()
    title.modulate.a = 0.0
    subtitle.modulate.a = 0.0
    skip.modulate.a = 0.0
    black.color.a = 0.0
    atelier.modulate.a = 1.0
    window_layer.modulate.a = 1.0
    _finish_intro()

func _finish_intro() -> void:
    cinematic_running = false
    skip.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_PASS
    create_tween().tween_property(menu_hitboxes, "modulate:a", 1.0, 0.55)

func _build_living_layers() -> void:
    window_layer = Control.new()
    window_layer.name = "WindowLife"
    window_layer.position = Vector2(254, 0)
    window_layer.size = Vector2(430, 505)
    window_layer.clip_contents = true
    window_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
    window_layer.modulate.a = 0.0
    add_child(window_layer)
    move_child(window_layer, 1)

    for i in range(3):
        var cloud := Polygon2D.new()
        cloud.polygon = PackedVector2Array([
            Vector2(-70, 16), Vector2(-45, -6), Vector2(-17, -12), Vector2(7, 1),
            Vector2(30, -11), Vector2(58, -5), Vector2(82, 17), Vector2(58, 29),
            Vector2(-45, 30)
        ])
        cloud.color = Color(1.0, 0.98, 0.91, 0.18 + i * 0.025)
        cloud.position = Vector2(80 + i * 150, 110 + i * 66)
        cloud.scale = Vector2(0.8 + i * 0.12, 0.5 + i * 0.05)
        window_layer.add_child(cloud)
        clouds.append({"node": cloud, "speed": 4.0 + i * 1.7})

    for i in range(2):
        var bird := Polygon2D.new()
        bird.polygon = PackedVector2Array([
            Vector2(-12, 1), Vector2(-5, -4), Vector2(0, 0), Vector2(6, -5),
            Vector2(13, 0), Vector2(6, -1), Vector2(0, 4), Vector2(-6, -1)
        ])
        bird.color = Color(0.22, 0.18, 0.14, 0.58)
        bird.position = Vector2(-35 - i * 160, 155 + i * 75)
        bird.scale = Vector2(0.72 - i * 0.12, 0.72 - i * 0.12)
        window_layer.add_child(bird)
        birds.append({"node": bird, "speed": 23.0 + i * 8.0, "phase": i * 2.4})

    light_beam = Polygon2D.new()
    light_beam.polygon = PackedVector2Array([
        Vector2(470, 190), Vector2(655, 175), Vector2(1180, 760), Vector2(760, 790)
    ])
    light_beam.color = Color(1.0, 0.88, 0.56, 0.14)
    add_child(light_beam)
    move_child(light_beam, 2)

    page_glint = Polygon2D.new()
    page_glint.polygon = PackedVector2Array([
        Vector2(845, 515), Vector2(1222, 544), Vector2(1190, 667), Vector2(878, 622)
    ])
    page_glint.color = Color(1.0, 0.98, 0.84, 0.025)
    add_child(page_glint)
    move_child(page_glint, 3)

func _animate_window(delta: float) -> void:
    for c in clouds:
        var n := c["node"] as Polygon2D
        n.position.x += float(c["speed"]) * delta
        if n.position.x > 510.0:
            n.position.x = -100.0
    for b in birds:
        var n := b["node"] as Polygon2D
        n.position.x += float(b["speed"]) * delta
        n.position.y += sin(idle_time * 2.0 + float(b["phase"])) * 2.0 * delta
        n.rotation = sin(idle_time * 4.0 + float(b["phase"])) * 0.045
        if n.position.x > 500.0:
            n.position.x = -80.0 - randf_range(0.0, 180.0)
            n.position.y = randf_range(120.0, 290.0)

func _connect_menu() -> void:
    var names := ["NewGame", "Load", "Options", "Credits", "Quit"]
    for node_name in names:
        var b := menu_hitboxes.get_node(node_name) as Button
        b.mouse_entered.connect(func(): _hover_button(b))
        b.mouse_exited.connect(func(): hover_glow.visible = false)
    $MenuHitboxes/NewGame.pressed.connect(_new_game)
    $MenuHitboxes/Load.pressed.connect(func(): _soft_feedback("Les sauvegardes arriveront avec le premier chapitre."))
    $MenuHitboxes/Options.pressed.connect(func(): _soft_feedback("Options sonores et graphiques — bientôt."))
    $MenuHitboxes/Credits.pressed.connect(func(): _soft_feedback("Carrière de Mode — prototype de production."))
    $MenuHitboxes/Quit.pressed.connect(func(): _soft_feedback("La démo navigateur reste ouverte."))

func _hover_button(button: Button) -> void:
    hover_glow.position = button.position
    hover_glow.size = button.size
    hover_glow.visible = true
    hover_glow.color = Color(1.0, 0.91, 0.62, 0.08)

func _new_game() -> void:
    if cinematic_running:
        return
    cinematic_running = true
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    hover_glow.visible = false
    atelier.pivot_offset = Vector2(1005, 590)
    var t := create_tween()
    t.set_parallel(true)
    t.tween_property(menu_hitboxes, "modulate:a", 0.0, 0.38)
    t.tween_property(atelier, "scale", Vector2(1.42, 1.42), 2.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
    t.tween_property(atelier, "position", Vector2(-210, -95), 2.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
    t.tween_property(warm_light, "color:a", 0.07, 2.0)
    t.set_parallel(false)
    t.tween_interval(1.15)
    t.tween_property(black, "color:a", 1.0, 0.72)

func _soft_feedback(text: String) -> void:
    var label := Label.new()
    label.text = text
    label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    label.add_theme_font_size_override("font_size", 18)
    label.add_theme_color_override("font_color", Color(0.31, 0.22, 0.15))
    label.position = Vector2(430, 820)
    label.size = Vector2(740, 42)
    label.modulate.a = 0.0
    add_child(label)
    var t := create_tween()
    t.tween_property(label, "modulate:a", 1.0, 0.22)
    t.tween_interval(1.35)
    t.tween_property(label, "modulate:a", 0.0, 0.3)
    t.tween_callback(label.queue_free)

func _make_dust() -> void:
    for _i in range(34):
        var p := ColorRect.new()
        var s := randf_range(1.0, 2.2)
        p.size = Vector2(s, s)
        p.position = Vector2(randf_range(430.0, 1490.0), randf_range(150.0, 790.0))
        p.color = Color(1.0, 0.94, 0.72, randf_range(0.04, 0.14))
        p.mouse_filter = Control.MOUSE_FILTER_IGNORE
        $Dust.add_child(p)
        dust.append({"node": p, "speed": randf_range(2.0, 5.5), "phase": randf_range(0.0, TAU)})

func _animate_dust(delta: float) -> void:
    for d in dust:
        var n := d["node"] as ColorRect
        n.position.y -= float(d["speed"]) * delta
        n.position.x += sin(idle_time * 0.42 + float(d["phase"])) * 1.3 * delta
        if n.position.y < 100.0:
            n.position = Vector2(randf_range(470.0, 1490.0), randf_range(690.0, 840.0))
