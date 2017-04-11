'use strict';

if (!/Windows/i.test(navigator.userAgent)) {
  document.documentElement.classList.add('non-windows');
}

// polyfill for old browsers to enable [...results] and for-of
for (const type of [NodeList, NamedNodeMap, HTMLCollection, HTMLAllCollection]) {
  if (!type.prototype[Symbol.iterator]) {
    type.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }
}


function onDOMready() {
  if (document.readyState != 'loading') {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', function _() {
      document.removeEventListener('DOMContentLoaded', _);
      resolve();
    });
  });
}


function scrollElementIntoView(element) {
  // align to the top/bottom of the visible area if wasn't visible
  const bounds = element.getBoundingClientRect();
  if (bounds.top < 0 || bounds.top > innerHeight - bounds.height) {
    element.scrollIntoView(bounds.top < 0);
  }
}


function animateElement(element, {className, remove = false}) {
  return new Promise(resolve => {
    element.addEventListener('animationend', function _() {
      element.removeEventListener('animationend', _);
      element.classList.remove(className);
      // TODO: investigate why animation restarts if the elements is removed in .then()
      if (remove) {
        element.remove();
      }
      resolve();
    });
    element.classList.add(className);
  });
}


function enforceInputRange(element) {
  const min = Number(element.min);
  const max = Number(element.max);
  const onChange = () => {
    const value = Number(element.value);
    if (value < min || value > max) {
      element.value = Math.max(min, Math.min(max, value));
    }
  };
  onChange();
  element.addEventListener('change', onChange);
  element.addEventListener('input', onChange);
}


function $(selector, base = document) {
  // we have ids with . like #manage.onlyEdited which look like #id.class
  // so since getElementById is superfast we'll try it anyway
  const byId = selector.startsWith('#') && document.getElementById(selector.slice(1));
  return byId || base.querySelector(selector);
}


function $$(selector, base = document) {
  return [...base.querySelectorAll(selector)];
}
