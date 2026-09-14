extends Control
class_name CinematicPlayer

signal cinematic_finished
signal cinematic_skipped

@onready var video: VideoStreamPlayer = $Video
@onready var skip_button: Button = $SkipButton
@onready var fade: ColorRect = $Fade

var _playing := false

func _ready() -> void:
	visible = false
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	video.finished.connect(_on_video_finished)
	skip_button.pressed.connect(skip)

func play_ogv(path: String) -> void:
	var stream := VideoStreamTheora.new()
	stream.file = path
	video.stream = stream
	video.expand = true
	video.loop = false
	visible = true
	mouse_filter = Control.MOUSE_FILTER_STOP
	_playing = true
	fade.modulate.a = 1.0
	video.play()
	var tween := create_tween()
	tween.tween_property(fade, "modulate:a", 0.0, 0.35)

func skip() -> void:
	if not _playing:
		return
	_playing = false
	video.stop()
	visible = false
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	cinematic_skipped.emit()
	cinematic_finished.emit()

func _on_video_finished() -> void:
	if not _playing:
		return
	_playing = false
	var tween := create_tween()
	tween.tween_property(fade, "modulate:a", 1.0, 0.25)
	await tween.finished
	visible = false
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	cinematic_finished.emit()
