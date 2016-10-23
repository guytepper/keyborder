const Utils = (function() {
  // Checks if an element is focusable
  function focusable(element) {
    const nodeName = element.nodeName.toLowerCase();
    
    if (/input|select|textarea|button|object/.test( nodeName )) {    
      return !element.disabled;
    }

    if ("a" === nodeName) {
      return element.href || element.tabIndex != -1;
    }
    
    return element.tabIndex != '-1';
  }

  return {
    focusable: focusable,
  }  
})();

/* The constructor recevies list of selectors and applies keyboard
 * navigation to it's decendants.
 */
const Keyborder = function(selector) {
  const container = document.querySelector(selector);
  
  // Set the initial tabindex value for the contianer's decendants.
  this.setTabIndex(container.children);

  // Handle keydown events inside the element.
  container.addEventListener('keydown', e => this.keyNavigation(e)); // ehm y return
}

// Returns the CSS order property for the element.
Keyborder.prototype.getOrderProp = function(elm) {
  // Property is provided as a string, so we return it as an interger instead.
  return parseInt(window.getComputedStyle(elm).getPropertyValue('order'));
};

/* The function sets the tabindex attribute for the element's decendants,
 * according to thier order property:
 * - The element with the lowest order property appears first in the UI and
 *   should be the first to receive focus, therefore we set it's tabindex to '0'.
 * - Other element's tabindex will be set to '-1'.
 */
Keyborder.prototype.setTabIndex = function(children) {
  let order = 1;

  // Creates new array contains only focusable elements
  const arr = this.focusableElements =
    Array.prototype.filter.call(children, elm => Utils.focusable(elm))
    // Sort the array by the element's order property 
    .sort((a, b) => this.getOrderProp(a) - this.getOrderProp(b));

  // Set the intial tabindex of the elements
  arr.tabIndex = '0';
  for (let i = 1; i < arr.length; i++) {
    arr[i].tabIndex = '-1';
  }

};

// Returns the previous / next element using the order property.
Keyborder.prototype.getClosestElement = function(currentElement, direction) {
  if (direction != 'previous' && direction != 'next') {
    throw new Error('Wrong argument provided - accepted values are only previous / next.');
  }

  // The index of the element in the focusableElements array
  const index = this.focusableElements.indexOf(currentElement);

  if (direction == 'next') {
    return this.focusableElements[index + 1];
  }

  if (direction == 'previous') {
    return this.focusableElements[index - 1];
  }
};

/* Handles key navigation when focused inside the container.
 * - The previous / next element are being focused using the element's
 *   order property.
 * - The tabindex property is modified so when moving between containers,
 *   element that was previously focused will get focused again.
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

  if (closestElm != activeElm && closestElm != undefined) {
    activeElm.tabIndex = '-1';
    closestElm.focus();
    closestElm.tabIndex = '0';
  }
}
