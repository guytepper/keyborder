# Keyborder
Keyborder aims to solve the disconnect between the visual and the DOM order when using Flexbox's order property.

## How to use
Grab the source file and include it in your project. Then initiate a new keyborder instance with the element selector you want to attach keyborder to:

```javascript
new Keyborder('.wrapper');
```

Keyborder will then run through the child elements, set the correct `tabindex` for each of them and attach event listener for the parent, so when navigating through the child elements with a keyboard, they will be focused according to thier visual order. 

**Note:** Navigating the child elements is with the arrow keys.

## Edge cases
**What if I don't want a child element to get focus?**  
Keyborder makes the child elements of the provided element focusable. If you don't want a particular element to get focus, just add `data-no-focus="true"` on it, and Keyborder will skip it.
