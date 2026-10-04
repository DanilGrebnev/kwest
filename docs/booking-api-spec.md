# API бронирования (контракт для бэкенда)

Базовый URL задаёт фронт (`PUBLIC_API_BASE_URL`). Все даты/время — **Europe/Moscow** (+03:00 в ISO).

---

## 1. GET `/schedule`

**Query:** `quest_id` (number, обяз.), `from` (YYYY-MM-DD), `to` (YYYY-MM-DD).

**Ответ:** один JSON-объект `BookingScheduleResponse`.

### `BookingScheduleResponse`

| Поле | Тип | Описание |
|------|-----|----------|
| `quest` | `QuestInfo` | Данные квеста для легенды и формы |
| `timezone` | string | Всегда `"Europe/Moscow"` |
| `range` | `{ from, to }` | Фактический диапазон дней в ответе |
| `days` | `ScheduleDay[]` | Строки сетки, по порядку `date` ↑ |

### `QuestInfo`

| Поле | Тип |
|------|-----|
| `id` | number |
| `title` | string |
| `min_players` | number |
| `max_players` | number |
| `standard_players` | number |
| `age_rating` | string |
| `extra_player_price_rub` | number |
| `price_legend` | `{ tier: "standard" \| "peak", price_label: string }[]` |

`price_label` — готовая строка для UI, например `"5 000 ₽"`.

### `ScheduleDay`

| Поле | Тип | Описание |
|------|-----|----------|
| `date` | string | `YYYY-MM-DD` |
| `weekday_short` | string | `"Пн"`, `"Вс"` … |
| `date_label` | string | `"5 октября"` |
| `relative_label` | `"today" \| "tomorrow" \| "day_after" \| null` | Бейдж у даты; `null` если не первые три дня от «сегодня» по Москве |
| `slots` | `ScheduleSlot[]` | Слоты дня, сортировка по `starts_at` ↑ |

### `ScheduleSlot`

| Поле | Тип | Описание |
|------|-----|----------|
| `slot_id` | string | Уникальный id; передаётся в POST брони |
| `starts_at` | string | ISO 8601 с offset, напр. `2026-10-05T14:00:00+03:00` |
| `time_label` | string | `"14:00"` |
| `status` | `"available" \| "occupied" \| "unavailable"` | См. таблицу ниже |
| `price_tier` | `"standard" \| "peak" \| null` | Только при `status === "available"` |
| `price_rub` | number \| null | Только при `available` |
| `price_label` | string \| null | Только при `available`, напр. `"6 500 ₽"` |

**`status` на фронте:**

| Значение | UI |
|----------|-----|
| `available` | Кнопка активна, цвет по `price_tier` |
| `occupied` | Кнопка disabled, занято |
| `unavailable` | Кнопка disabled, время недоступно (прошло, закрыто и т.д.) |

**Правила:**

- В `days` только дни, где есть хотя бы один слот.
- После успешной брони слот при следующем GET должен быть `occupied`.
- Для `occupied` и `unavailable`: `price_tier`, `price_rub`, `price_label` = `null`.

### Пример ответа

```json
{
  "quest": {
    "id": 1,
    "title": "И гаснет свет",
    "min_players": 2,
    "max_players": 6,
    "standard_players": 4,
    "age_rating": "18+",
    "extra_player_price_rub": 500,
    "price_legend": [
      { "tier": "standard", "price_label": "5 000 ₽" },
      { "tier": "peak", "price_label": "6 500 ₽" }
    ]
  },
  "timezone": "Europe/Moscow",
  "range": { "from": "2026-10-04", "to": "2026-10-15" },
  "days": [
    {
      "date": "2026-10-04",
      "weekday_short": "Вс",
      "date_label": "4 октября",
      "relative_label": "today",
      "slots": [
        {
          "slot_id": "q1-20261004-1000",
          "starts_at": "2026-10-04T10:00:00+03:00",
          "time_label": "10:00",
          "status": "unavailable",
          "price_tier": null,
          "price_rub": null,
          "price_label": null
        },
        {
          "slot_id": "q1-20261004-1400",
          "starts_at": "2026-10-04T14:00:00+03:00",
          "time_label": "14:00",
          "status": "available",
          "price_tier": "peak",
          "price_rub": 6500,
          "price_label": "6 500 ₽"
        }
      ]
    },
    {
      "date": "2026-10-05",
      "weekday_short": "Пн",
      "date_label": "5 октября",
      "relative_label": "tomorrow",
      "slots": [
        {
          "slot_id": "q1-20261005-1000",
          "starts_at": "2026-10-05T10:00:00+03:00",
          "time_label": "10:00",
          "status": "occupied",
          "price_tier": null,
          "price_rub": null,
          "price_label": null
        }
      ]
    }
  ]
}
```

---

## 2. POST `/bookings`

**Body:** `CreateBookingRequest`

| Поле | Тип | Обяз. |
|------|-----|-------|
| `quest_id` | number | да |
| `slot_id` | string | да |
| `player_count` | number | да |
| `first_name` | string | да |
| `last_name` | string | нет |
| `phone` | string | да |
| `email` | string | да |

**Логика:**

1. Найти слот по `slot_id` (и `quest_id`).
2. Если слота нет или `status !== "available"` → **409** с текстом ошибки.
3. Если `player_count` не в `[min_players, max_players]` → **400**.
4. Иначе создать бронь → **201** + `CreateBookingResponse`.

### `CreateBookingResponse`

| Поле | Тип |
|------|-----|
| `booking_id` | number |
| `slot_id` | string |
| `starts_at` | string |
| `player_count` | number |

### Пример запроса

```json
{
  "quest_id": 1,
  "slot_id": "q1-20261005-1800",
  "player_count": 4,
  "first_name": "Иван",
  "last_name": "Петров",
  "phone": "+79001234567",
  "email": "ivan@example.com"
}
```

### Пример ответа 201

```json
{
  "booking_id": 6202,
  "slot_id": "q1-20261005-1800",
  "starts_at": "2026-10-05T18:00:00+03:00",
  "player_count": 4
}
```

---

## 3. Ошибки

JSON: `{ "detail": "строка для пользователя" }`

| Код | Когда |
|-----|--------|
| 400 | Невалидные поля, число игроков |
| 404 | Квест или слот не найден |
| 409 | Слот уже занят или недоступен |
