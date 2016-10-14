var Keyborder = function(selectors) {
  this.elements = document.querySelectorAll(selectors);  
  Array.prototype.forEach.call(this.elements, elm => {
    this.setTabIndex(elm);
    elm.addEventListener('keydown', e => this.keyNavigation(e)); // ehm y return
  });
}

// Returns the CSS order property for the element
Keyborder.prototype.getOrderProp = function(elm) {
  // Property is provided as a string, so we return it as an interger instead
  return parseInt(window.getComputedStyle(elm).getPropertyValue('order'));
};

// Returns the lowest order prop for the elements
 Keyborder.prototype.getLowestOrder = function(children) {
  // Use array's map method to iterate through the children NodeList
  orderArr = Array.prototype.map.call(children, elm => {
    return this.getOrderProp(elm);
  });
 
  return Math.min.apply(null, orderArr);
 };

// Sets the tabindex attribute to for the childrens, according to thier order property
Keyborder.prototype.setTabIndex = function(elm) {
  const children = elm.children;
  const lowestOrder = this.getLowestOrder(children);
  
  Array.prototype.forEach.call(children, elm => {
    if (this.getOrderProp(elm) == lowestOrder) elm.tabIndex = '0';
    else elm.tabIndex = '-1';
  });
};

// Returns next DOM element by the order property
// Keyborder.prototype.getNextElement = function(elm) {
//   const currentOrder = this.getOrderProp(elm);  
//   const siblings = elm.parentNode.children;
//   return this.closest(siblings, currentOrder);
// }

Keyborder.prototype.keyNavigation = function(event) {
  console.log('hiii...')
  const key = event.which;
  const activeElm = document.activeElement;
  switch (key) {
    case 39:
      // this.getNextElement(activeElm).focus();
  }
}

const k = new Keyborder('.wrapper');
