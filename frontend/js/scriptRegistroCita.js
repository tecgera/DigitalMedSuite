flatpickr("#fechaHoraCita", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  time_24hr: false, // cambia a true si deseas formato 24h
  locale: "es",
  monthSelectorType: "static",
  minDate: "today" // 🚫 bloquea días anteriores a hoy
});