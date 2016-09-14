'use strict';

angular.module('picardy.fontawesome', [])
  .directive('fa', ['util',function (util) {
    return {
      restrict: 'E',
      template: '<span class="fa" aria-hidden="true"></span>',
      replace: true,
      link: function (scope, element, attrs) {
        var _observeAttrWrapper = util._observeAttrWrapper(attrs, element)
        util._keys(attrs).forEach(function(e,i){
          _observeAttrWrapper._observeAttr(e)
        })
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
        var _observeAttrWrapper = util._observeAttrWrapper(attrs, element)
         _observeAttrWrapper._observeAttr('size','fa');
      }
    };
  }])
  .factory('util',function(){
    function _observeAttrWrapper(attrs, element){
      /*** STRING ATTRS ***/
      // keep a state of the current attrs so that when they change,
      // we can remove the old attrs before adding the new ones.
      var currentClasses = {};

      // generic function to bind string attrs
      // attributes like name、rotate、flip
      function _observeStringAttr (attr, baseClass) {
        // check attrs[attr] string or empty
        if(!angular.isString(attrs[attr] || !!attrs[attr]))
          return;
        var className;
        baseClass = baseClass || 'fa-' + attr;                    // make baseClass
        //element.removeClass(currentClasses[attr]);                // remove old className from dom element
        className = [baseClass, attrs[attr]].join('-');           // connnect baseClass and attrs[attr] with '-'
        element.addClass(className);                              // add className to dom element
        //currentClasses[attr] = className;                         // override className within currentClass Object
      }

      // generic function to bind string attrs
      // attributes like size、stack
      function _observeNumberAttr (attr, baseClass) {
        // check attrs[attr] String or empty (ignore 0)
        if(!angular.isString(attrs[attr] || !!attrs[attr]))
          return;
        var className;
        baseClass = baseClass || 'fa-' + attr;                       // make baseClass
        //element.removeClass(currentClasses[attr]);                   // remove old className from dom element

        if (attrs[attr] === 'large') {                               // connnect baseClass and attrs[attr] with '-'
          className = [baseClass,'lg'].join('-');
        } else if (!isNaN(parseInt(attrs[attr], 10))) {
          className = [baseClass,attrs[attr]+'x'].join('-');
        }
        element.addClass(className);                                  // add className to dom element
        //currentClasses[attr] = className;                             // override className within currentClass Object

      }


      // generic function to bind boolean attrs
      function _observeBooleanAttr (attr, baseClass) {
        var value;
        baseClass = baseClass || 'fa-' + attr;
        value = attr in attrs && attrs[attr] !== 'false' && attrs[attr] !== false;
        element.toggleClass(baseClass, value);
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


      function _observeAttr(attr){
        switch(attr){
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
          _observeAttr: _observeAttr
      }
    }

    // get object keys and filter keys according keyWhiteList
    // var keyWhiteList = ['name','rotate','flip','size','stack','border','fw','inverse','spin','alt'];
    function _keys(obj, keyWhiteList){
      var keys = [];
      keyWhiteList = keyWhiteList || ['name','rotate','flip','size','stack','border','fw','inverse','spin'];
      for(var key in obj){
        keys.push(key);
      }
      keys = keys.filter(function(e,i){
       return keyWhiteList.indexOf(e) == -1 ? false : true; 
      });
      return keys;
    }
    return {
      _observeAttrWrapper : _observeAttrWrapper,
      _keys : _keys
    }
  })
