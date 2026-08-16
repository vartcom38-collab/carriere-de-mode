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
    atelier.pivot_offset = Vector2(820, 520)
    atelier.scale = Vector2(1.075, 1.075)
    _make_dust()
    _connect_menu()
    await get_tree().process_frame
    _play_intro()

func _process(delta: float) -> void:
    idle_time += delta
    if not cinematic_running:
        var breathe := 1.0 + sin(idle_time * 0.22) * 0.0025
        atelier.scale = Vector2(breathe, breathe)
        warm_light.color.a = 0.022 + (sin(idle_time * 0.38) + 1.0) * 0.012
    _animate_dust(delta)

func _input(event: InputEvent) -> void:
    if cinematic_running and event is InputEventMouseButton and event.pressed:
        _skip_intro()

func _play_intro() -> void:
    cinematic_running = true
    intro_tween = create_tween()
    intro_tween.set_parallel(false)
    intro_tween.tween_interval(0.55)
    intro_tween.tween_property(title, "modulate:a", 1.0, 1.15).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.78, 1.55).set_delay(0.35)
    intro_tween.tween_interval(1.15)
    intro_tween.tween_property(title, "modulate:a", 0.0, 0.8)
    intro_tween.parallel().tween_property(subtitle, "modulate:a", 0.0, 0.7)
    intro_tween.parallel().tween_property(skip, "modulate:a", 0.45, 0.6)
    intro_tween.tween_interval(0.15)
    intro_tween.tween_property(atelier, "modulate:a", 1.0, 1.6).set_trans(Tween.TRANS_SINE)
    intro_tween.parallel().tween_property(black, "color:a", 0.0, 1.8)
    intro_tween.parallel().tween_property(atelier, "scale", Vector2.ONE, 3.4).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
    intro_tween.tween_interval(0.75)
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
    t.tween_property(menu_hitboxes, "modulate:a", 1.0, 0.65)

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

func _new_game() -> void:
    if cinematic_running:
        return
    cinematic_running = true
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    hover_glow.visible = false
    atelier.pivot_offset = Vector2(885, 610)
    var t := create_tween()
    t.set_parallel(true)
    t.tween_property(menu_hitboxes, "modulate:a", 0.0, 0.45)
    t.tween_property(atelier, "scale", Vector2(1.52, 1.52), 2.6).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
    t.tween_property(warm_light, "color:a", 0.12, 2.2)
    t.set_parallel(false)
    t.tween_interval(1.5)
    t.tween_property(black, "color:a", 1.0, 0.9)
    t.tween_callback(func(): _soft_feedback("Prochaine scène : ouverture du carnet et début de votre histoire."))

func _soft_feedback(text: String) -> void:
    var label := Label.new()
    label.text = text
    label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    label.add_theme_font_size_override("font_size", 19)
    label.add_theme_color_override("font_color", Color(0.96, 0.90, 0.78))
    label.position = Vector2(430, 820)
    label.size = Vector2(740, 42)
    label.modulate.a = 0.0
    add_child(label)
    var t := create_tween()
    t.tween_property(label, "modulate:a", 1.0, 0.25)
    t.tween_interval(1.6)
    t.tween_property(label, "modulate:a", 0.0, 0.35)
    t.tween_callback(label.queue_free)

func _make_dust() -> void:
    for _i in range(40):
        var p := ColorRect.new()
        var s := randf_range(1.0, 2.7)
        p.size = Vector2(s, s)
        p.position = Vector2(randf_range(520.0, 1510.0), randf_range(180.0, 820.0))
        p.color = Color(1.0, 0.94, 0.72, randf_range(0.08, 0.26))
        p.mouse_filter = Control.MOUSE_FILTER_IGNORE
        $Dust.add_child(p)
        dust.append({"node": p, "speed": randf_range(3.0, 8.0), "phase": randf_range(0.0, TAU)})

func _animate_dust(delta: float) -> void:
    for d in dust:
        var n := d["node"] as ColorRect
        n.position.y -= float(d["speed"]) * delta
        n.position.x += sin(idle_time * 0.45 + float(d["phase"])) * 2.0 * delta
        if n.position.y < 120.0:
            n.position = Vector2(randf_range(560.0, 1510.0), randf_range(670.0, 860.0))
