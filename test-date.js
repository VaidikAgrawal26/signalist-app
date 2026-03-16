const ohlcData = [];
for (let i = 0; i < 180; i++) {
    const date = new Date(2023, 0, i + 1);
    const dateStr = date.toISOString().split('T')[0];
    
    const open = (i === 0 ? 150 : ohlcData[i - 1].close) + (Math.random() - 0.5) * 2;
    const close = open + (Math.random() - 0.5) * 3;
    const high = Math.max(open, close) + Math.random() * 1.5;
    const low = Math.min(open, close) - Math.random() * 1.5;
    ohlcData.push({ time: dateStr, open, high, low, close });
}
console.log(ohlcData.slice(0, 5));
