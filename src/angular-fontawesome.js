'use strict';

angular.module('picardy.fontawesome', [])
  .directive('fa', ['util',function (util) {
    return {
      restrict: 'E',
      template: '<span class="fa" aria-hidden="true"></span>',
      replace: true,
      link: function (scope, element, attrs) {
        var _observeAttrWrapper = util._observeAttrWrapper(attrs, element);
        util._keys(attrs).forEach(function (e) {
          //console.log(e);
          _observeAttrWrapper._observeAttr(e);
        });
        //_observeAttrWrapper._observeAttr('name');
        //_observeAttrWrapper._observeAttr('rotate');
        //_observeAttrWrapper._observeAttr('flip');
        //_observeAttrWrapper._observeAttr('size');
        //_observeAttrWrapper._observeAttr('stack');
        //_observeAttrWrapper._observeAttr('border');
        //_observeAttrWrapper._observeAttr('fw');
        //_observeAttrWrapper._observeAttr('inverse');
        //_observeAttrWrapper._observeAttr('spin');
        //_observeAttrWrapper._observeAttr('alt');
        /*** CONDITIONAL ATTRS ***/
        // automatically populate fa-li if DOM structure indicates
        element.toggleClass('fa-li',
          element.parent() &&
          element.parent().prop('tagName') === 'LI' &&
          element.parent().parent() &&
          element.parent().parent().hasClass('fa-ul') &&
          element.parent().children()[0] === element[0] &&
          attrs.list !== 'false' &&
          attrs.list !== false
        );
      }
    };
  }])
  .directive('faStack',['util', function (util) {
    return {
      restrict: 'E',
      transclude: true,
      template: '<span ng-transclude class="fa-stack fa-lg"></span>',
      replace: true,
      link: function (scope, element, attrs) {
        var _observeAttrWrapper = util._observeAttrWrapper(attrs, element);
        _observeAttrWrapper._observeAttr('size');
      }
    };
  }])
  .factory('util',function () {
    function _observeAttrWrapper (attrs, element) {
      /*** STRING ATTRS ***/
      // keep a state of the current attrs so that when they change,
      // we can remove the old attrs before adding the new ones.
      var currentClasses = {};

      // generic function to bind string attrs
      // attributes like name、rotate、flip
      function _observeStringAttr (attr, baseClass) {
        // check attrs[attr] string or empty
        var className;
        /*
        if (!angular.isString(attrs[attr] || !!attrs[attr])) {
          return;
        }
        */
        attrs.$observe(attr, function () {
          baseClass = baseClass || 'fa-' + attr;                    // make baseClass
          element.removeClass(currentClasses[attr]);                // remove old className from dom element
          className = [baseClass, attrs[attr]].join('-');           // connnect baseClass and attrs[attr] with '-'
          element.addClass(className);                              // add className to dom element
          currentClasses[attr] = className;                         // override className within currentClass Object
        });
      }

      // generic function to bind string attrs
      // attributes like size、stack
      function _observeNumberAttr (attr, baseClass) {
        // check attrs[attr] String or empty (ignore 0)
        //var className;
        /*
        if (!angular.isString(attrs[attr] || !!attrs[attr])) {
          return;
        }
        */
        /*
        console.log(attrs);
        console.log(attr);
        baseClass = baseClass || 'fa-' + attr;                       // make baseClass
        element.removeClass(currentClasses[attr]);                   // remove old className from dom element

        if (attrs[attr] === 'large') {                               // connnect baseClass and attrs[attr] with '-'
          className = [baseClass,'lg'].join('-');
        } else if (!isNaN(parseInt(attrs[attr], 10))) {
          className = [baseClass,attrs[attr] + 'x'].join('-');
        }
        console.log(className);
        element.addClass(className);                                  // add className to dom element
        currentClasses[attr] = className;                             // override className within currentClass Object
        */
        attrs.$observe(attr, function () {
          var className;
          baseClass = baseClass || 'fa-' + attr;
          element.removeClass(currentClasses[attr]);
          if (attrs[attr] === 'large') {
            className = [baseClass,'lg'].join('-');
          } else if (!isNaN(parseInt(attrs[attr], 10))) {
            className = [baseClass,attrs[attr] + 'x'].join('-');
          }

          element.addClass(className);
          currentClasses.size = className;
        });

      }


      // generic function to bind boolean attrs
      function _observeBooleanAttr (attr, className) {
        var value;

        attrs.$observe(attr, function () {
          className = className || 'fa-' + attr;
          value = attr in attrs && attrs[attr] !== 'false' && attrs[attr] !== false;
          element.toggleClass(className, value);
        });
      }


      function _observeAltAttr () {
        attrs.$observe('alt', function () {
          var altText = attrs.alt,
              altElem = element.next(),
              altElemClass = 'fa-alt-text';

          if (altText) {
            element.removeAttr('alt');

            // create the alt elem if one does not exist
            if (!altElem || !altElem.hasClass(altElemClass)) {
              element.after('<span class="sr-only fa-alt-text"></span>');
              altElem = element.next();
            }

            altElem.text(altText);
          } else if (altElem && altElem.hasClass(altElemClass)) {
            // kill the alt elem if we used to have alt text, but now we don't
            altElem.remove();
          }
        });
      }

      function _observeAttr (attr) {
        switch (attr) {
            case 'name':
                 _observeStringAttr(attr, 'fa');
                  break;
            case 'rotate':
            case 'flip':
                 _observeStringAttr(attr);
                  break;
            case 'size':
                 _observeNumberAttr(attr,'fa');
                  break;
            case 'stack':
                 _observeNumberAttr(attr);
                  break;
            case 'border':
            case 'fw':
            case 'inverse':
            case 'spin':
                 _observeBooleanAttr(attr);
                  break;
            case 'alt':
                 _observeAltAttr();
                  break;
          }
      }
      return {
          _observeStringAttr  : _observeStringAttr,
          _observeNumberAttr  : _observeNumberAttr,
          _observeBooleanAttr : _observeBooleanAttr,
          _observeAltAttr     : _observeAltAttr,
          _observeAttr        : _observeAttr
      };
    }

    // get object keys and filter keys according keyWhiteList
    // var keyWhiteList = ['name','rotate','flip','size','stack','border','fw','inverse','spin','alt'];
    function _keys (obj, keyWhiteList) {
      var keys = [],key;
      keyWhiteList = keyWhiteList || ['name','rotate','flip','size','stack','border','fw','inverse','spin','alt'];
      for (key in obj) {
        if (keyWhiteList.indexOf(key) !== -1) {
          keys.push(key);
        }
      }
      return keys;
    }
    return {
      _observeAttrWrapper : _observeAttrWrapper,
      _keys : _keys
    };
  });
