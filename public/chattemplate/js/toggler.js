/*
	Include this file to quickly test how you it looks with dynamic behaviour
*/

if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
    var style = document.createElement('style'), elements = [], element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];

    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa = null;
    return elements;
  };
}

if (!document.querySelector) {
  document.querySelector = function (selectors) {
    var elements = document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
}

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

var tabTogglers = document.querySelectorAll('.tab-header');

for(var i = 0, len = tabTogglers.length; i < len; i++) {
	tabTogglers[i].onclick = function(e) {
		if(hasClass(this.parentNode, 'active')) removeClass(this.parentNode, 'active');
		else addClass(this.parentNode, 'active');
	};
}

function hasClass(elem, theClass) {
	var className = elem.className;
	if(className.indexOf(theClass) < 0) return false;
	else return true;
}
function addClass(elem, theClass) {
	var className = elem.className;
	className += ' ' + theClass;
	elem.className = className.trim();

	return false;
}
function removeClass(elem, theClass) {
	var className = elem.className;
	className = className.replace(theClass, '');
	elem.className = className.trim();

	return false;	
}