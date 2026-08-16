extends Control

const STAGES := ["Identité", "Visage", "Cheveux", "Silhouette", "Tenue", "Aperçu"]
const FACE_OPTIONS := ["Doux", "Fin", "Ovale", "Rond", "Anguleux", "Délicat"]
const HAIR_OPTIONS := ["Chignon flou", "Carré souple", "Boucles", "Queue basse", "Ondulé", "Court"]
const BODY_OPTIONS := ["Petite", "Moyenne", "Grande", "Élancée"]
const OUTFIT_OPTIONS := ["Chemise + jean", "Robe noire", "Maille + pantalon", "Ensemble clair"]
const SIGNS := ["Étoile", "Cœur", "Lune", "Fleur", "Branche", "Nœud"]

@onready var stage_label: Label = find_child("StageTitle", true, false)
@onready var name_edit: LineEdit = find_child("NameEdit", true, false)
@onready var options_box: VBoxContainer = find_child("OptionsBox", true, false)
@onready var preview_name: Label = find_child("PreviewName", true, false)
@onready var preview_details: Label = find_child("PreviewDetails", true, false)
@onready var portrait: TextureRect = find_child("Portrait", true, false)
@onready var previous_button: Button = find_child("Previous", true, false)
@onready var next_button: Button = find_child("Next", true, false)
@onready var confirm_button: Button = find_child("Confirm", true, false)
@onready var tabs: HBoxContainer = find_child("Tabs", true, false)
@onready var progress_label: Label = find_child("Progress", true, false)

var stage := 0
var selected_pronouns := "Elle"
var selected_sign := 0
var selected_face := 0
var selected_hair := 0
var selected_body := 0
var selected_outfit := 0

func _ready() -> void:
    name_edit.text = str(GameState.character.get("first_name", "Camille"))
    name_edit.text_changed.connect(_on_name_changed)
    previous_button.pressed.connect(_previous_stage)
    next_button.pressed.connect(_next_stage)
    confirm_button.pressed.connect(_confirm_character)
    _connect_tabs()
    _style_static_buttons()
    _show_stage(0)

func _connect_tabs() -> void:
    for i in tabs.get_child_count():
        var button := tabs.get_child(i) as Button
        if button:
            button.pressed.connect(func(): _show_stage(i))

func _show_stage(index: int) -> void:
    stage = clampi(index, 0, STAGES.size() - 1)
    stage_label.text = STAGES[stage]
    progress_label.text = "%d / %d" % [stage + 1, STAGES.size()]
    name_edit.visible = stage == 0
    _clear_options()

    match stage:
        0:
            _build_identity()
        1:
            _build_choice_buttons(FACE_OPTIONS, selected_face, _select_face)
        2:
            _build_choice_buttons(HAIR_OPTIONS, selected_hair, _select_hair)
        3:
            _build_choice_buttons(BODY_OPTIONS, selected_body, _select_body)
        4:
            _build_choice_buttons(OUTFIT_OPTIONS, selected_outfit, _select_outfit)
        5:
            _build_final_preview()

    previous_button.disabled = stage == 0
    next_button.visible = stage < STAGES.size() - 1
    confirm_button.visible = stage == STAGES.size() - 1
    _update_tabs()
    _update_preview()

func _clear_options() -> void:
    for child in options_box.get_children():
        child.queue_free()

func _build_identity() -> void:
    _add_section_label("Pronoms")
    var pronouns := HBoxContainer.new()
    pronouns.add_theme_constant_override("separation", 12)
    for value in ["Elle", "Il", "Iel"]:
        var button := Button.new()
        button.text = value
        button.toggle_mode = true
        button.button_pressed = value == selected_pronouns
        button.custom_minimum_size = Vector2(130, 62)
        button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
        _style_choice_button(button, value == selected_pronouns)
        button.pressed.connect(func(): _select_pronouns(value))
        pronouns.add_child(button)
    options_box.add_child(pronouns)

    _add_section_label("Signe distinctif")
    _build_choice_buttons(SIGNS, selected_sign, _select_sign)

func _add_section_label(text: String) -> void:
    var label := Label.new()
    label.text = text
    label.add_theme_font_size_override("font_size", 23)
    label.add_theme_color_override("font_color", Color("51383c"))
    options_box.add_child(label)

func _build_choice_buttons(values: Array, selected: int, callback: Callable) -> void:
    var grid := GridContainer.new()
    grid.columns = 2
    grid.add_theme_constant_override("h_separation", 12)
    grid.add_theme_constant_override("v_separation", 12)
    for i in values.size():
        var button := Button.new()
        button.text = str(values[i])
        button.custom_minimum_size = Vector2(0, 72)
        button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
        _style_choice_button(button, i == selected)
        button.pressed.connect(func(): callback.call(i))
        grid.add_child(button)
    options_box.add_child(grid)

