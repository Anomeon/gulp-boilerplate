import _extend from 'lodash/extend'

export class BaseComponent {

  constructor(element, options) {
    options = options || {}
    this._setOptions(options)
    this.element = element;
    this.initialize();
  }

  initialize() {
  }

  _defaultOptions() {
    return {}
  }

  _setOptions(options) {
    this.options = _extend(this._defaultOptions(), options)
  }
}
