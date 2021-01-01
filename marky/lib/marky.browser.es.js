/* global performance */
var perf = typeof performance !== 'undefined' && performance;

var now = perf && perf.now ? function () { return perf.now(); } : function () { return Date.now(); };

function throwIfEmpty (name) {
  if (!name) {
    throw new Error('name must be non-empty')
  }
}

// simple binary sort insertion
function insertSorted (arr, item) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = (low + high) >>> 1; // like (num / 2) but faster
    if (arr[mid].startTime < item.startTime) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  arr.splice(low, 0, item);
}

var mark;
var stop;
var getEntries;
var clear;

if (perf && perf.mark) {
  mark = function (name) {
    throwIfEmpty(name);
    perf.mark(("start " + name));
  };
  stop = function (name) {
    throwIfEmpty(name);
    perf.mark(("end " + name));
    perf.measure(name, ("start " + name), ("end " + name));
    var entries = perf.getEntriesByName(name);
    return entries[entries.length - 1]
  };
  getEntries = function () { return perf.getEntriesByType('measure'); };
  clear = function () {
    perf.clearMarks();
    perf.clearMeasures();
  };
} else {
  var marks = {};
  var entries = [];
  mark = function (name) {
    throwIfEmpty(name);
    var startTime = now();
    marks['$' + name] = startTime;
  };
  stop = function (name) {
    throwIfEmpty(name);
    var endTime = now();
    var startTime = marks['$' + name];
    if (!startTime) {
      throw new Error(("no known mark: " + name))
    }
    var entry = {
      startTime: startTime,
      name: name,
      duration: endTime - startTime,
      entryType: 'measure'
    };
    // per the spec this should be at least 150:
    // https://www.w3.org/TR/resource-timing-1/#extensions-performance-interface
    // we just have no limit, per Chrome and Edge's de-facto behavior
    insertSorted(entries, entry);
    return entry
  };
  getEntries = function () { return entries; };
  clear = function () {
    marks = {};
    entries = [];
  };
}

export { mark, stop, getEntries, clear };
