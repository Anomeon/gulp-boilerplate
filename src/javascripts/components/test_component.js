import { BaseComponent } from './base_component.js'

export class TestComponent extends BaseComponent {
  initialize() {
    console.log('Test component')
    this.element.classList.add(this.options.class)
  }

  _defaultOptions() {
    return {
      class: 'is-test'
    }
  }
}