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

Keyborder.prototype.getHighestOrderProp = function(nodeList) {
  return 3;
}

Keyborder.prototype.getLowestOrderProp = function(nodeList) {
  return 1;
}

// Returns the closest next element by the order property
Keyborder.prototype.getNextElement = function(currentElement) {
  const siblings = currentElement.parentNode.children;
  const currentOrder = this.getOrderProp(currentElement);
  // Setting the initial closest order value to the highest possibility
  let closestOrder = this.getHighestOrderProp(siblings);
  let closestElm = currentElement;

  Array.prototype.forEach.call(siblings, elm => {
    const elmOrder = this.getOrderProp(elm);
    if (elmOrder > currentOrder && elmOrder <= closestOrder) {
      closestOrder = elmOrder;
      closestElm = elm;
    }
  });

  return closestElm;
}

// Returns the closest next element by the order property
Keyborder.prototype.getPreviousElement = function(currentElement) {
  const siblings = currentElement.parentNode.children;
  const currentOrder = this.getOrderProp(currentElement);
  // Setting the initial closest order value to the highest possibility
  let closestOrder = this.getLowestOrderProp(siblings);
  let closestElm = currentElement;

  Array.prototype.forEach.call(siblings, elm => {
    const elmOrder = this.getOrderProp(elm);
    if (elmOrder < currentOrder && elmOrder >= closestOrder) {
      closestOrder = elmOrder;
      closestElm = elm;
    }
  });

  return closestElm;
}

Keyborder.prototype.keyNavigation = function(event) {
  const key = event.which;
  const activeElm = document.activeElement;
  switch (key) {
    case 39:
      this.getNextElement(activeElm).focus();
      break;
    case 37:
      this.getPreviousElement(activeElm).focus();
      break;
  }
}

const k = new Keyborder('.wrapper');
