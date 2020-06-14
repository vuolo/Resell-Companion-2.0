Array.prototype.swap = function(a, b) {
  var tmp = this[a];
  this[a] = this[b];
  this[b] = tmp;
};

Array.prototype.quick_sort = function(compareFunction) {

  function partition(array, compareFunction, begin, end, pivot) {
    var piv = array[pivot];
    array.swap(pivot, end-1);
    var store = begin;
    for (var ix = begin; ix < end-1; ++ix) {
      if ( compareFunction(array[ix], piv) ) {
        array.swap(store, ix);
        ++store;
      }
    }
    array.swap(end-1, store);
    return store;
  }

  function qsort(array, compareFunction, begin, end) {
    if ( end-1 > begin ) {
      var pivot = begin + Math.floor(Math.random() * (end-begin));
      pivot = partition(array, compareFunction, begin, end, pivot);
      qsort(array, compareFunction, begin, pivot);
      qsort(array, compareFunction, pivot+1, end);
    }
  }

  if (compareFunction == null) {
    compareFunction = function(a,b) { return a <= b; };
  }
  qsort(this, compareFunction, 0, this.length);
};
