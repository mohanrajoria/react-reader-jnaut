var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Epub from 'epubjs/lib/index';
import defaultStyles from './style';

global.ePub = Epub; // Fix for v3 branch of epub.js -> needs ePub to by a global var

var EpubView = function (_Component) {
  _inherits(EpubView, _Component);

  function EpubView(props) {
    _classCallCheck(this, EpubView);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onLocationChange = function (loc) {
      var _this$props = _this.props,
          location = _this$props.location,
          locationChanged = _this$props.locationChanged;

      var newLocation = loc && loc.start;
      if (location !== newLocation) {
        _this.location = newLocation;
        locationChanged && locationChanged(newLocation);
      }
    };

    _this.handleKeyPress = function (_ref) {
      var key = _ref.key;

      key && key === 'ArrowRight' && _this.nextPage();
      key && key === 'ArrowLeft' && _this.prevPage();
    };

    _this.state = {
      isLoaded: false,
      toc: []
    };
    _this.viewerRef = React.createRef();
    _this.location = props.location;
    _this.book = _this.rendition = _this.prevPage = _this.nextPage = null;
    return _this;
  }

  EpubView.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var _props = this.props,
        url = _props.url,
        tocChanged = _props.tocChanged;
    // use empty options to avoid ArrayBuffer urls being treated as options in epub.js

    var epubOptions = {};
    this.book = new Epub(url, epubOptions);
    this.book.loaded.navigation.then(function (_ref2) {
      var toc = _ref2.toc;

      _this2.setState({
        isLoaded: true,
        toc: toc
      }, function () {
        tocChanged && tocChanged(toc);
        _this2.initReader();
      });
    });
    document.addEventListener('keydown', this.handleKeyPress, false);
  };

  EpubView.prototype.componentWillUnmount = function componentWillUnmount() {
    this.book = this.rendition = this.prevPage = this.nextPage = null;
    document.removeEventListener('keydown', this.handleKeyPress, false);
  };

  EpubView.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return !this.state.isLoaded || nextProps.location !== this.props.location;
  };

  EpubView.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location && this.location !== this.props.location) {
      this.rendition.display(this.props.location);
    }
  };

  EpubView.prototype.initReader = function initReader() {
    var _this3 = this;

    var toc = this.state.toc;
    var _props2 = this.props,
        location = _props2.location,
        epubOptions = _props2.epubOptions,
        getRendition = _props2.getRendition;

    var node = this.viewerRef.current;
    this.rendition = this.book.renderTo(node, _extends({
      contained: true,
      width: '100%',
      height: '100%'
    }, epubOptions));
    this.rendition.display(typeof location === 'string' || typeof location === 'number' ? location : toc[0].href);

    this.prevPage = function () {
      _this3.rendition.prev();
    };
    this.nextPage = function () {
      _this3.rendition.next();
    };
    this.rendition.on('locationChanged', this.onLocationChange);
    getRendition && getRendition(this.rendition);
  };

  EpubView.prototype.renderBook = function renderBook() {
    var styles = this.props.styles;

    return React.createElement('div', { ref: this.viewerRef, style: styles.view });
  };

  EpubView.prototype.render = function render() {
    var isLoaded = this.state.isLoaded;
    var _props3 = this.props,
        loadingView = _props3.loadingView,
        styles = _props3.styles;

    return React.createElement(
      'div',
      { style: styles.viewHolder },
      isLoaded && this.renderBook() || loadingView
    );
  };

  return EpubView;
}(Component);

EpubView.defaultProps = {
  loadingView: null,
  locationChanged: null,
  tocChanged: null,
  styles: defaultStyles,
  epubOptions: {}
};

EpubView.propTypes = {
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(ArrayBuffer)]),
  loadingView: PropTypes.element,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  epubOptions: PropTypes.object,
  getRendition: PropTypes.func
};

export default EpubView;