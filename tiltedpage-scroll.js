/*!
 * Vanilla JS fork of jquery-tiltedpage-scroll.js plugin
 * https://github.com/jamestylerpatton/TiltedPageScroll
 *
 * Create a beautiful 3D tilted effect on scroll
 * with Tilted Page Scroll plugin
 * https://github.com/peachananr/tiltedpage_scroll
 *
 * UMD Boilerplate
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * https://vanillajstoolkit.com/boilerplates/umd/
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof exports === "object") {
    module.exports = factory(root);
  } else {
    root.TiltedPage = factory(root);
  }
})(
  typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : this,
  function (window) {
    "use strict";

    const TiltedPage = function (options) {
      const defaults = {
        selector: null,
        sectionContainer: "> section",
        angle: 50,
        opacity: true,
        scale: true,
        outAnimation: true,
      };
      const settings = Object.assign({}, defaults, options);

      const $elem = document.querySelector(settings.selector);
      let $sections,
        $sectionWrappers = [],
        scrollTop,
        scrollBottom,
        windowHeight;

      /**
       * Add initial styles to head
       */
      const addStyles = function () {
        // Get the head element
        let head = document.head || document.getElementsByTagName("head")[0];

        // Create styles
        let css =
          ".tps-section{width:100%;height:500px;-webkit-perspective:10em;-moz-perspective:10em;-ms-perspective:10em;-o-perspective:10em;perspective:10em;-webkit-perspective-origin:center bottom;-moz-perspective-origin:center bottom;-ms-perspective-origin:center bottom;-o-perspective-origin:center bottom;perspective-origin:center bottom;-webkit-perspective-origin:50% 50%;-moz-perspective-origin:50% 50%;-ms-perspective-origin:50% 50%;-o-perspective-origin:50% 50%;perspective-origin:50% 50%;-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;-o-transform-style:preserve-3d;transform-style:preserve-3d}.tps-wrapper{float:left;width:100%;height:100%}";
        let div = document.createElement("div");
        div.innerHTML = '<p>x</p><style id="tps-styles">' + css + "</style>";

        // Inject styles into the DOM
        head.appendChild(div.childNodes[1]);
      };

      /**
       * Perform html updates to page sections
       */
      const wrapElements = function () {
        $sections.forEach((el) => {
          // Add class to each element
          el.classList.add("tps-section");

          // Wrap section content in div with class tps-wrapper
          let elHtml = el.innerHTML;
          el.innerHTML = `<div class='tps-wrapper'>${elHtml}</div>`;
        });
      };

      /**
       * Check if selected element is in viewport
       * @returns bool
       */
      const isElementInViewport = function (el) {
        let elemTop = el.getBoundingClientRect().top + scrollTop,
          elemBottom = elemTop + el.offsetHeight;

        return elemBottom >= scrollTop && elemTop <= scrollBottom;
      };

      /**
       * Add class to elements in viewport
       * Remove class from elements outside viewport
       */
      const handleSectionViewportClasses = function (el) {
        if (isElementInViewport(el)) {
          el.classList.add("tps-inview");
        } else {
          el.classList.remove("tps-inview");
        }

        // Add only visible wrappers to $sectionWrappers var
        $sectionWrappers = document.querySelectorAll(
          ".tps-section.tps-inview .tps-wrapper"
        );
      };

      /**
       * Calculate opacity based on elements
       * position on the page
       */
      const calculateOpacity = function (el) {
        if (settings.opacity === false) {
          return 1;
        }

        let opacity;

        if (scrollTop > el.elemTop && settings.outAnimation === false) {
          return 1;
        }

        if (scrollTop > el.elemTop) {
          opacity =
            (el.elemTop + window.innerHeight * 1.2 - scrollTop) /
            window.innerHeight;
          opacity = Math.pow(opacity, 25);
        } else {
          opacity =
            (scrollTop + window.innerHeight - el.elemTop + el.elemHeight / 2) /
            window.innerHeight;
          if (opacity > 1) opacity = 1;
        }

        return opacity;
      };

      /**
       * Calculate rotation based on elements
       * position on the page
       */
      const calculateDeg = function (el) {
        if (settings.angle === false) {
          return 0;
        }

        let deg;

        deg =
          ((el.elemTop - el.elemHeight - scrollTop) / windowHeight) *
          (settings.angle * 3);

        if (deg < 0) deg = 0;

        if (scrollTop > el.elemTop) {
          if (settings.outAnimation === false) {
            if (deg > 0) deg = 0;
          } else {
            deg =
              ((el.elemTop - scrollTop) / window.innerHeight) *
              (settings.angle * 3);
          }
        }

        return deg;
      };

      /**
       * Calculate scale based on elements
       * position on the page
       */
      const calculateScale = function (el) {
        if (settings.scale === false) {
          return 1;
        }

        let scale =
          (scrollTop + windowHeight - (el.elemTop - el.elemHeight)) /
          windowHeight;

        if (scale > 1) scale = 1;

        if (scrollTop > el.elemTop && settings.outAnimation) {
          scale = (scrollTop + windowHeight - el.elemTop) / windowHeight;
        }

        return scale;
      };

      const handleEffects = function () {
        // Re-assign scrollTop and scrollBottom vars
        scrollTop = window.pageYOffset;
        scrollBottom = scrollTop + window.innerHeight;
        windowHeight = window.innerHeight;

        // Handle styles for each section
        $sections.forEach((el) => {
          handleSectionViewportClasses(el);
        });

        $sectionWrappers.forEach((el) => {
          // Declare Variables
          el.elemTop = el.parentNode.getBoundingClientRect().top + scrollTop;
          el.elemHeight = el.parentNode.offsetHeight;

          let deg = calculateDeg(el),
            scale = calculateScale(el),
            opacity = calculateOpacity(el);

          // Change styles
          el.style.transform =
            "rotateX(" + deg + "deg) scale(" + scale + ", " + scale + ")";
          el.style.opacity = opacity;
        });
      };

      /**
       * Run function to handle effect on each
       * of the following event listeners
       */
      const registerEvents = function () {
        window.addEventListener("load", handleEffects);
        window.addEventListener("scroll", handleEffects);
        window.addEventListener("resize", handleEffects);
        document.addEventListener("DOMContentLoaded", handleEffects);
      };

      /**
       * Initialize the TiltedPage plugin class
       */
      const init = function () {
        // Error handling
        if (!settings.selector || !settings.sectionContainer) {
          throw new Error("Please provide a valid selector");
        }

        // Redefine sections
        $sections = $elem
          ? $elem.querySelectorAll(":scope " + settings.sectionContainer)
          : null;

        // Return if no sections found on page
        if (!$sections) {
          return;
        }

        addStyles();

        wrapElements();

        registerEvents();
      };

      return init();
    };

    return TiltedPage;
  }
);
