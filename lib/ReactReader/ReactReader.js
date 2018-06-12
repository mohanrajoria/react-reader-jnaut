var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import { EpubView } from '..';
import defaultStyles from './style';

var TocItem = function (_PureComponent) {
  _inherits(TocItem, _PureComponent);

  function TocItem() {
    var _temp, _this, _ret;

    _classCallCheck(this, TocItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _PureComponent.call.apply(_PureComponent, [this].concat(args))), _this), _this.setLocation = function () {
      _this.props.setLocation(_this.props.href);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  TocItem.prototype.render = function render() {
    var _props = this.props,
        label = _props.label,
        styles = _props.styles;

    return React.createElement(
      'button',
      { onClick: this.setLocation, style: styles },
      label
    );
  };

  return TocItem;
}(PureComponent);

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object
};

var ReactReader = function (_PureComponent2) {
  _inherits(ReactReader, _PureComponent2);

  function ReactReader(props) {
    _classCallCheck(this, ReactReader);

    var _this2 = _possibleConstructorReturn(this, _PureComponent2.call(this, props));

    _this2.toggleToc = function () {
      _this2.setState({
        expanedToc: !_this2.state.expanedToc
      });
    };

    _this2.next = function () {
      var node = _this2.readerRef.current;
      node.nextPage();
    };

    _this2.prev = function () {
      var node = _this2.readerRef.current;
      node.prevPage();
    };

    _this2.onTocChange = function (toc) {
      var tocChanged = _this2.props.tocChanged;

      _this2.setState({
        toc: toc
      }, function () {
        return tocChanged && tocChanged(toc);
      });
    };

    _this2.setLocation = function (loc) {
      var locationChanged = _this2.props.locationChanged;

      _this2.setState({
        expanedToc: false
      }, function () {
        return locationChanged && locationChanged(loc);
      });
    };

    _this2.readerRef = React.createRef();
    _this2.state = {
      expanedToc: false,
      toc: false
    };
    return _this2;
  }

  ReactReader.prototype.renderToc = function renderToc() {
    var _this3 = this;

    var _state = this.state,
        toc = _state.toc,
        expanedToc = _state.expanedToc;
    var styles = this.props.styles;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { style: styles.tocArea },
        React.createElement(
          'div',
          { style: styles.toc },
          toc.map(function (item) {
            return React.createElement(TocItem, _extends({
              key: item.href
            }, item, {
              setLocation: _this3.setLocation,
              styles: styles.tocAreaButton
            }));
          })
        )
      ),
      expanedToc && React.createElement('div', { style: styles.tocBackground, onClick: this.toggleToc })
    );
  };

  ReactReader.prototype.renderTocToggle = function renderTocToggle() {
    var expanedToc = this.state.expanedToc;
    var styles = this.props.styles;

    return React.createElement(
      'button',
      {
        style: Object.assign({}, styles.tocButton, expanedToc ? styles.tocButtonExpaned : {}),
        onClick: this.toggleToc
      },
      React.createElement('span', {
        style: Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)
      }),
      React.createElement('span', {
        style: Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)
      })
    );
  };

  ReactReader.prototype.render = function render() {
    var _props2 = this.props,
        url = _props2.url,
        title = _props2.title,
        showToc = _props2.showToc,
        loadingView = _props2.loadingView,
        epubOptions = _props2.epubOptions,
        styles = _props2.styles,
        getRendition = _props2.getRendition,
        locationChanged = _props2.locationChanged,
        location = _props2.location,
        swipeable = _props2.swipeable;
    var _state2 = this.state,
        toc = _state2.toc,
        expanedToc = _state2.expanedToc;

    return React.createElement(
      'div',
      { style: styles.container },
      React.createElement(
        'div',
        {
          style: Object.assign({}, styles.readerArea, expanedToc ? styles.containerExpaned : {})
        },
        showToc && this.renderTocToggle(),
        React.createElement(
          'div',
          { style: styles.titleArea },
          title
        ),
        React.createElement(
          Swipeable,
          {
            onSwipedRight: this.prev,
            onSwipedLeft: this.next,
            trackMouse: true
          },
          React.createElement(
            'div',
            { style: styles.reader },
            React.createElement(EpubView, {
              ref: this.readerRef,
              url: url,
              location: location,
              loadingView: loadingView,
              tocChanged: this.onTocChange,
              locationChanged: locationChanged,
              epubOptions: epubOptions,
              getRendition: getRendition
            }),
            swipeable && React.createElement('div', { style: styles.swipeWrapper })
          )
        ),
        React.createElement(
          'button',
          {
            style: Object.assign({}, styles.arrow, styles.prev),
            onClick: this.prev
          },
          '\u2039'
        ),
        React.createElement(
          'button',
          {
            style: Object.assign({}, styles.arrow, styles.next),
            onClick: this.next
          },
          '\u203A'
        )
      ),
      showToc && toc && this.renderToc()
    );
  };

  return ReactReader;
}(PureComponent);

ReactReader.defaultProps = {
  loadingView: React.createElement(
    'div',
    { style: defaultStyles.loadingView },
    'Loading\u2026'
  ),
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  styles: defaultStyles
};

ReactReader.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(ArrayBuffer)]),
  showToc: PropTypes.bool,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  epubOptions: PropTypes.object,
  getRendition: PropTypes.func,
  swipeable: PropTypes.bool
};

export default ReactReader;