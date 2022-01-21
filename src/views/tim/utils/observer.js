let observer = {
  list: {},
  on: function(key,fn) {
    if(!this.list[key]){
      this.list[key] = []
    }
    this.list[key].push(fn)
  },
  fire: function() {
    var key = Array.prototype.shift.call(arguments)
    var fns = this.list[key]
    if (!fns || fns.length === 0) 
      return false
    fns.forEach(fn => {
      fn.apply(this,arguments)
    });
  },
  off: function(key,fn) {
    var fns = this.list[key]
    if (!fns) {
      return false
    }
    if(!fn){
      fns && (fns = [])
    }else{
      for(var l=fns.length-1; l>=0; l--){
        var _fn = fns[l]
        if ( _fn === fn) {
          fns.splice(l,1)
        }
      }
    }  
  }
}

export default observer