extends Control

var elapsed: float = 0.0

func _ready() -> void:
    mouse_filter = Control.MOUSE_FILTER_IGNORE

func _process(delta: float) -> void:
    elapsed += delta
    queue_redraw()

func _draw() -> void:
    var w: float = size.x
    var h: float = size.y
    _draw_clouds(w, h)
    _draw_smoke(w, h)
    _draw_birds(w, h)

func _draw_clouds(w: float, h: float) -> void:
    var clouds: Array[Dictionary] = [
        {"x": 0.56, "y": 0.18, "speed": 0.008, "scale": 1.0, "alpha": 0.055},
        {"x": 0.69, "y": 0.24, "speed": 0.005, "scale": 1.18, "alpha": 0.045}
    ]

    for cloud: Dictionary in clouds:
        var x: float = (float(cloud["x"]) + fmod(elapsed * float(cloud["speed"]), 0.12)) * w
        if x > 0.78 * w:
            x = 0.50 * w + (x - 0.78 * w)
        var y: float = float(cloud["y"]) * h
        var s: float = float(cloud["scale"])
        var c: Color = Color(1.0, 1.0, 1.0, float(cloud["alpha"]))
        draw_circle(Vector2(x - 27.0 * s, y + 3.0 * s), 23.0 * s, c)
        draw_circle(Vector2(x, y - 4.0 * s), 31.0 * s, c)
        draw_circle(Vector2(x + 29.0 * s, y + 4.0 * s), 21.0 * s, c)

func _draw_smoke(w: float, h: float) -> void:
    var chimneys: Array[Vector2] = [Vector2(0.795 * w, 0.225 * h), Vector2(0.825 * w, 0.23 * h)]

    for i: int in range(chimneys.size()):
        var root: Vector2 = chimneys[i]
        for j: int in range(8):
            var age: float = fmod(elapsed * (0.45 + float(i) * 0.03) + float(j) * 0.18, 1.55)
            var x: float = root.x + sin(elapsed * 0.85 + float(j) * 0.72 + float(i)) * (2.0 + age * 8.0)
            var y: float = root.y - age * 54.0
            var radius: float = 3.0 + age * 6.5
            var alpha: float = maxf(0.015, 0.075 - age * 0.038)
            draw_circle(Vector2(x, y), radius, Color(0.92, 0.91, 0.88, alpha))

func _draw_birds(w: float, h: float) -> void:
    var birds: Array[Dictionary] = [
        {"x": 0.50, "y": 0.18, "speed": 0.010, "phase": 0.0, "scale": 1.0},
        {"x": 0.57, "y": 0.25, "speed": 0.007, "phase": 1.7, "scale": 0.78},
        {"x": 0.65, "y": 0.16, "speed": 0.0085, "phase": 3.1, "scale": 0.88}
    ]

    for bird: Dictionary in birds:
        var x: float = (float(bird["x"]) + fmod(elapsed * float(bird["speed"]), 0.22)) * w
        if x > 0.76 * w:
            x = 0.50 * w + (x - 0.76 * w)
        var y: float = float(bird["y"]) * h + sin(elapsed * 0.58 + float(bird["phase"])) * 3.2
        var s: float = float(bird["scale"])
        var flap: float = sin(elapsed * 4.0 + float(bird["phase"])) * 2.6 * s
        var wing: float = 7.0 * s
        var middle: Vector2 = Vector2(x, y - 2.0 * s)
        var color: Color = Color(0.25, 0.18, 0.13, 0.50)
        draw_line(Vector2(x - wing, y + flap), middle, color, 1.25)
        draw_line(middle, Vector2(x + wing, y + flap), color, 1.25)
