extends Control

@onready var art_root: Control = $ArtRoot
@onready var menu_hitboxes: Control = $MenuHitboxes
@onready var touch_glow: ColorRect = $MenuHitboxes/TouchGlow
@onready var black: ColorRect = $Cinematic/Black
@onready var skip: Label = $Cinematic/Skip

var cinematic_running := true
var intro_tween: Tween

func _ready() -> void:
    art_root.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    touch_glow.visible = false
    skip.modulate.a = 0.0
    _connect_menu()
    await get_tree().process_frame
    _play_intro()

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
    intro_tween.set_parallel(true)
    intro_tween.tween_property(art_root, "modulate:a", 1.0, 1.35).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    intro_tween.tween_property(black, "color:a", 0.0, 1.55).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    intro_tween.tween_property(skip, "modulate:a", 0.34, 0.35).set_delay(0.25)
    intro_tween.set_parallel(false)
    intro_tween.tween_callback(_finish_intro)

func _skip_intro() -> void:
    if intro_tween and intro_tween.is_valid():
        intro_tween.kill()
    art_root.modulate.a = 1.0
    black.color.a = 0.0
    _finish_intro()

func _finish_intro() -> void:
    cinematic_running = false
    skip.modulate.a = 0.0
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_PASS

func _connect_menu() -> void:
    var buttons: Array[Button] = [
        $MenuHitboxes/NewGame,
        $MenuHitboxes/Continue,
        $MenuHitboxes/Options,
        $MenuHitboxes/Credits,
        $MenuHitboxes/Quit,
        $MenuHitboxes/Settings,
        $MenuHitboxes/Music
    ]
    for button in buttons:
        button.mouse_entered.connect(func(): _show_glow(button, 0.055))
        button.mouse_exited.connect(_hide_glow)
        button.button_down.connect(func(): _show_glow(button, 0.115))
        button.button_up.connect(_hide_glow)

    $MenuHitboxes/NewGame.pressed.connect(_start_new_game)
    $MenuHitboxes/Continue.pressed.connect(func(): _confirm_touch($MenuHitboxes/Continue))
    $MenuHitboxes/Options.pressed.connect(func(): _confirm_touch($MenuHitboxes/Options))
    $MenuHitboxes/Credits.pressed.connect(func(): _confirm_touch($MenuHitboxes/Credits))
    $MenuHitboxes/Settings.pressed.connect(func(): _confirm_touch($MenuHitboxes/Settings))
    $MenuHitboxes/Music.pressed.connect(func(): _confirm_touch($MenuHitboxes/Music))
    $MenuHitboxes/Quit.pressed.connect(_quit_game)

func _start_new_game() -> void:
    if cinematic_running:
        return
    cinematic_running = true
    menu_hitboxes.mouse_filter = Control.MOUSE_FILTER_IGNORE
    _show_glow($MenuHitboxes/NewGame, 0.14)
    var tween := create_tween()
    tween.tween_property(black, "color:a", 1.0, 0.6).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
    tween.tween_callback(func(): get_tree().change_scene_to_file("res://scenes/CharacterCreator.tscn"))

func _show_glow(button: Button, alpha: float) -> void:
    if cinematic_running and button != $MenuHitboxes/NewGame:
        return
    touch_glow.position = button.position
    touch_glow.size = button.size
    touch_glow.color.a = alpha
    touch_glow.visible = true

func _hide_glow() -> void:
    touch_glow.visible = false

func _confirm_touch(button: Button) -> void:
    touch_glow.position = button.position
    touch_glow.size = button.size
    touch_glow.visible = true
    touch_glow.color.a = 0.13
    var tween := create_tween()
    tween.tween_property(touch_glow, "color:a", 0.0, 0.26).set_trans(Tween.TRANS_SINE)
    tween.tween_callback(func(): touch_glow.visible = false)

func _quit_game() -> void:
    get_tree().quit()
