extends Node

const SAVE_PATH := "user://haute_couture_save.json"

var player_name := ""
var money := 620
var reputation := 0
var day := 1
var home_id := ""
var rent := 0
var current_order: Dictionary = {}
var flags: Dictionary = {}

func new_game() -> void:
    player_name = ""
    money = 620
    reputation = 0
    day = 1
    home_id = ""
    rent = 0
    current_order = {}
    flags = {
        "arrived_in_paris": false,
        "home_chosen": false,
        "first_order_received": false,
        "first_order_accepted": false
    }

func choose_home(id: String, monthly_rent: int) -> void:
    home_id = id
    rent = monthly_rent
    flags["home_chosen"] = true
    save_game()

func set_first_order() -> void:
    current_order = {
        "client": "Madame Bérard",
        "title": "Transformer une robe pour un dîner",
        "budget": 45,
        "deadline_days": 2,
        "status": "offered"
    }
    flags["first_order_received"] = true
    save_game()

func accept_first_order() -> void:
    if current_order.is_empty():
        set_first_order()
    current_order["status"] = "accepted"
    flags["first_order_accepted"] = true
    save_game()

func save_game() -> void:
    var payload := {
        "player_name": player_name,
        "money": money,
        "reputation": reputation,
        "day": day,
        "home_id": home_id,
        "rent": rent,
        "current_order": current_order,
        "flags": flags
    }
    var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(payload))

func has_save() -> bool:
    return FileAccess.file_exists(SAVE_PATH)

func load_game() -> bool:
    if not has_save():
        return false
    var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
    if not file:
        return false
    var parsed = JSON.parse_string(file.get_as_text())
    if typeof(parsed) != TYPE_DICTIONARY:
        return false
    player_name = str(parsed.get("player_name", ""))
    money = int(parsed.get("money", 620))
    reputation = int(parsed.get("reputation", 0))
    day = int(parsed.get("day", 1))
    home_id = str(parsed.get("home_id", ""))
    rent = int(parsed.get("rent", 0))
    current_order = parsed.get("current_order", {})
    flags = parsed.get("flags", {})
    return true
