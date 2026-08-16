extends Control

const STAGES := ["Identité", "Visage", "Cheveux", "Silhouette", "Tenue", "Aperçu"]
const FACE_OPTIONS := ["Doux", "Fin", "Ovale", "Rond", "Anguleux", "Délicat"]
const HAIR_OPTIONS := ["Chignon flou", "Carré souple", "Boucles", "Queue basse", "Ondulé", "Court"]
const BODY_OPTIONS := ["Petite", "Moyenne", "Grande", "Élancée"]
const OUTFIT_OPTIONS := ["Chemise + jean", "Robe noire", "Maille + pantalon", "Ensemble clair"]
const SIGNS := ["Étoile", "Cœur", "Lune", "Fleur", "Branche", "Nœud"]

@onready var stage_label: Label = $Margin/Layout/Content/LeftPanel/LeftMargin/LeftBox/StageTitle
@onready var name_edit: LineEdit = $Margin/Layout/Content/LeftPanel/LeftMargin/LeftBox/NameEdit
@onready var options_box: VBoxContainer = $Margin/Layout/Content/LeftPanel/LeftMargin/LeftBox/OptionsBox
@onready var preview_title: Label = $Margin/Layout/Content/PreviewPanel/PreviewMargin/PreviewBox/PreviewTitle
@onready var preview_name: Label = $Margin/Layout/Content/PreviewPanel/PreviewMargin/PreviewBox/PreviewName
@onready var preview_details: Label = $Margin/Layout/Content/PreviewPanel/PreviewMargin/PreviewBox/PreviewDetails
@onready var portrait: TextureRect = $Margin/Layout/Content/PreviewPanel/PreviewMargin/PreviewBox/PortraitFrame/Portrait
@onready var summary_label: Label = $Margin/Layout/Content/RightPanel/RightMargin/RightBox/Summary
@onready var right_panel: PanelContainer = $Margin/Layout/Content/RightPanel
@onready var left_panel: PanelContainer = $Margin/Layout/Content/LeftPanel
@onready var title_label: Label = $Margin/Layout/Header/Title
@onready var subtitle_label: Label = $Margin/Layout/Header/Subtitle
@onready var previous_button: Button = $Margin/Layout/Footer/Previous
@onready var next_button: Button = $Margin/Layout/Footer/Next
@onready var confirm_button: Button = $Margin/Layout/Footer/Confirm
@onready var tabs: HBoxContainer = $Margin/Layout/Tabs

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
    get_viewport().size_changed.connect(_adapt_layout)
    _connect_tabs()
    _adapt_layout()
    _show_stage(0)

func _adapt_layout() -> void:
    var window_size := DisplayServer.window_get_size()
    var portrait_screen := window_size.y > window_size.x
    right_panel.visible = not portrait_screen
    left_panel.custom_minimum_size.x = 400.0 if portrait_screen else 370.0
    title_label.add_theme_font_size_override("font_size", 42 if portrait_screen else 46)
    subtitle_label.add_theme_font_size_override("font_size", 20 if portrait_screen else 21)
    for child in tabs.get_children():
        var button := child as Button
        if button:
            button.add_theme_font_size_override("font_size", 16 if portrait_screen else 17)

func _connect_tabs() -> void:
    for i in tabs.get_child_count():
        var button := tabs.get_child(i) as Button
        if button:
            button.pressed.connect(func(): _show_stage(i))

func _show_stage(index: int) -> void:
    stage = clampi(index, 0, STAGES.size() - 1)
    stage_label.text = "%d. %s" % [stage + 1, STAGES[stage]]
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
    var pronoun_title := Label.new()
    pronoun_title.text = "Pronoms"
    pronoun_title.add_theme_font_size_override("font_size", 18)
    options_box.add_child(pronoun_title)

    var pronouns := HBoxContainer.new()
    pronouns.add_theme_constant_override("separation", 8)
    for value in ["Elle", "Il", "Iel"]:
        var button := Button.new()
        button.text = value
        button.toggle_mode = true
        button.button_pressed = value == selected_pronouns
        button.custom_minimum_size = Vector2(88, 58)
        button.add_theme_font_size_override("font_size", 18)
        button.pressed.connect(func(): _select_pronouns(value))
        pronouns.add_child(button)
    options_box.add_child(pronouns)

    var sign_title := Label.new()
    sign_title.text = "Signe distinctif"
    sign_title.add_theme_font_size_override("font_size", 18)
    options_box.add_child(sign_title)
    _build_choice_buttons(SIGNS, selected_sign, _select_sign)

func _build_choice_buttons(values: Array, selected: int, callback: Callable) -> void:
    var grid := GridContainer.new()
    grid.columns = 2
    grid.add_theme_constant_override("h_separation", 10)
    grid.add_theme_constant_override("v_separation", 10)
    for i in values.size():
        var button := Button.new()
        button.text = ("[x] " if i == selected else "") + str(values[i])
        button.custom_minimum_size = Vector2(0, 62)
        button.add_theme_font_size_override("font_size", 18)
        button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
        button.pressed.connect(func(): callback.call(i))
        grid.add_child(button)
    options_box.add_child(grid)

func _build_final_preview() -> void:
    var text := Label.new()
    text.text = "Votre styliste est prête.\n\nSon identité et son apparence seront conservées dans toute la partie. Vous pourrez faire évoluer son style plus tard depuis le carnet."
    text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    text.add_theme_font_size_override("font_size", 20)
    text.add_theme_color_override("font_color", Color(0.28, 0.20, 0.20, 0.92))
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

func _on_name_changed(value: String) -> void:
    _update_preview()

func _update_preview() -> void:
    var first_name := name_edit.text.strip_edges()
    if first_name.is_empty():
        first_name = "Votre styliste"
    preview_title.text = "APERÇU DE VOTRE STYLISTE"
    preview_name.text = first_name
    preview_details.text = "%s - %s   |   Visage %s   |   %s   |   %s" % [
        selected_pronouns,
        SIGNS[selected_sign],
        FACE_OPTIONS[selected_face],
        HAIR_OPTIONS[selected_hair],
        OUTFIT_OPTIONS[selected_outfit]
    ]
    summary_label.text = "Votre personnage apparaîtra dans les cinématiques et dans le jeu.\n\nChaque choix est conservé pour toute la suite de Nouvelle Partie."

    var face_tints := [
        Color(1.0, 1.0, 1.0, 1.0),
        Color(1.0, 0.97, 0.94, 1.0),
        Color(0.98, 1.0, 0.97, 1.0),
        Color(1.0, 0.95, 0.96, 1.0),
        Color(0.96, 0.97, 1.0, 1.0),
        Color(1.0, 0.98, 0.92, 1.0)
    ]
    portrait.modulate = face_tints[selected_face]

func _update_tabs() -> void:
    for i in tabs.get_child_count():
        var button := tabs.get_child(i) as Button
        if button:
            button.text = ("[%d] " % (i + 1) if i == stage else "%d " % (i + 1)) + STAGES[i]

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
    summary_label.text = "%s est prête à commencer sa nouvelle vie dans la mode.\n\nÉtape suivante : l'introduction narrative et le choix de la ville." % first_name
    confirm_button.disabled = true

func _go_back_to_menu() -> void:
    get_tree().change_scene_to_file("res://scenes/Main.tscn")
