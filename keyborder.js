var Keyborder = function(selectors, options) {
  const elements = document.querySelectorAll(selectors);
  this.attachListeners(elements);
  this.setTabIndex(elements[0]);
}

// Handles key navigation when focused inside the container
Keyborder.prototype.keyNavigation = function(event) {
  console.log(event.which);
};

// Returns the lowest order prop for the elements
Keyborder.prototype.getLowestOrder = function(children) {
  // Use array's map method to iterate through the children NodeList
  orderArr = Array.prototype.map.call(children, function(elm) {
      return this.getOrderProp(elm);
  });

  return Math.min.apply(null, orderArr);
};

// Returns the CSS order property for the element
Keyborder.prototype.getOrderProp(elm) = function(elm) {
  // Property is provided as a string, so we return it as am interger instead
  return parseInt(window.getComputedStyle(elm).getPropertyValue('order'));
};

Keyborder.prototype.setTabIndex = function(elm) {
  const children = elm.children;
  console.log(this.getLowestOrder(children));
  children.forEach(elm => {

  });
};

Keyborder.prototype.attachListeners = function(elements) {
  elements.forEach(elm => {
    elm.addEventListener('keyup', this.keyNavigation);

    // Event listener for getting focus
    elm.addEventListener('focus', () => {
      console.log('focused');
    }, true);
  })
};

new Keyborder('.wrapper');
