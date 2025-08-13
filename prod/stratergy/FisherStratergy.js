/**
 * Fisher Transform Strategy
 * @param {Array} candles - Array of candle objects [{ open, high, low, close }]
 * @param {number} length - Length parameter for Fisher Transform (default 9)
 * @returns {Array} - Array of signals: { fisher, trigger, signal }
 */
function fisherStrategy(candles, length = 9) {
    let fisher = [];
    let trigger = [];
    let signals = [];

    let valuePrev = 0;
    let fisherPrev = 0;

    for (let i = 0; i < candles.length; i++) {
        let hl2 = (candles[i].high + candles[i].low) / 2;

        // Highest & Lowest over last `length` candles
        let slice = candles.slice(Math.max(0, i - length + 1), i + 1);
        let highVal = Math.max(...slice.map(c => (c.high + c.low) / 2));
        let lowVal = Math.min(...slice.map(c => (c.high + c.low) / 2));

        // Round function
        const round_ = (val) => {
            if (val > 0.99) return 0.999;
            if (val < -0.99) return -0.999;
            return val;
        };

        // Fisher calculation
        let value = round_(0.66 * ((hl2 - lowVal) / (highVal - lowVal) - 0.5) + 0.67 * valuePrev);
        let fish = 0.5 * Math.log((1 + value) / (1 - value)) + 0.5 * fisherPrev;

        fisher.push(fish);
        trigger.push(fisherPrev);

        // Signal (example logic)
        let signal = null;
        if (fish > fisherPrev && fisherPrev < 0) signal = "BUY";
        if (fish < fisherPrev && fisherPrev > 0) signal = "SELL";

        signals.push({
            fisher: fish,
            trigger: fisherPrev,
            signal
        });

        // Store for next iteration
        valuePrev = value;
        fisherPrev = fish;
    }

    return signals;
}

// Example usage:
const candles = [
    { open: 100, high: 105, low: 98, close: 102 },
    { open: 102, high: 106, low: 101, close: 105 },
    // ... more candle data
];

console.log(fisherStrategy(candles, 9));
