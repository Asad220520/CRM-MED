// =========================
// src/components/WeeklyCalendar/utils/layoutDayEvents.js
// =========================
// Calculate columns/widths for overlapping events within a day
export default function layoutDayEvents(events) {
  const sorted = [...events].sort((a, b) => a._start - b._start);
  const active = [];
  const usedCols = new Set();
  let currentGroup = [];
  let groupMax = 0;
  const getEnd = (ev) =>
    new Date(ev._start.getTime() + (ev._duration || 60) * 60000);
  const releaseFinished = (startTime) => {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= startTime) {
        usedCols.delete(active[i].col);
        active.splice(i, 1);
      }
    }
    if (active.length === 0 && currentGroup.length) {
      currentGroup.forEach((ev) => (ev._cols = groupMax || 1));
      currentGroup = [];
      groupMax = 0;
    }
  };
  const firstFreeCol = () => {
    let c = 0;
    while (usedCols.has(c)) c++;
    return c;
  };

  sorted.forEach((ev) => {
    const start = ev._start;
    const end = getEnd(ev);
    releaseFinished(start);
    const col = firstFreeCol();
    usedCols.add(col);
    active.push({ end, col, ref: ev });
    ev._col = col;
    currentGroup.push(ev);
    groupMax = Math.max(groupMax, col + 1, active.length);
  });
  releaseFinished(new Date(8640000000000000));
  if (currentGroup.length)
    currentGroup.forEach((ev) => (ev._cols = groupMax || 1));
  const padPct = 4;
  return sorted.map((ev) => {
    const cols = Math.max(1, ev._cols || 1);
    const col = Math.max(0, ev._col || 0);
    const widthPct = (100 - (cols - 1) * padPct) / cols;
    const leftPct = col * (widthPct + padPct);
    return { ...ev, _leftPct: leftPct, _widthPct: widthPct };
  });
}
