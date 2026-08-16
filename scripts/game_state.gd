extends Node

var character := {
    "first_name": "Camille",
    "pronouns": "Elle",
    "distinctive_sign": "Étoile",
    "face": 0,
    "hair": 0,
    "silhouette": 0,
    "outfit": 0
}

func set_character_value(key: String, value: Variant) -> void:
    character[key] = value

func save_character() -> void:
    var file := FileAccess.open("user://character.json", FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(character))
