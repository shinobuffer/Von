if (!Array.prototype.remove){
  Array.prototype.remove = function (item) {
    if (!this.length) return;
    let index = this.indexOf(item);
    if (index > -1) {
      this.splice(index,1);
      return this;
    }
  }
}
if (!Array.prototype.pushIfNew){
  Array.prototype.pushIfNew = function (...item) {
    for (let i of item)
      if (this.indexOf(i)===-1)
        this.push(i);
    return this
  }
}
