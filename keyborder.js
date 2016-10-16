/* The constructor recevies list of selectors and applies keyboard
 * navigation to it's decendants.
 */
var Keyborder = function(selectors) {
  this.elements = document.querySelectorAll(selectors);  
  Array.prototype.forEach.call(this.elements, elm => {
    // Set the initial tabindex value for the elements decendants
    this.setTabIndex(elm.children);
    // Handle keydown events inside the element
    elm.addEventListener('keydown', e => this.keyNavigation(e)); // ehm y return
  });
}

// Returns the CSS order property for the element
Keyborder.prototype.getOrderProp = function(elm) {
  // Property is provided as a string, so we return it as an interger instead
  return parseInt(window.getComputedStyle(elm).getPropertyValue('order'));
};

/* The function sets the tabindex attribute for the element's decendants, 
 * according to thier order property:
 * - The element with the lowest order property appears first in the UI and 
 *   should be the first to receive focus, therefore we set it's tabindex to '0'.
 * - Other element's tabindex will be set to '-1'. 
 */
Keyborder.prototype.setTabIndex = function(children) {
  const lowestOrder = this.getMinMaxOrderProp(children, 'min');

  Array.prototype.forEach.call(children, elm => {
    // Don't set tabindex if data-no-focus is set on the element.
    if (elm.dataset.noFocus == 'true') return;

    if (this.getOrderProp(elm) == lowestOrder) elm.tabIndex = '0';
    else elm.tabIndex = '-1';
  });
};

/* The function receives a list of nodes and returns the lowest / highest
 * order property among them, according to the 'minmax' value.
 */
Keyborder.prototype.getMinMaxOrderProp = function(nodeList, minmax) {
  if (minmax != 'min' && minmax != 'max') {
    throw new Error('Wrong argument provided - accepted values are only min / max.');
  }

  // Create array contains each element's order value.
  const orderArr = Array.prototype.map.call(nodeList, elm => {
    return this.getOrderProp(elm);
  });

  switch (minmax) {
    case 'min':
      return Math.min.apply(null, orderArr);
    case 'max':
      return Math.max.apply(null, orderArr);
  }
}

// Returns the closest previous / next element by the order property
Keyborder.prototype.getClosestElement = function(currentElement, direction) {
  if (direction != 'previous' && direction != 'next') {
    throw new Error('Wrong argument provided - accepted values are only previous / next.');
  }

  const siblings = currentElement.parentNode.children;
  const currentOrder = this.getOrderProp(currentElement);
  // Sets the intial closest element to the element itself, in case there's no element after / before
  let closestElm = null;

  if (direction == 'previous') {
    // Setting the initial closest order value to the lowest possibility
    let closestOrder = this.getMinMaxOrderProp(siblings, 'min');
    Array.prototype.forEach.call(siblings, elm => {
      const elmOrder = this.getOrderProp(elm);
      if (elmOrder < currentOrder && elmOrder >= closestOrder) {
        closestOrder = elmOrder;
        closestElm = elm;
      }
    });
  }

  if (direction == 'next') {
    // Setting the initial closest order value to the highest possibility
    let closestOrder = this.getMinMaxOrderProp(siblings, 'max');
    Array.prototype.forEach.call(siblings, elm => {
      const elmOrder = this.getOrderProp(elm);
      if (elmOrder > currentOrder && elmOrder <= closestOrder) {
        closestOrder = elmOrder;
        closestElm = elm;
      }
    });
  }

  // Don't return the element if it's set to not gain focus
  if (closestElm != null) {
    if (closestElm.dataset.noFocus == 'true') return null;
  }
  return closestElm;
};

/* Handles key navigation when focused inside the container.
 * - The previous / next element are being focused using the element's
 *   order property.
 * - The tabindex property is modified so the next time the element's parent
 *   node get focused.
*/
Keyborder.prototype.keyNavigation = function(event) {
  const key = event.which;
  const activeElm = document.activeElement;
  let closestElm = null;

  switch (key) {
    case 39:
      closestElm = this.getClosestElement(activeElm, 'next');
      break;
    case 37:
      closestElm = this.getClosestElement(activeElm, 'previous');
      break;
  }

  if (closestElm != activeElm && closestElm != null) {
    activeElm.tabIndex = '-1';
    closestElm.focus();
    closestElm.tabIndex = '0';
  }
}

const a = new Keyborder('.wrapper');
const b = new Keyborder('.lol');