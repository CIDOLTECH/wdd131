/**
 * place.js
 * WDD 131 — Nigeria Country Page
 *
 * Demonstrates three categories of JavaScript design patterns:
 *   - Creational : the NigeriaPage module (IIFE / Module pattern) constructs
 *                  a single application namespace instead of leaking globals.
 *   - Structural : FooterService acts as a Facade, hiding the Date API
 *                  behind two simple methods the rest of the app can call.
 *   - Behavioral : WeatherService uses a Strategy pattern, selecting the
 *                  correct wind-chill formula (metric vs. imperial) based
 *                  on the page's configured unit system.
 */

const NigeriaPage = (() => {
  "use strict";

  /* -----------------------------------------------------------
     Structural pattern — Facade
     FooterService wraps the native Date object and exposes only
     the two operations the footer actually needs.
  ----------------------------------------------------------- */
  const FooterService = {
    getCurrentYear() {
      return new Date().getFullYear();
    },
    getLastModified() {
      return document.lastModified;
    },
    render({ yearSelector, modifiedSelector }) {
      const yearEl = document.querySelector(yearSelector);
      const modifiedEl = document.querySelector(modifiedSelector);
      if (yearEl) yearEl.textContent = this.getCurrentYear();
      if (modifiedEl) modifiedEl.textContent = this.getLastModified();
    },
  };

  /* -----------------------------------------------------------
     Behavioral pattern — Strategy
     Two interchangeable wind-chill calculation strategies. The
     active strategy is chosen by unit system, so new unit systems
     can be added without touching the calling code.
  ----------------------------------------------------------- */

  /**
   * Calculates wind chill using the metric formula (°C, km/h).
   * Environment Canada / NWS metric wind-chill index.
   * @param {number} tempC - Air temperature in Celsius.
   * @param {number} windKmh - Wind speed in kilometers per hour.
   * @returns {number} The calculated wind chill in Celsius.
   */
  function calculateWindChill(tempC, windKmh) {
    return 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
  }

  /**
   * Calculates wind chill using the imperial formula (°F, mph).
   * @param {number} tempF - Air temperature in Fahrenheit.
   * @param {number} windMph - Wind speed in miles per hour.
   * @returns {number} The calculated wind chill in Fahrenheit.
   */
  function calculateWindChillImperial(tempF, windMph) {
    return 35.74 + 0.6215 * tempF - 35.75 * Math.pow(windMph, 0.16) + 0.4275 * tempF * Math.pow(windMph, 0.16);
  }

  const windChillStrategies = {
    metric: {
      isViable: (temp, wind) => temp <= 10 && wind > 4.8,
      calculate: calculateWindChill,
      unitLabel: "\u00B0C",
    },
    imperial: {
      isViable: (temp, wind) => temp <= 50 && wind > 3,
      calculate: calculateWindChillImperial,
      unitLabel: "\u00B0F",
    },
  };

  const WeatherService = {
    /**
     * Runs the wind-chill strategy that matches the configured unit
     * system and only calls the formula when conditions are viable.
     */
    getWindChillDisplay(temp, wind, unitSystem = "metric") {
      const strategy = windChillStrategies[unitSystem];
      if (!strategy) return "N/A";

      if (!strategy.isViable(temp, wind)) {
        return "N/A";
      }

      const result = strategy.calculate(temp, wind);
      return `${result.toFixed(1)} ${strategy.unitLabel}`;
    },
  };

  /* -----------------------------------------------------------
     Creational pattern — Module
     init() is the single entry point exposed to the page; it wires
     together the Facade and Strategy services above.
  ----------------------------------------------------------- */
  function init() {
    FooterService.render({
      yearSelector: "#year",
      modifiedSelector: "#lastModified",
    });

    // Static values matching the content displayed in the Weather panel.
    // (Preparation for future dynamic/real-time input.)
    const currentTemperature = 26; // \u00B0C
    const currentWindSpeed = 14; // km/h

    const windChillDisplay = WeatherService.getWindChillDisplay(
      currentTemperature,
      currentWindSpeed,
      "metric"
    );

    const windChillEl = document.querySelector("#windChill");
    if (windChillEl) {
      windChillEl.textContent = windChillDisplay;
    }
  }

  return { init, calculateWindChill, WeatherService, FooterService };
})();

document.addEventListener("DOMContentLoaded", NigeriaPage.init);