func _style_choice_button(button: Button, selected: bool) -> void:
    button.add_theme_font_size_override("font_size", 21)
    button.add_theme_color_override("font_color", Color.WHITE if selected else Color("573f43"))
    var normal := StyleBoxFlat.new()
    normal.bg_color = Color("c95d78") if selected else Color("fffaf5")
    normal.corner_radius_top_left = 20
    normal.corner_radius_top_right = 20
    normal.corner_radius_bottom_left = 20
    normal.corner_radius_bottom_right = 20
    normal.border_width_left = 2
    normal.border_width_top = 2
    normal.border_width_right = 2
    normal.border_width_bottom = 2
    normal.border_color = Color("c95d78") if selected else Color("e6c9ca")
    button.add_theme_stylebox_override("normal", normal)
    var hover := normal.duplicate()
    hover.bg_color = Color("d9768e") if selected else Color("fff0ef")
    button.add_theme_stylebox_override("hover", hover)
    button.add_theme_stylebox_override("pressed", hover)

func _style_static_buttons() -> void:
    for child in tabs.get_children():
        var button := child as Button
        if button:
            _style_tab(button, false)
    _style_nav_button(previous_button, false)
    _style_nav_button(next_button, true)
    _style_nav_button(confirm_button, true)

func _style_tab(button: Button, active: bool) -> void:
    button.add_theme_font_size_override("font_size", 16)
    button.add_theme_color_override("font_color", Color.WHITE if active else Color("6e5658"))
    var box := StyleBoxFlat.new()
    box.bg_color = Color("a74f68") if active else Color("f9ece9")
    box.corner_radius_top_left = 18
    box.corner_radius_top_right = 18
    box.corner_radius_bottom_left = 18
    box.corner_radius_bottom_right = 18
    button.add_theme_stylebox_override("normal", box)
    button.add_theme_stylebox_override("hover", box)
    button.add_theme_stylebox_override("pressed", box)

func _style_nav_button(button: Button, primary: bool) -> void:
    button.add_theme_font_size_override("font_size", 21)
    button.add_theme_color_override("font_color", Color.WHITE if primary else Color("684e51"))
    var box := StyleBoxFlat.new()
    box.bg_color = Color("c95d78") if primary else Color("f7e7e3")
    box.corner_radius_top_left = 24
    box.corner_radius_top_right = 24
    box.corner_radius_bottom_left = 24
    box.corner_radius_bottom_right = 24
    button.add_theme_stylebox_override("normal", box)
    button.add_theme_stylebox_override("hover", box)
    button.add_theme_stylebox_override("pressed", box)

func _build_final_preview() -> void:
    var text := Label.new()
    text.text = "Ta styliste est prête.\n\nSon apparence sera utilisée dans le jeu et servira de base aux futures cinématiques."
    text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    text.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
    text.add_theme_font_size_override("font_size", 24)
    text.add_theme_color_override("font_color", Color("52383e"))
    options_box.add_child(text)

func _select_pronouns(value: String) -> void:
    selected_pronouns = value
    _show_stage(stage)

func _select_sign(index: int) -> void:
    selected_sign = index
    _show_stage(stage)

func _select_face(index: int) -> void:
    selected_face = index
    _show_stage(stage)

func _select_hair(index: int) -> void:
    selected_hair = index
    _show_stage(stage)

func _select_body(index: int) -> void:
    selected_body = index
    _show_stage(stage)

func _select_outfit(index: int) -> void:
    selected_outfit = index
    _show_stage(stage)

func _on_name_changed(_value: String) -> void:
    _update_preview()

func _update_preview() -> void:
    var first_name := name_edit.text.strip_edges()
    if first_name.is_empty():
        first_name = "Votre styliste"
    preview_name.text = first_name
    preview_details.text = "%s · %s · %s · %s" % [
        selected_pronouns,
        FACE_OPTIONS[selected_face],
        HAIR_OPTIONS[selected_hair],
        OUTFIT_OPTIONS[selected_outfit]
    ]
    var face_tints := [Color.WHITE, Color("fff7f1"), Color("f8fff7"), Color("fff2f4"), Color("f4f6ff"), Color("fff8ea")]
    portrait.modulate = face_tints[selected_face]

func _update_tabs() -> void:
    for i in tabs.get_child_count():
        var button := tabs.get_child(i) as Button
        if button:
            button.text = str(i + 1)
            button.tooltip_text = STAGES[i]
            _style_tab(button, i == stage)

func _previous_stage() -> void:
    _show_stage(stage - 1)

func _next_stage() -> void:
    _show_stage(stage + 1)

func _confirm_character() -> void:
    var first_name := name_edit.text.strip_edges()
    if first_name.is_empty():
        first_name = "Camille"
    GameState.character = {
        "first_name": first_name,
        "pronouns": selected_pronouns,
        "distinctive_sign": SIGNS[selected_sign],
        "face": selected_face,
        "hair": selected_hair,
        "silhouette": selected_body,
        "outfit": selected_outfit
    }
    GameState.save_character()
    confirm_button.text = "%s est prête ✓" % first_name
    confirm_button.disabled = true
